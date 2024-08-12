import { useStore } from 'effector-react';
import { FilterInputLabel, FilterTextInput } from '../filter-list.styles';
import { $formFilterData, onUdpateFilterForm } from '~/@/admin/models/filter-list.model';
import { getFilterType } from '~/@/admin/utils/filter-list.util';

const FilterPlaceholderForm = () => {
  const formData = useStore($formFilterData);

  const { isRange, isInput } = getFilterType(formData.type);
  const isAutoCompute = formData?.options?.range_auto_compute;
  return (<>
    {isInput && <>
      <FilterInputLabel>
        Placeholder
      </FilterInputLabel>
      <FilterTextInput
        type="text"
        placeholder="Enter placeholder"
        labelText=""
        name='placeholder'
        id="filter-name"
        value={formData?.options?.placeholder}
        onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, placeholder: e.target.value }])}
        required
      />
    </>}

    {isRange && !isAutoCompute && <>
      <FilterInputLabel>
        Min Placeholder
      </FilterInputLabel>
      <FilterTextInput
        type="text"
        placeholder="Enter min placeholder"
        labelText=""
        name='minPlaceholder'
        id="filter-name"
        value={formData?.options?.minPlaceholder}
        onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, minPlaceholder: e.target.value }])}
        required
      />
      <FilterInputLabel>
        Max Placeholder
      </FilterInputLabel>
      <FilterTextInput
        type="text"
        placeholder="Enter max placeholder"
        labelText=""
        name='maxPlaceholder'
        id="filter-name"
        value={formData?.options?.maxPlaceholder}
        onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, maxPlaceholder: e.target.value }])}
        required
      />
    </>}
  </>)
}

export default FilterPlaceholderForm