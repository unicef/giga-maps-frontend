
import { SelectItem } from '@carbon/react';
import { useStore } from 'effector-react';
import { useMemo } from 'react';

import { $entityTypes } from '~/@/admin/models/admin-model';
import { $filterColumnList, $filterQueryParamsChoices, $filterTypeChoices, $formFilterData, onUdpateFilterForm } from '~/@/admin/models/filter-list.model';
import { capitalize } from '~/@/admin/utils/common.util';

import { FilterInputLabel, FilterTextInput, SelectDropdown } from '../filter-list.styles';

const FilterCommonFields = ({ isEditMode }: { isEditMode: boolean }) => {
  const filterColumnList = useStore($filterColumnList);
  const { typeChoicesList } = useStore($filterTypeChoices);
  const { queryParamsList } = useStore($filterQueryParamsChoices);
  const formData = useStore($formFilterData);
  const entityTypes = useStore($entityTypes);

  const selectedEntityId = useMemo(() => {
    const numericEntityType = Number(formData.entity_type);
    if (!Number.isNaN(numericEntityType) && numericEntityType > 0) {
      return numericEntityType;
    }
    if (typeof formData.entity_type === 'string') {
      const normalizedValue = formData.entity_type.toLowerCase();
      return entityTypes.find((entity) => entity.code.toLowerCase() === normalizedValue || entity.name.toLowerCase() === normalizedValue)?.id ?? 0;
    }
    return 0;
  }, [entityTypes, formData.entity_type])
  const selectedEntity = entityTypes.find((entity) => entity.id === selectedEntityId);
  const selectedEntityCode = selectedEntity?.code?.toLowerCase() ?? '';

  const applicableColumnConfigurations = useMemo(() => {
    if (!selectedEntityId) return filterColumnList;
    return filterColumnList.filter((item) => {
      if (item.entity_type == null) return true;
      if (typeof item.entity_type === 'number') {
        return item.entity_type === selectedEntityId;
      }
      const value = item.entity_type.toLowerCase();
      return value === selectedEntityCode || value.includes(selectedEntityCode);
    });
  }, [filterColumnList, selectedEntityCode, selectedEntityId])

  const applicableFilterType = useMemo(() => {
    const configuration = applicableColumnConfigurations?.find((item) => item.id === Number(formData.column_configuration));
    if (configuration && typeChoicesList.length) {
      const filterTypes = Object.keys(configuration?.options?.applicable_filter_types ?? {});
      return typeChoicesList.filter((item) => filterTypes.includes(item.value));
    }
    return [];
  }, [applicableColumnConfigurations, formData.column_configuration, typeChoicesList])

  const applicableQueryParams = useMemo(() => {
    const configuration = applicableColumnConfigurations?.find((item) => item.id === Number(formData.column_configuration));
    if (queryParamsList?.length && configuration && typeChoicesList.length && formData.type) {
      const filterTypes = configuration?.options?.applicable_filter_types[formData.type] ?? [];
      return queryParamsList.filter((item) => filterTypes.includes(item.value));
    }
    return [];
  }, [applicableColumnConfigurations, formData.type, typeChoicesList, queryParamsList])


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
      name='entity_type'
      labelText="Entity Type"
      id={`entity-type-select`}
      value={selectedEntityId ? String(selectedEntityId) : ''}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value ? Number(e.target.value) : ''])}
      placeholder="Choose entity type"
    >
      <SelectItem value="" text="Choose entity type" />
      {entityTypes &&
        entityTypes.map((entity) => (
          <SelectItem key={entity.id} value={String(entity.id)} text={capitalize(entity.name)} />
        ))
      }
    </SelectDropdown>
    <SelectDropdown
      required
      name='column_configuration'
      labelText="Parameter"
      id={`parameter-select`}
      value={String(formData.column_configuration)}
      onChange={(e) => onUdpateFilterForm([e.target.name, e.target.value ? Number(e.target.value) : ''])}
      placeholder="Choose parameter type"
    >
      <SelectItem value="" text="Choose parameter" />
      {applicableColumnConfigurations.map((item) => (
        <SelectItem key={item.name} value={String(item.id)} text={item.label}></SelectItem>
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
