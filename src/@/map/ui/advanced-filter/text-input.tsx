import { AdvanceFilterType } from "~/api/types"
import { StyledTextInputWrapper } from "./filter-button.style"
import { TextInput, Tooltip } from "@carbon/react";
import { TooltipButton } from "~/@/sidebar/ui/landing-page-side-bar/styles/landing-page-style";
import { Information } from '@carbon/icons-react'
import { TooltipStyle } from "~/@/common/style/styled-component-style";

const TextField = ({ value, itemKey, place_holder: placeholder, name, onChange, description }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
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
        placeholder={placeholder ?? `Enter ${name}`}
        onChange={(e) => {
          onChange(itemKey, e.target.value);
        }}
        value={value}
      />
    </StyledTextInputWrapper>
  )
}

export default TextField