import { AdvanceFilterType } from "~/api/types";
import { StyledCheckbox, StyledTextInput, StyledTextInputContainer, StyledTextInputWrapper } from "./filter-button.style";
import { Checkbox, FormLabel, TextInput } from "@carbon/react";
import { useEffect, useState } from "react";
import { evaluateExpression } from "~/lib/utils";
import { TextInputWrapper } from "~/@/api-docs/ui/components/modals/modals.style";
import { $country } from "~/@/country/country.model";
import { useStore } from "effector-react";

const RangeTextInput = ({ name, active_countries_range = {}, value: rangeValue, parameter, include_none_filter: noneFilter, itemKey, downcast_aggr_str, upcast_aggr_str, onChange }: AdvanceFilterType & {
  value: { none_range: boolean; value: string }; itemKey: string; onChange: (key: string, value: {
    none_range: boolean;
    value: string;
  }) => void
}) => {
  const country = useStore($country);
  const placeholders = active_countries_range[country?.id || 'default'] || {};
  const { min_place_holder: minPlaceholder, max_place_holder: maxPlaceholder, max_value = Infinity, min_value = 0 } = placeholders;
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
      <FormLabel>{name}</FormLabel>
      <StyledTextInputWrapper className="group-input">
        <TextInput
          type="number"
          size="sm"
          id={`${parameter.field}-min-input`}
          labelText=""
          placeholder={minPlaceholder ?? "Min(0)"}
          value={minValue ? minValue : ''}
          // min={min_value}
          // max={max_value}
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
          id={`${parameter.field}-max-input`}
          type="number"
          labelText=""
          placeholder={maxPlaceholder ?? "Max"}
          value={maxValue ? maxValue : ''}
          // min={min_value}
          // max={max_value}
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