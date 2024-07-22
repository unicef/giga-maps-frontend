import { AdvanceFilterType } from "~/api/types";
import { StyledMultiSelectFilterConfig } from "./filter-button.style"
import { useMemo } from "react";

interface DropdownType {
  label: string;
  titleText: string;
  items: string[];
}

const MultiSelectDropdown = ({ name, parameter, place_holder: placeholder, choices, itemKey, value, onChange }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const items = useMemo(() => [...(choices ?? [])], [choices])
  const selectedItem = useMemo(() => {
    const values = value?.split(',') || [];
    return items?.filter((item) => values.includes(item.value)) ?? []
  }, [items, value])
  return (
    <StyledMultiSelectFilterConfig
      size="lg"
      direction='bottom'
      titleText={name}
      id={`mutli-select-dropdown-${parameter.field}`}
      items={items}
      label={placeholder ?? `Select ${name}`}
      initialSelectedItems={selectedItem}
      selectedItem={selectedItem}
      onChange={({ selectedItems }: { selectedItems: { value: string }[] }) => {
        onChange(itemKey, selectedItems.map((item) => item.value).join(','));
      }}
    />
  )
}

export default MultiSelectDropdown