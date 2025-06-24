import { AdvanceFilterType } from "~/api/types";
import { StyledMultiSelectFilterConfig } from "./filter-button.style"
import { useMemo } from "react";
import { TooltipStyle } from "~/@/common/style/styled-component-style";
import { Information } from '@carbon/icons-react'
import { useTranslation } from "react-i18next";

const MultiSelectDropdown = ({ name, description, column_configuration: parameter, options: { placeholder, choices, group_choices: groupChoices } = {}, itemKey, value, extraValue, onChange }: AdvanceFilterType & { value: string; extraValue: string; itemKey: string; onChange: (key: string, value: string, multiKeyValues?: Record<string, string>) => void }) => {
  const { t } = useTranslation();
  const items = useMemo(() => [...(choices ?? [])], [choices])
  const selectedItem = useMemo(() => {
    const values = groupChoices ? extraValue?.split('|') || [] : value?.split('|') || [];
    return items?.filter((item) => values.includes(groupChoices ? item.label : item.value)) ?? []
  }, [items, value, groupChoices])
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
      label={<>{placeholder ?? `${t('select')} ${name}`}</>}
      initialSelectedItems={selectedItem}
      selectedItem={selectedItem}
      onChange={({ selectedItems }: { selectedItems: { value: string; label: string }[] }) => {
        onChange(itemKey, selectedItems.map((item) => item.value).join('|'), groupChoices ? {
          [`ignore_${itemKey}`]: selectedItems.map((item) => item.label).join('|')
        } : undefined);
      }}
    />
  )
}

export default MultiSelectDropdown