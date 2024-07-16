import { AdvanceFilterType } from "~/api/types"
import { StyledTextInputWrapper } from "./filter-button.style"
import { TextInput } from "@carbon/react";

const TextField = ({ value, itemKey, place_holder: placeholder, name, onChange }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  return (
    <StyledTextInputWrapper>
      <TextInput
        size="sm"
        id="text-input-1"
        type="text"
        labelText={name}
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