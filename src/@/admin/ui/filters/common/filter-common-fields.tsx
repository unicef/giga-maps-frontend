
import { SelectItem } from '@carbon/react';
import { useStore } from 'effector-react';
import { FilterInputLabel, FilterTextInput, SelectDropdown } from '../filter-list.styles';
import { $filterColumnList, $filterQueryParamsChoices, $filterTypeChoices, $formFilterData, onUdpateFilterForm } from '~/@/admin/models/filter-list.model';
import { useMemo } from 'react';

const FilterCommonFields = ({ isEditMode }: { isEditMode: boolean }) => {
  const filterColumnList = useStore($filterColumnList);
  const { typeChoicesList } = useStore($filterTypeChoices);
  const { queryParamsList } = useStore($filterQueryParamsChoices);
  const formData = useStore($formFilterData);
  const applicableFilterType = useMemo(() => {
    const configuration = filterColumnList?.find((item) => item.id === Number(formData.column_configuration));
    if (configuration && typeChoicesList.length) {
      const filterTypes = Object.keys(configuration?.options?.applicable_filter_types ?? {});
      return typeChoicesList.filter((item) => filterTypes.includes(item.value));
    }
    return [];
  }, [filterColumnList, formData.column_configuration, typeChoicesList])

  const applicableQueryParams = useMemo(() => {
    const configuration = filterColumnList?.find((item) => item.id === Number(formData.column_configuration));
    if (queryParamsList?.length && configuration && typeChoicesList.length && formData.type) {
      const filterTypes = configuration?.options?.applicable_filter_types[formData.type] ?? [];
      return queryParamsList.filter((item) => filterTypes.includes(item.value));
    }
    return [];
  }, [filterColumnList, formData.type, typeChoicesList, queryParamsList])


  return (<>
    <FilterInputLabel>
      Unique Code
    </FilterInputLabel>
    <FilterTextInput
      type="text"
      labelText=""
      name='code'
      id="layer-code"
      disabled={isEditMode}
      value={formData?.code}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value])}
      required
      placeholder="Enter layer unique code"
    />
    <SelectDropdown
      required
      name='column_configuration'
      labelText="Parameter"
      id={`parameter-select`}
      value={formData.column_configuration}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value])}
      placeholder="Choose parameter type"
    >
      <SelectItem value="" text="Choose parameter" />
      {filterColumnList.map((item) => (
        <SelectItem key={item.name} value={item.id} text={item.label}></SelectItem>
      ))
      }
    </SelectDropdown>
    <SelectDropdown
      required
      name='type'
      labelText="Filter type"
      id={`filter-type-select`}
      value={formData.type}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value])}
      placeholder="Choose filter type"
    >
      <SelectItem value="" text="Choose filter type" />
      {applicableFilterType.map((item) => (
        <SelectItem key={item.value} value={item.value} text={item.label}></SelectItem>
      ))
      }
    </SelectDropdown>
    <FilterInputLabel>
      Filter name
    </FilterInputLabel>
    <FilterTextInput
      type="text"
      placeholder="Enter filter name"
      labelText=""
      name='name'
      id="filter-name"
      value={formData?.name}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value])}
      required
    />
    <FilterInputLabel>
      Filter description
    </FilterInputLabel>
    <FilterTextInput
      type="text"
      placeholder="Enter description"
      labelText=""
      name='description'
      id="filter-description"
      value={formData?.description}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value])}
    />
    <SelectDropdown
      required
      name='query_param_filter'
      labelText="Query Param filter"
      id={`filter-type-select`}
      value={formData?.query_param_filter}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value])}
      placeholder="Choose query param filter"
    >
      <SelectItem value="" text="Choose query param" />
      {applicableQueryParams.map((item) => (
        <SelectItem key={item.value} value={item.value} text={item.label}></SelectItem>
      ))
      }
    </SelectDropdown>
  </>
  )
}

export default FilterCommonFields