import { Information } from '@carbon/icons-react';
import { TextInput } from "@carbon/react";
import { useEffect, useState } from "react";
import { TooltipStyle } from "~/@/common/style/styled-component-style";
import { AdvanceFilterType } from "~/api/types";
import { evaluateExpression } from "~/lib/utils";
import { StyledTextInputWrapper } from "./filter-button.style";

const TextField = ({ value, itemKey, options, column_configuration: parameter, name, onChange, description, light = false }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const { downcast_aggr_str, upcast_aggr_str } = parameter.options ?? {};
  const [currentValue, setCurrentValue] = useState('');
  useEffect(() => {
    setCurrentValue(downcast_aggr_str ? evaluateExpression(downcast_aggr_str, value) as string : value)
  }, [value])
  return (
    <StyledTextInputWrapper light={light}>
      <TextInput
        size="sm"
        id="text-input-1"
        type="text"
        labelText={<>
          {name}
          {!!description && <TooltipStyle align="bottom" label={description}>
            <button type="button">
              <Information />
            </button>
          </TooltipStyle>}
        </>}
        placeholder={options?.placeholder ?? `Enter ${name}`}
        onChange={(e) => {
          onChange(itemKey, upcast_aggr_str ? evaluateExpression(upcast_aggr_str, e.target.value) as string : e.target.value);
        }}
        value={currentValue}
      />
    </StyledTextInputWrapper>
  )
}

export default TextField