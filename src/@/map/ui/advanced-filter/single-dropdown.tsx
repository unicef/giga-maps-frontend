import { AdvanceFilterType } from "~/api/types";
import { StyledDropdownSingleSelect } from "./filter-button.style"
import { useMemo } from "react";
import { Center, TooltipStyle } from "~/@/common/style/styled-component-style";
import { Information } from '@carbon/icons-react'

const SingleDropdown = ({ name, parameter, choices, itemKey, value, onChange, description }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const items = useMemo(() => [{ label: 'All', value: '' }, ...(choices ?? [])], [choices])
  const selectedItem = useMemo(() => choices?.find((item) => item.value === value) ?? items[0], [items, value])
  return (
    <StyledDropdownSingleSelect
      size={'md'}
      label={name}
      id={`dropdown-${parameter.field}`}
      titleText={<>{name}
        {!!description && <TooltipStyle autoAlign={true} align="bottom" label={description}>
          <button type="button">
            <Information />
          </button>
        </TooltipStyle>}
      </>}
      initialSelectedItem={items[0]}
      items={items}
      selectedItem={selectedItem}
      onChange={({ selectedItem }: { selectedItem: { value: string } }) => {
        onChange(itemKey, selectedItem.value);
      }}
    />
  )
}


export default SingleDropdown;