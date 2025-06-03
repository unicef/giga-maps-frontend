import { AdvanceFilterType } from "~/api/types";
import { StyledCheckbox, StyledTextInputContainer, StyledTextInputWrapper } from "./filter-button.style";
import { FormLabel, TextInput } from "@carbon/react";
import { useEffect, useState } from "react";
import { evaluateExpression } from "~/lib/utils";
import { TooltipStyle } from "~/@/common/style/styled-component-style";
import { Information } from '@carbon/icons-react'
import { useTranslation } from "react-i18next";

const RangeTextInput = ({ name, description, options, value: rangeValue, column_configuration: parameter, itemKey, onChange }: AdvanceFilterType & {
  value: { none_range: boolean; value: string }; itemKey: string; onChange: (key: string, value: {
    none_range: boolean;
    value: string;
  }) => void
}) => {
  const { t } = useTranslation();
  const { downcast_aggr_str, upcast_aggr_str } = parameter?.options ?? {};
  let minPlaceholder = options?.active_range?.min_place_holder ?? options?.minPlaceholder;
  let maxPlaceholder = options?.active_range?.max_place_holder ?? options?.maxPlaceholder;
  const noneFilter = options?.include_none_filter;
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const { value, none_range: isNoneRange } = rangeValue || {};
  // if (minPlaceholder?.startsWith("Min ")) {
  //   minPlaceholder = `${t("min")}${minPlaceholder.split("Min")[1]}`
  // }
  // if (maxPlaceholder?.startsWith("Max ")) {
  //   maxPlaceholder = `${t("max")}${maxPlaceholder.split("Max")[1]}`
  // }
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
          placeholder={minPlaceholder ?? `${t('min')} (0)`}
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
              const min = evaluateExpression(upcast_aggr_str, e.target.value);
              const max = evaluateExpression(upcast_aggr_str, maxValue);
              onChange(itemKey, {
                none_range: isNoneRange,
                value: `${min ? min : null},${max ? max : null}`
              })
            }
          }}
        />
        <TextInput
          size="sm"
          id={`${parameter.name}-max-input`}
          type="number"
          labelText=""
          placeholder={maxPlaceholder ?? `${t('max')}`}
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
              const min = evaluateExpression(upcast_aggr_str, minValue);
              const max = evaluateExpression(upcast_aggr_str, e.target.value);
              onChange(itemKey, {
                none_range: isNoneRange,
                value: `${min ? min : null},${max ? max : null}`
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
        labelText={t('show-null-values')} style={{ padding: "0rem 1rem" }} />}
    </StyledTextInputContainer>
  )
}

export default RangeTextInput