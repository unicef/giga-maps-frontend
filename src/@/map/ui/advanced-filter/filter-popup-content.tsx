import { Close } from '@carbon/icons-react'
import { Button, Form, IconButton, PopoverContent } from "@carbon/react";
import { useStore } from 'effector-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MouseEvent, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useTranslation } from "react-i18next";

import { $country, $countrySearchParams } from "~/@/country/country.model";
import { $activeEntityTypes, $selectedEntityType } from '~/@/entities';
import { EntityType } from '~/@/entities/types/entity-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
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
  console.log("activeEntityTypes", activeEntityTypes);
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
      const itemKey = `${item.column_configuration.name}__${item.query_param_filter}`;
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
        selectedFields[`${item.column_configuration.name}__${item.query_param_filter}`] = ''
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

  // const items = ['All data layers']
  if (!isReady) return null;
  return (
    <PopoverContent className="filter-popover-content">
      <FilterHeaderWrapper>
        <h3>
          {t('filter-schools-by')}
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
          {activeEntityTypes.map(el => {
            return (<Accordion type="single"
              collapsible
              key={'accordian' + el}
              value={openItems === el ? el : undefined}
              onValueChange={(eventAccordion: EntityType) => {
                setOpenItems(eventAccordion || null);
              }}
              className="flex! flex-col! gap-3!">

              <AccordionItem value={el}>
                <AccordionTrigger className="px-3.5! py-3! text-foreground! data-[state=open]:pb-3! data-[state=open]:pt-3!">
                  <span className="text-foreground">{el}</span>
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
            </Accordion>)
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


