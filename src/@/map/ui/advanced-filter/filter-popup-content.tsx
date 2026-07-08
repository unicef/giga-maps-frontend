import { color } from '@carbon/charts';
import { Close } from '@carbon/icons-react'
import { Button, Form, IconButton, PopoverContent } from "@carbon/react";
import { useStore } from 'effector-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MouseEvent, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useTranslation } from "react-i18next";

import { $country, $countrySearchParams } from "~/@/country/country.model";
import { $activeEntityTypes, $selectedEntityType, DEFAULT_ENTITY_REGISTRY } from '~/@/entities';
import { EntityType } from '~/@/entities/types/entity-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { $isMobile } from "~/core/media-query";
import { router } from "~/core/routes";

import { $advanceFilterList } from "../../map.model";
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


const FilterPopupContent = ({ setOpen }: PropsWithChildren<{ setOpen: (open: boolean) => void, }>) => {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  const isMobile = useStore($isMobile);
  const selectedEntityType = useStore($selectedEntityType);
  const activeEntityTypes = useStore($activeEntityTypes);
  const advanceFilterList = useStore($advanceFilterList);
  const { urlFieldList } = useStore($countrySearchParams);
  const [openItems, setOpenItems] = useState<EntityType | null>(null);
  const [selectedFields, setSelectedFields] = useState<Record<string, string | {
    none_range: boolean;
    value: string;
  }>>({})
  const country = useStore($country);
  // multiple key value pair
  const onChange = (key: string, value: string, multiKeyValues?: Record<string, string>) => {
    setSelectedFields({
      ...selectedFields,
      [key]: value,
      ...multiKeyValues
    })
  }

  useEffect(() => {
    const selectedFields = {} as Record<string, string | {
      none_range: boolean;
      value: string;
    }>;
    advanceFilterList?.forEach(item => {
      const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
      const field = urlFieldList[itemKey];
      const extraItemKey = `ignore_${itemKey}`;
      const extraField = urlFieldList[extraItemKey];
      if (field) {
        const isRange = field.filter.includes('range');
        const isNone = field.filter.includes('none');
        selectedFields[itemKey] = isRange ? {
          none_range: isNone,
          value: field.value
        } : field.value
      } else {
        selectedFields[`${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`] = ''
      }
      if (extraField) {
        selectedFields[`${extraItemKey}`] = extraField.value
      }
    })
    setSelectedFields(selectedFields)
    setIsReady(true)
  }, [advanceFilterList, urlFieldList]);

  const onApply = async (e: MouseEvent) => {
    e.preventDefault();
    const prefix = 'filter__';
    const params = new URLSearchParams(window.location.search);
    for (const key of Array.from(params.keys())) {
      if (key.startsWith(prefix)) {
        params.delete(key);
      }
    }

    for (const [key, value] of Object.entries(selectedFields)) {
      if (value) {
        if (typeof value === 'object') {
          const { none_range, value: rangeValue } = value;
          if (none_range) {
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
    router.navigate(`${window.location.pathname}?${params.toString()}`);
    setOpen(false);
  }

  const onReset = async (e: MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filter__')) {
        params.delete(key);
      }
    }

    router.navigate(`${window.location.pathname}?${params.toString()}`);
    setOpen(false)
  }

  const entityWiseSelectedFilterCount = useMemo(() => {
    return activeEntityTypes.reduce((acc, elEntity) => {
      acc[elEntity] = Object.keys(selectedFields).filter((elSelectedField: string) => elSelectedField.startsWith(elEntity + "__")).length;
      return acc;
    }, {} as Record<string, number>)
  }, [activeEntityTypes, selectedFields])

  const activeFilterBadges = useMemo(() => {
    if (Object.keys(selectedFields).length === 0) return [];
    const filteredAdvanceFilterList = advanceFilterList
      .filter(item => {
        const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
        const val = selectedFields[itemKey];
        if (val) {
          return true
        };
        return false;
      });

    const mapedfilteredAdvanceFilterList = filteredAdvanceFilterList.map(item => ({
      entity: item.entity_type,
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

  // const items = ['All data layers']
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
          {activeFilterBadges.length > 0 && (
            <div style={{ padding: '0.5rem 10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {activeFilterBadges.map(({ entity, label, itemKey }) => (
                <Badge
                  key={itemKey}
                  className="flex! justify-between! bg-[#85FFBC]! h-[22px]! w-[210px]! pt-[2px]! pb-[2px]! pl-[10px]! pr-[10px]! text-black! text-[12px]! leading-[18px]! opacity-100! rounded-md! gap-3!"
                >
                  <span><strong>{entity}:</strong> {label}</span>
                  <button
                    type="button"
                    onClick={(e: any) => clearSingleBadge(itemKey, e)}
                  >
                    <Close size={12} />
                  </button>
                </Badge>
              ))}
              <Badge
                className="flex! justify-between! bg-[#393939]! h-[22px]! w-auto! pt-[2px]! pb-[2px]! pl-[10px]! pr-[10px]! text-white! text-[12px]! leading-[18px]! opacity-100! rounded-md! gap-3! cursor-pointer!"
                onClick={(e) => clearAllBadges(e)}
              >
                <span className='flex! items-center! gap-1!'> {t('clear-all')} <Close size={12} /></span>

              </Badge>
            </div>
          )}

          {activeEntityTypes.sort((a, b) => a < b ? 1 : -1).map((el, index) => {
            return (<><Accordion type="single"
              collapsible
              key={'accordian' + el}
              value={openItems === el ? el : undefined}
              onValueChange={(eventAccordion: EntityType) => {
                setOpenItems(eventAccordion || null);
              }}
              className="flex! flex-col! gap-3!">

              <AccordionItem value={el}>
                <AccordionTrigger className="px-3.5! py-3! text-foreground! data-[state=open]:pb-3! data-[state=open]:pt-3! font-['Open_Sans',sans-serif]! font-normal! not-italic! text-[16px]! leading-[24px]! tracking-[0%]! ">
                  <span >{t(DEFAULT_ENTITY_REGISTRY[el].slug, DEFAULT_ENTITY_REGISTRY[el].slug === (EntityType.SCHOOL as string) ? { count: 1 } : undefined)} {entityWiseSelectedFilterCount[el] > 0 ? `(${entityWiseSelectedFilterCount[el]})` : ''}</span>
                  {openItems === el ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
            </Accordion>
              {index < activeEntityTypes.length - 1 && <Separator className="my-2!" />}
            </>)
          })}

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
            onClick={(e) => { void onApply(e) }}>
            {t('apply')}
          </Button>
        </FilterActionButtonWrapper>
      </Form>
    </PopoverContent>
  )
}

export default FilterPopupContent;


