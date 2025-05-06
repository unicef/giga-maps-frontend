import { Button, IconButton } from "@carbon/react"
import { MultiSelectLayerConfig } from "../../styles/admin-styles";
import { $columnDBChoices, $filterColumnList, $formFilterData, onUdpateFilterForm } from "~/@/admin/models/filter-list.model";
import { FilterInputLabel, FilterTextInput } from "../filter-list.styles";
import { useStore } from "effector-react";
import { Close } from '@carbon/icons-react';
import { useEffect, useMemo } from "react";
import { getFilterChoicesFx } from "~/@/admin/effects/filter-fx";
import { ColumnDBChoicesType } from "~/@/admin/types/filter-list.type";


const MultiSelectChoices = ({ dbChoices, selectedItem, index, onChangeMultiSelect }: { dbChoices: ColumnDBChoicesType['values'], selectedItem: ColumnDBChoicesType['values'][0] | undefined; index: number; onChangeMultiSelect: (_selectedItems: ColumnDBChoicesType['values'], _index: number) => void }) => {

  const selectedItems = useMemo(() => {
    return selectedItem?.value ? selectedItem?.value?.split('|')?.map((item: string) => dbChoices?.find((dbItem: ColumnDBChoicesType['values'][0]) => dbItem.value === item)) ?? [] : []
  }, [selectedItem])
  return <MultiSelectLayerConfig
    name="choice-list"
    required
    label="Choose db values"
    titleText="Group choices"
    $isDark={true}
    itemToString={(item: any) => item?.label || ''}
    itemToElement={(item: any) => (
      <span>
        {item?.label}
      </span>
    )}
    items={dbChoices}
    id={`active-layers`}
    onChange={({ selectedItems }: { selectedItems: ColumnDBChoicesType['values'] }) => {
      onChangeMultiSelect(selectedItems, index)
    }}
    selectedItems={selectedItems}
  />
}

const FilterLiveChoiceForm = () => {
  const formData = useStore($formFilterData);
  const filterColumnList = useStore($filterColumnList);
  const dbChoices = useStore($columnDBChoices);
  const choices = formData?.options?.choices ?? [];
  useEffect(() => {
    if (formData?.column_configuration) {
      const configuration = filterColumnList?.find((item) => item.id === Number(formData.column_configuration));
      if (!configuration) return;
      getFilterChoicesFx({ id: configuration?.id })
    }
  }, [formData?.column_configuration])

  const onChangeMultiSelect = (selectedItems: ColumnDBChoicesType['values'], index: number) => {
    // update choices
    const updatedChoices = choices.map((item, i) => {
      if (i === index) {
        return { ...item, value: selectedItems.map((item) => item?.value).join('|') }
      }
      return item
    })
    onUdpateFilterForm(['options', {
      ...formData.options,
      choices: updatedChoices
    }])
  }
  return (<>
    <FilterInputLabel>
      Create group Choices
    </FilterInputLabel>
    {choices?.map((item, index) => (<>
      <FilterInputLabel className='center-items'>
        Group {index + 1}
        <IconButton
          onClick={() => {
            const isSingleChoice = choices.length === 1;
            const groupChoices = isSingleChoice ? false : formData.options.group_choices;
            const liveChoices = isSingleChoice ? true : formData.options.live_choices;
            onUdpateFilterForm(['options', { ...formData.options, live_choices: liveChoices, group_choices: groupChoices, choices: choices.filter((_, i) => i !== index) }])
          }
          }
          renderIcon={Close}
          iconDescription="Remove option"
          align='bottom-right'
          kind="ghost"
          label='Remove option'
          size="sm"
        />
      </FilterInputLabel>
      <MultiSelectChoices
        index={index}
        dbChoices={dbChoices}
        selectedItem={formData?.options?.choices?.[index]}
        onChangeMultiSelect={onChangeMultiSelect}
      />
      <FilterTextInput
        type="text"
        placeholder="Enter group name"
        labelText=""
        name={`choices.${index}.value`}
        id="filter-name"
        value={formData?.options?.choices?.[index]?.label}
        onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, choices: [...choices.slice(0, index), { label: e.target.value, value: formData?.options?.choices?.[index]?.value ?? '' }, ...choices.slice(index + 1)] }])}
        required
      />
    </>))}
    <FilterInputLabel>
      <Button onClick={() => onUdpateFilterForm(['options', { ...formData.options, choices: [...choices, { label: '', value: '' }], live_choices: false, group_choices: true }])} type="button" kind="ghost">Add a choice group</Button>
    </FilterInputLabel>
  </>
  )
}

export default FilterLiveChoiceForm