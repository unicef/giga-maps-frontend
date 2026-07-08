import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FilterTooltip } from "./filter-tooltip";
import { AdvanceFilterType } from "~/api/types";
import { StyledDropdownSingleSelect } from "./filter-button.style";

const SingleDropdown = ({ name, column_configuration: parameter, options, itemKey, value, onChange, description, light = false }: AdvanceFilterType & { value: string; itemKey: string; onChange: (key: string, value: string) => void }) => {
  const { t } = useTranslation();
  const items = useMemo(() => [{ label: t('all') as string, value: '' }, ...(options?.choices ?? [])], [options?.choices])
  const selectedItem = useMemo(() => options?.choices?.find((item) => item.value === value) ?? items[0], [items, value])
  return (
    <StyledDropdownSingleSelect
      light={light}
      size={'md'}
      label={name}
      id={`dropdown-${parameter.name}`}
      titleText={<>{name}
        {!!description && <FilterTooltip label={description} />}
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