import { Button, Form, PopoverContent, IconButton } from "@carbon/react";
import { Close } from '@carbon/icons-react'
import { useStore } from 'effector-react';
import { MouseEvent, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FilterActionButtonWrapper, FilterHeaderWrapper, ScrollableContainer } from "./filter-button.style";
import SingleDropdown from "./single-dropdown";
import MultiSelectDropdown from "./multi-select-dropdown";
import TextField from "./text-input";
import { $advanceFilterList } from "../../map.model";
import { $country, $countrySearchParams } from "~/@/country/country.model";
import RangeTextInput from './range-text-input';
import { router } from "~/core/routes";
import { $isMobile } from "~/core/media-query";

const components = {
  'DROPDOWN': SingleDropdown,
  'DROPDOWN-MULTI': MultiSelectDropdown,
  'RANGE': RangeTextInput,
  'INPUT': TextField,
  'BOOLEAN': SingleDropdown
} as Record<string, React.ComponentType<any>>;


const FilterPopupContent = ({ setOpen }: PropsWithChildren<{ setOpen: (open: boolean) => void, }>) => {
  const [isReady, setIsReady] = useState(false);
  const isMobile = useStore($isMobile);
  const advanceFilterList = useStore($advanceFilterList);
  const { urlFieldList } = useStore($countrySearchParams);
  const [selectedFields, setSelectedFields] = useState<Record<string, string | {
    none_range: boolean;
    value: string;
  }>>({})
  const country = useStore($country);

  const onChange = (key: string, value: string) => {
    setSelectedFields({ ...selectedFields, [key]: value })
  }

  useEffect(() => {
    const selectedFields = {} as Record<string, string | {
      none_range: boolean;
      value: string;
    }>;
    advanceFilterList?.forEach(item => {
      const itemKey = `${item.column_configuration.name}__${item.query_param_filter}`;
      const field = urlFieldList[item.column_configuration.name];
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
    })
    setSelectedFields(selectedFields)
    setIsReady(true)
  }, [advanceFilterList, urlFieldList]);

  const onApply = async (e: MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(selectedFields)) {
      if (value) {
        if (typeof value === 'object') {
          const { none_range, value: rangeValue } = value;
          if (none_range) {
            params.set(`filter__${key.replace('__range', '__none_range')}`, String(rangeValue) || "null,null");
          } else if (rangeValue) {
            params.set(`filter__${key}`, String(rangeValue));
          }
        } else {
          params.set(`filter__${key}`, String(value));
        }
      }
    }
    router.navigate(`${window.location.pathname}?${params.toString()}`);
    setOpen(false);
  }
  // const items = ['All data layers']
  if (!isReady) return null;
  return (
    <PopoverContent className="filter-popover-content">
      <FilterHeaderWrapper>
        <h3>
          Filter Schools by
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
          {advanceFilterList.map((item, index) => {
            const Component = components[item.type] as React.JSXElementConstructor<any>;
            if (!Component) return null;
            const itemKey = `${item.column_configuration.name}__${item.query_param_filter}`;
            return (
              <Component key={`${index}${item.name}`} {...item} itemKey={itemKey} value={selectedFields[itemKey]} onChange={onChange} />
            )
          })}
        </ScrollableContainer>
        <FilterActionButtonWrapper>
          <Button
            type="reset"
            kind="secondary"
            onClick={() => {
              router.navigate(`${window.location.pathname}`);
              setOpen(false)
            }}>
            Reset
          </Button>
          <Button
            type="submit"
            onClick={(e) => { void onApply(e) }}>
            Apply
          </Button>
        </FilterActionButtonWrapper>
      </Form>
    </PopoverContent>
  )
}

export default FilterPopupContent;


