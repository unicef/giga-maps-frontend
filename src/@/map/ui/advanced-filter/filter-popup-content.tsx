import { Close } from '@carbon/icons-react'
import { Button, Form, IconButton, PopoverContent } from "@carbon/react";
import { useStore } from 'effector-react';
import { ChevronDown } from 'lucide-react';
import { Fragment, MouseEvent, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useTranslation } from "react-i18next";

import { $countrySearchParams } from "~/@/country/country.model";
import { $activeEntityTypes } from '~/@/entities';
import { EntityType } from '~/@/entities/types/entity-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Separator } from '~/components/ui/separator';
import { router } from "~/core/routes";

import { $advanceFilterList } from "../../map.model";
import {
  deleteAdvancedFiltersForEntities,
  suppressDefaultAdvancedFilters,
} from './advanced-filter.model';
import {
  buildFilterChipsByEntity,
  type FilterChip,
  hasSelectedFilterValue,
} from './filter-chip-utils';
import CollapsibleFilterChips from './collapsible-filter-chips';
import { FilterActionButtonWrapper, FilterHeaderWrapper, ScrollableContainer } from "./filter-button.style";
import MultiSelectDropdown from "./multi-select-dropdown";
import RangeTextInput from './range-text-input';
import SingleDropdown from "./single-dropdown";
import TextField from "./text-input";

export const components = {
  'DROPDOWN': SingleDropdown,
  'DROPDOWN_MULTISELECT': MultiSelectDropdown,
  'RANGE': RangeTextInput,
  'INPUT': TextField,
  'BOOLEAN': SingleDropdown
} as Record<string, React.ComponentType<any>>;

type SelectedFieldValue = string | {
  none_range: boolean;
  value: string;
};

const hasSelectedValue = hasSelectedFilterValue;

const navigateWithSearchParams = (params: URLSearchParams) => {
  const search = params.toString();
  router.navigate(
    search ? `${window.location.pathname}?${search}` : window.location.pathname,
  );
};

const getEntityFilterGroupLabel = (entityType: EntityType, t: (key: string) => string) => {
  if (entityType === EntityType.SCHOOL) return t('schools');
  if (entityType === EntityType.HEALTH) return t('health-facilities_other');
  return t(`${entityType}-entity-label`);
};

