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
      name="options.auto_compute"
      checked={formData?.options?.range_auto_compute}
      onChange={(e) => onUdpateFilterForm(['options', { ...formData.options, range_auto_compute: e.target.checked }])}
      id="auto-compute"
    />
  </FilterInputLabel>
  )
}

export default FilterRangeFields