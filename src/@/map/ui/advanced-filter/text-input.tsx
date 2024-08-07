import { AdvanceFilterType } from "~/api/types"
import { StyledTextInputWrapper } from "./filter-button.style"
import { TextInput, Tooltip } from "@carbon/react";
import { TooltipButton } from "~/@/sidebar/ui/landing-page-side-bar/styles/landing-page-style";
import { Information } from '@carbon/icons-react'
import { TooltipStyle } from "~/@/common/style/styled-component-style";
import { evaluateExpression } from "~/lib/utils";
import { useEffect, useState } from "react";

const TextField = ({ value, itemKey, options, column_configuration: parameter, name, onChange, description }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const { downcast_aggr_str, upcast_aggr_str } = parameter;
  const [currentValue, setCurrentValue] = useState('');
  useEffect(() => {
    setCurrentValue(evaluateExpression(downcast_aggr_str, value) as string)
  }, [value])
  return (
    <StyledTextInputWrapper>
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
          onChange(itemKey, evaluateExpression(upcast_aggr_str, e.target.value) as string);
        }}
        value={currentValue}
      />
    </StyledTextInputWrapper>
  )
}

export default TextField