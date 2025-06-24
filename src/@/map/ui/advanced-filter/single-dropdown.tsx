import { AdvanceFilterType } from "~/api/types";
import { StyledDropdownSingleSelect } from "./filter-button.style"
import { useMemo } from "react";
import { Center, TooltipStyle } from "~/@/common/style/styled-component-style";
import { Information } from '@carbon/icons-react'
import { useTranslation } from "react-i18next";

const SingleDropdown = ({ name, column_configuration: parameter, options, itemKey, value, onChange, description }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const { t } = useTranslation();
  const items = useMemo(() => [{ label: t('all') as string, value: '' }, ...(options?.choices ?? [])], [options?.choices])
  const selectedItem = useMemo(() => options?.choices?.find((item) => item.value === value) ?? items[0], [items, value])
  return (
    <StyledDropdownSingleSelect
      size={'md'}
      label={name}
      id={`dropdown-${parameter.name}`}
      titleText={<>{name}
        {!!description && <TooltipStyle $maxWidth="12rem" autoAlign={true} align="bottom-left" label={description}>
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