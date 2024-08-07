import { Button, RadioButtonGroup, RadioButton, IconButton } from '@carbon/react';
import { Close } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { FilterInputLabel, FilterTextInput } from '../filter-list.styles';
import { $formFilterData, onUdpateFilterForm } from '~/@/admin/models/filter-list.model';
import { getFilterType } from '~/@/admin/utils/filter-list.util';

const FilterDropdownFields = () => {
  const formData = useStore($formFilterData);
  const { isDropdown } = getFilterType(formData.type);
  if (!isDropdown) return null;
  const isLiveChoices = !!formData?.options?.live_choices;
  const choices = formData?.options?.choices ?? [{ label: '', value: '' }];

  return (<>
    <FilterInputLabel>
      <RadioButtonGroup defaultSelected={String(isLiveChoices)} value={String(isLiveChoices)} legendText="Choice Type" name="choiceType" onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, live_choices: e === 'true' ? true : false }])}>
        <RadioButton value="true" labelText="Auto"></RadioButton>
        <RadioButton value="false" labelText="Static"></RadioButton>
      </RadioButtonGroup>
    </FilterInputLabel>
    {!isLiveChoices && <>
      <FilterInputLabel>
        Add Choices
      </FilterInputLabel>
      {choices?.map((item, index) => (<>
        <FilterInputLabel className='center-items'>
          Option {index + 1}
          {choices.length !== 1 && <IconButton
            onClick={() => onUdpateFilterForm(['options', { ...formData.options, choices: choices.filter((_, i) => i !== index) }])}
            renderIcon={Close}
            iconDescription="Remove option"
            align='bottom-right'
            kind="ghost"
            label='Remove option'
            size="sm"
          />}
        </FilterInputLabel>
        <FilterTextInput
          type="text"
          placeholder="Enter choice label"
          labelText=""
          name={`choices.${index}.label`}
          id="filter-name"
          value={item.label}
          onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, choices: [...choices.slice(0, index), { label: e.target.value, value: item.value }, ...choices.slice(index + 1)] }])}
          required
        />
        <FilterTextInput
          type="text"
          placeholder="Enter choice db value"
          labelText=""
          name={`choices.${index}.value`}
          id="filter-name"
          value={item.value}
          onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, choices: [...choices.slice(0, index), { label: item.label, value: e.target.value }, ...choices.slice(index + 1)] }])}
          required
        />
      </>))}
      <FilterInputLabel>
        <Button onClick={() => onUdpateFilterForm(['options', { ...formData.options, choices: [...choices, { label: '', value: '' }] }])} type="button" kind="ghost">Add More Choices</Button>
      </FilterInputLabel>
    </>}
  </>)
}

export default FilterDropdownFields