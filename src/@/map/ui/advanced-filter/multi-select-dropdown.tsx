import { AdvanceFilterType } from "~/api/types";
import { StyledMultiSelectFilterConfig } from "./filter-button.style"
import { useMemo } from "react";
import { TooltipStyle } from "~/@/common/style/styled-component-style";
import { Information } from '@carbon/icons-react'

const MultiSelectDropdown = ({ name, description, column_configuration: parameter, options: { placeholder, choices } = {}, itemKey, value, onChange }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const items = useMemo(() => [...(choices ?? [])], [choices])
  const selectedItem = useMemo(() => {
    const values = value?.split(',') || [];
    return items?.filter((item) => values.includes(item.value)) ?? []
  }, [items, value])
  return (
    <StyledMultiSelectFilterConfig
      size="lg"
      direction='bottom'
      titleText={<>
        {name}
        {!!description && <TooltipStyle align="bottom" label={description}>
          <button type="button">
            <Information />
          </button>
        </TooltipStyle>}
      </>}
      id={`mutli-select-dropdown-${parameter.name}`}
      items={items}
      label={<>{placeholder ?? `Select ${name}`}{t('1')}</>}
      initialSelectedItems={selectedItem}
      selectedItem={selectedItem}
      onChange={({ selectedItems }: { selectedItems: { value: string }[] }) => {
        onChange(itemKey, selectedItems.map((item) => item.value).join(','));
      }}
    />
  )
}

export default MultiSelectDropdown