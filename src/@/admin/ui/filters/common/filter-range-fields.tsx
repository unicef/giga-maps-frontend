import { Checkbox } from '@carbon/react';
import { useStore } from 'effector-react';
import { $formFilterData, onUdpateFilterForm } from '~/@/admin/models/filter-list.model';
import { FilterInputLabel } from '../filter-list.styles';
import { getFilterType } from '~/@/admin/utils/filter-list.util';

const FilterRangeFields = () => {
  const formData = useStore($formFilterData);
  const { isRange } = getFilterType(formData.type);
  if (!isRange) return null;
  return (<FilterInputLabel>
    <Checkbox
      labelText="Auto compute"
      name="options.autoCompute"
      checked={formData?.options?.autoCompute}
      onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, autoCompute: e.target.checked }])}
      id="auto-compute"
      required
    />
  </FilterInputLabel>
  )
}

export default FilterRangeFields