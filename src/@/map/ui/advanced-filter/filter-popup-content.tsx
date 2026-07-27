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
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { router } from "~/core/routes";

import { $advanceFilterList } from "../../map.model";
import {
  deleteAdvancedFiltersForEntities,
  suppressDefaultAdvancedFilters,
} from './advanced-filter.model';
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

const hasSelectedValue = (value: SelectedFieldValue | undefined) =>
  typeof value === 'object'
    ? value.none_range || Boolean(value.value)
    : Boolean(value);

const navigateWithSearchParams = (params: URLSearchParams) => {
  const search = params.toString();
  router.navigate(
    search ? `${window.location.pathname}?${search}` : window.location.pathname,
  );
};


const FilterPopupContent = ({ setOpen }: PropsWithChildren<{ setOpen: (open: boolean) => void, }>) => {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  const activeEntityTypes = useStore($activeEntityTypes);
  const advanceFilterList = useStore($advanceFilterList);
  const { urlFieldList } = useStore($countrySearchParams);
  const [openItems, setOpenItems] = useState<EntityType[]>([]);
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
    setOpen(false)
  }

  const entityWiseSelectedFilterCount = useMemo(() => {
    return activeEntityTypes.reduce((acc, elEntity) => {
      acc[elEntity] = Object.entries(selectedFields).filter(
        ([key, value]) => key.startsWith(`${elEntity}__`) && hasSelectedValue(value),
      ).length;
      return acc;
    }, {} as Record<string, number>)
  }, [activeEntityTypes, selectedFields])

  const entitiesWithFilters = useMemo(() => {
    return activeEntityTypes
      .filter(el => advanceFilterList.some(item => item.entity_type === el))
      .sort((a, b) => a < b ? 1 : -1);
  }, [activeEntityTypes, advanceFilterList])

  const activeFilterBadges = useMemo(() => {
    if (Object.keys(selectedFields).length === 0) return [];
    const filteredAdvanceFilterList = advanceFilterList
      .filter(item => {
        const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
        const val = selectedFields[itemKey];
        if (hasSelectedValue(val)) {
          return true
        };
        return false;
      });

    const mapedfilteredAdvanceFilterList = filteredAdvanceFilterList.map(item => ({
      entity: t(`${item.entity_type}-entity-label`, { count: 1 }),
      label: item.name,
      itemKey: `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`,
    }));


    return mapedfilteredAdvanceFilterList;
  }, [advanceFilterList, selectedFields]);

  const clearSingleBadge = (itemKey: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFields(prev => {
      const next = { ...prev };
      next[itemKey] = "";
      next[`ignore_${itemKey}`] = "";
      return next;
    });
  };

  const clearAllBadges = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFields(prev => {
      const next = { ...prev };
      activeFilterBadges.forEach(({ itemKey }) => {
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
          {t('filter-by')}
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
          {activeFilterBadges.length > 0 && (
            <div style={{ padding: '0.5rem 10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {activeFilterBadges.map(({ entity, label, itemKey }) => (
                <Badge
                  key={itemKey}
                  className="flex! items-center! justify-between! bg-[#85FFBC]! h-[22px]! w-[210px]! pt-[2px]! pb-[2px]! pl-[10px]! pr-[10px]! text-black! text-[12px]! leading-[18px]! opacity-100! rounded-md! gap-2!"
                >
                  <span
                    className="truncate! min-w-0! flex-1!"
                    title={`${entity}: ${label}`}
                  >
                    <strong>{entity}:</strong> {label}
                  </span>
                  <button
                    type="button"
                    className="shrink-0! flex! items-center! justify-center! cursor-pointer!"
                    onClick={(e: any) => clearSingleBadge(itemKey, e)}
                  >
                    <Close size={12} />
                  </button>
                </Badge>
              ))}
              <Badge
                className="flex! justify-between! bg-[#393939]! h-[22px]! w-auto! pt-[2px]! pb-[2px]! pl-[10px]! pr-[10px]! text-white! text-[12px]! leading-[18px]! opacity-100! rounded-md! gap-1.5! cursor-pointer! items-center!"
                onClick={(e) => clearAllBadges(e)}
              >
                <span>{t('clear-all')}</span>
                <Close size={12} className="fill-current!" />
              </Badge>
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
                      <span className="whitespace-nowrap!">{t(`${el}-entity-label`, { count: 1 })}  {entityWiseSelectedFilterCount[el] > 0 ? `(${entityWiseSelectedFilterCount[el]})` : ''}</span>
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
