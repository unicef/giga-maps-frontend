import { AdvanceFilterType } from "~/api/types";
import { StyledCheckbox, StyledTextInputContainer, StyledTextInputWrapper } from "./filter-button.style";
import { FormLabel, TextInput } from "@carbon/react";
import { useEffect, useState } from "react";
import { evaluateExpression } from "~/lib/utils";
import { $country } from "~/@/country/country.model";
import { useStore } from "effector-react";
import { TooltipStyle } from "~/@/common/style/styled-component-style";
import { Information } from '@carbon/icons-react'

const RangeTextInput = ({ name, description, options, value: rangeValue, column_configuration: parameter, itemKey, onChange }: AdvanceFilterType & {
  value: { none_range: boolean; value: string }; itemKey: string; onChange: (key: string, value: {
    none_range: boolean;
    value: string;
  }) => void
}) => {
  const { downcast_aggr_str, upcast_aggr_str } = parameter;
  const minPlaceholder = options?.active_range?.min_place_holder ?? options?.minPlaceholder;
  const maxPlaceholder = options?.active_range?.min_place_holder ?? options?.maxPlaceholder;
  const noneFilter = options?.active_range?.include_none_filter;
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const { value, none_range: isNoneRange } = rangeValue || {};
  useEffect(() => {
    const [min, max] = value?.split(',') || '';
    setMinValue(Number(evaluateExpression(downcast_aggr_str, min)) || null);
    setMaxValue(Number(evaluateExpression(downcast_aggr_str, max)) || null);
  }, [value]);

  return (
    <StyledTextInputContainer>
      <FormLabel>
        <>
          {name}
          {!!description && <TooltipStyle align="bottom" label={description}>
            <button type="button">
              <Information />
            </button>
          </TooltipStyle>}
        </>
      </FormLabel>
      <StyledTextInputWrapper className="group-input">
        <TextInput
          type="number"
          size="sm"
          id={`${parameter.name}-min-input`}
          labelText=""
          placeholder={minPlaceholder ?? "Min(0)"}
          value={minValue ?? ''}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (isNaN(value)) {
              return;
            }
            if (!value && !maxValue) {
              onChange(itemKey, {
                none_range: isNoneRange,
                value: ''
              });
            } else {
              onChange(itemKey, {
                none_range: isNoneRange,
                value: `${evaluateExpression(upcast_aggr_str, e.target.value) ?? null},${evaluateExpression(upcast_aggr_str, maxValue) ?? null}`
              })
            }
          }}
        />
        <TextInput
          size="sm"
          id={`${parameter.name}-max-input`}
          type="number"
          labelText=""
          placeholder={maxPlaceholder ?? "Max"}
          value={maxValue ?? ''}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (isNaN(value)) {
              return;
            }
            if (!value && !minValue) {
              onChange(itemKey, {
                none_range: isNoneRange,
                value: ''
              });
            } else {
              onChange(itemKey, {
                none_range: isNoneRange,
                value: `${evaluateExpression(upcast_aggr_str, minValue) ?? null},${evaluateExpression(upcast_aggr_str, e.target.value) ?? null}`
              })
            }
          }}
        />
      </StyledTextInputWrapper>
      {noneFilter && <StyledCheckbox onChange={() => {
        const currentNoneRange = !isNoneRange;
        let value = '';
        if ([minValue, maxValue].filter(Boolean).length) {
          value = `${evaluateExpression(upcast_aggr_str, minValue) ?? null},${evaluateExpression(upcast_aggr_str, maxValue) ?? null}`
        }
        onChange(itemKey, { none_range: currentNoneRange, value })
      }}
        checked={isNoneRange}
        id={`checkbox-${itemKey}`}
        labelText="Show null values" style={{ padding: "0rem 1rem" }} />}
    </StyledTextInputContainer>
  )
}

export default RangeTextInput