const FilterPopupContent = ({ setOpen }: PropsWithChildren<{ setOpen: (open: boolean) => void, }>) => {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  const activeEntityTypes = useStore($activeEntityTypes);
  const advanceFilterList = useStore($advanceFilterList);
  const { urlFieldList } = useStore($countrySearchParams);
  const [openItems, setOpenItems] = useState<EntityType[]>([]);
  const [expandedChipGroups, setExpandedChipGroups] = useState<Partial<Record<EntityType, boolean>>>({});
  const [selectedFields, setSelectedFields] = useState<Record<string, SelectedFieldValue>>({})
  // multiple key value pair
  const onChange = (key: string, value: string, multiKeyValues?: Record<string, string>) => {
    setSelectedFields((current) => ({
      ...current,
      [key]: value,
      ...multiKeyValues
    }))
  }

  useEffect(() => {
    const nextSelectedFields = {} as Record<string, SelectedFieldValue>;
    const activeEntityTypeSet = new Set<string>(activeEntityTypes);
    advanceFilterList?.forEach(item => {
      if (!activeEntityTypeSet.has(item.entity_type)) return;

      const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
      const field = urlFieldList[itemKey];
      const extraItemKey = `ignore_${itemKey}`;
      const extraField = urlFieldList[extraItemKey];
      if (field) {
        const isRange = field.filter.includes('range');
        const isNone = field.filter.includes('none');
        nextSelectedFields[itemKey] = isRange ? {
          none_range: isNone,
          value: field.value
        } : field.value
      } else {
        nextSelectedFields[`${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`] = ''
      }
      if (extraField) {
        nextSelectedFields[`${extraItemKey}`] = extraField.value
      }
    })
    setSelectedFields(nextSelectedFields)
    setIsReady(true)
  }, [activeEntityTypes, advanceFilterList, urlFieldList]);

  const onApply = (e: MouseEvent) => {
    e.preventDefault();
    const prefix = 'filter__';
    const params = new URLSearchParams(window.location.search);
    deleteAdvancedFiltersForEntities(params, activeEntityTypes);

    for (const [key, value] of Object.entries(selectedFields)) {
      if (value) {
        if (typeof value === 'object') {
          const { none_range: noneRange, value: rangeValue } = value;
          if (noneRange) {
            params.set(
              `${prefix}${key.replace('__range', '__none_range')}`,
              String(rangeValue) || "null,null"
            );
          } else if (rangeValue) {
            params.set(`${prefix}${key}`, String(rangeValue));
          }
        } else {
          params.set(`${prefix}${key}`, String(value));
        }
      }
    }
    suppressDefaultAdvancedFilters(activeEntityTypes);
    navigateWithSearchParams(params);
    setOpen(false);
  }

  const onReset = (e: MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    deleteAdvancedFiltersForEntities(params, activeEntityTypes);

    suppressDefaultAdvancedFilters(activeEntityTypes);
    navigateWithSearchParams(params);
  }

  const entitiesWithFilters = useMemo(() => {
    return activeEntityTypes
      .filter(el => advanceFilterList.some(item => item.entity_type === el))
      .sort((a, b) => a < b ? 1 : -1);
  }, [activeEntityTypes, advanceFilterList])

  const selectedFilterChipsByEntity = useMemo(() => {
    return buildFilterChipsByEntity(
      advanceFilterList ?? [],
      activeEntityTypes,
      selectedFields,
      t,
    ) as Record<EntityType, FilterChip[]>;
  }, [activeEntityTypes, advanceFilterList, selectedFields, t]);

  const entityWiseSelectedFilterCount = useMemo(() => {
    return activeEntityTypes.reduce((acc, elEntity) => {
      acc[elEntity] = (selectedFilterChipsByEntity[elEntity] ?? []).length;
      return acc;
    }, {} as Record<string, number>)
  }, [activeEntityTypes, selectedFilterChipsByEntity])

  const clearSingleBadge = (chip: FilterChip, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFields(prev => {
      const next = { ...prev };
      const ignoreKey = `ignore_${chip.itemKey}`;

      if (chip.removeValue !== undefined) {
        const removeKey = chip.removeValue.trim().toLowerCase();
        const currentValues = String(prev[chip.itemKey] ?? '').split('|').filter(Boolean);
        const nextValues = currentValues.filter(
          (value) => value.trim().toLowerCase() !== removeKey,
        );
        next[chip.itemKey] = nextValues.join('|');

        if (prev[ignoreKey]) {
          const filterItem = advanceFilterList?.find((item) => {
            const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
            return itemKey === chip.itemKey;
          });
          const choiceLabel = filterItem?.options?.choices?.find(
            (choice) => choice.value.trim().toLowerCase() === removeKey
              || choice.label.trim().toLowerCase() === removeKey,
          )?.label;

          const currentLabels = String(prev[ignoreKey]).split('|').filter(Boolean);
          next[ignoreKey] = currentLabels
            .filter((label) => label !== choiceLabel && label.trim().toLowerCase() !== removeKey)
            .join('|');
        }
      } else {
        next[chip.itemKey] = "";
        next[ignoreKey] = "";
      }

      return next;
    });
  };

  const clearEntityBadges = (entityType: EntityType, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFields(prev => {
      const next = { ...prev };
      advanceFilterList
        .filter(item => item.entity_type === entityType)
        .forEach((item) => {
          const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
          next[itemKey] = "";
          next[`ignore_${itemKey}`] = "";
        });
      return next;
    });
  };

  const [hasInitializedOpenItems, setHasInitializedOpenItems] = useState(false);
  useEffect(() => {
    if (entitiesWithFilters.length > 0 && !hasInitializedOpenItems) {
      setOpenItems([...entitiesWithFilters]);
      setHasInitializedOpenItems(true);
    }
  }, [entitiesWithFilters, hasInitializedOpenItems]);
  if (!isReady) return null;
  return (
    <PopoverContent className="filter-popover-content">
      <FilterHeaderWrapper>
        <h3>
          {t('filters')}
        </h3>
        <IconButton
          size="md"
          data-testid="filter-close"
          align="bottom-right"
          label='Close'
          kind="ghost"
          onClick={() => {
            setOpen(false);
          }}><Close size={18} />
        </IconButton>
      </FilterHeaderWrapper>
      <Form aria-label="filter-form">
        <ScrollableContainer>
          {entitiesWithFilters.some((el) => (entityWiseSelectedFilterCount[el] ?? 0) > 0) && (
            <div className="flex! flex-col! gap-4! px-3.5! pb-3!">
              {entitiesWithFilters.map((el) => {
                const selectedCount = entityWiseSelectedFilterCount[el] ?? 0;
                const chips = selectedFilterChipsByEntity[el] ?? [];
                if (selectedCount === 0) return null;

                const isExpanded = expandedChipGroups[el] ?? false;

                return (
                  <div key={`active-filters-${el}`} className="flex! flex-col! gap-2!">
                    <div className="flex! w-full! items-center! gap-2!">
                      <span className="text-[14px]! leading-[20px]! text-foreground!">
                        {getEntityFilterGroupLabel(el, t)} ({selectedCount})
                      </span>
                      <button
                        type="button"
                        className="text-[#0f62fe]! text-[12px]! font-normal! cursor-pointer! hover:underline!"
                        onClick={(e) => clearEntityBadges(el, e)}
                      >
                        Clear
                      </button>
                    </div>
                    <CollapsibleFilterChips
                      chips={chips}
                      selectedCount={selectedCount}
                      isExpanded={isExpanded}
                      onClearChip={clearSingleBadge}
                      onToggleExpanded={(expanded) => {
                        setExpandedChipGroups((current) => ({
                          ...current,
                          [el]: expanded,
                        }));
                      }}
                    />
                  </div>
                );
              })}
              <Separator />
            </div>
          )}

          <Accordion type="multiple"
            value={openItems}
            onValueChange={(eventAccordion: string[]) => {
              setOpenItems(eventAccordion as EntityType[]);
            }}
            className="flex! flex-col! gap-3!">
            {entitiesWithFilters.map((el, index) => {
              return (
                <Fragment key={'accordion-item-' + el}>
                  <AccordionItem value={el}>
                    <AccordionTrigger className="px-3.5! py-3! text-foreground! data-[state=open]:pb-3! data-[state=open]:pt-3! font-['Open_Sans',sans-serif]! font-normal! not-italic! text-[16px]! leading-[24px]! tracking-[0%]! ">
                      <span className="whitespace-nowrap!">{getEntityFilterGroupLabel(el, t)}</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: openItems.includes(el) ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </AccordionTrigger>
                    <AccordionContent>
                      {advanceFilterList.filter(elAdvanceFilter => elAdvanceFilter.entity_type === el).map((item, index) => {
                        const Component = components[item.type] as React.JSXElementConstructor<any>;
                        if (!Component) return null;
                        const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
                        const extraItemKey = `ignore_${itemKey}`;
                        const extraValue = selectedFields[extraItemKey];
                        return (
                          <Component key={`${index}${item.name}`} {...item} itemKey={itemKey} value={selectedFields[itemKey]} extraValue={extraValue} onChange={onChange} />
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                  {index < entitiesWithFilters.length - 1 && <Separator className="my-2!" />}
                </Fragment>
              )
            })}
          </Accordion>

        </ScrollableContainer>
        <FilterActionButtonWrapper>
          <Button
            type="reset"
            kind="secondary"
            onClick={(event: MouseEvent<Element, globalThis.MouseEvent>) => {
              void onReset(event);
            }}>
            {t('reset')}
          </Button>
          <Button
            type="submit"
            onClick={(event: MouseEvent<Element, globalThis.MouseEvent>) => {
              void onApply(event);
            }}>
            {t('apply')}
          </Button>
        </FilterActionButtonWrapper>
      </Form>
    </PopoverContent>
  )
}

export default FilterPopupContent;
