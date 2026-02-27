import { SelectItem, TextInput } from "@carbon/react";
import { useStore } from "effector-react";
import { useMemo } from "react";

import { DataSourceName, EntityCode, LayerDataSourceByEntityCode, LayerDataSourceKey, LayerTypeNames } from "~/@/admin/constants/giga-layer.constant";
import { $appConfigValues, $entityTypes } from "~/@/admin/models/admin-model";
import { $apiSourceValues, $formData, onUdpateGigaLayerForm } from "~/@/admin/models/giga-layer.model";
import { ColumnConfig, DataSource, LayerTypeChoices, SourceTypeItem } from "~/@/admin/types/giga-layer.type";
import { $countryList } from "~/@/api-docs/models/explore-api.model";
import { CountryListType } from "~/@/api-docs/types/country-list.type";

import { DataLayerFieldContainer, DataLayerNameField, InputLabel, MultiSelectLayerConfig, SelectLayerConfig } from "../../../styles/admin-styles";

export default function GigaFields({ isEditMode, isDefaultLayer }: { readonly isEditMode: boolean, readonly isDefaultLayer: boolean }) {
  const formData = useStore($formData);
  const appConfigValues = useStore($appConfigValues)
  const countryList = useStore($countryList);
  const apiSourceValues = useStore($apiSourceValues)
  const entityTypes = useStore($entityTypes);
  const apiSourceSelected = useMemo(() => {
    return apiSourceValues.filter((item) => formData?.dataSource.includes(item.id))
  }, [formData.dataSource, apiSourceValues])
  const parameters = useMemo<ColumnConfig[]>(() => {
    const list = apiSourceSelected
      .flatMap((item) => item.column_config)
      .filter((item) => item.is_parameter);
    const uniqueByName = new Map<string, ColumnConfig>();
    list.forEach((item) => {
      uniqueByName.set(item.name, item);
    });
    return Array.from(uniqueByName.values());
  }, [apiSourceSelected])
  const selectedCountries = useMemo(() => {
    if (!countryList || !formData?.applicableCountries) return [];
    return countryList?.filter(item => formData?.applicableCountries.includes(item.id))
  }, [formData?.applicableCountries, countryList])

  const dataSourceList = useMemo<SourceTypeItem[]>(() => {
    const type = formData.type;
    const entityType = Number(formData.entityType);
    if (!type || !entityType) return [];

    const selectedEntity = entityTypes.find((entity) => entity.id === entityType);
    const normalized = `${selectedEntity?.code ?? ''} ${selectedEntity?.name ?? ''}`.toLowerCase();
    const entityCode = normalized.includes(EntityCode.HEALTH) ? EntityCode.HEALTH : normalized.includes(EntityCode.SCHOOL) ? EntityCode.SCHOOL : null;
    if (!entityCode) return [];

    const key = `${entityCode}_${type}` as LayerDataSourceKey;
    const source = LayerDataSourceByEntityCode[key] ?? [];
    return source.map((sourceName) => ({
      type: sourceName,
      name: DataSourceName[sourceName]
    }))
  }, [entityTypes, formData.type, formData.entityType])
  return <>
    <DataLayerFieldContainer>
      <InputLabel>
        Unique Code
      </InputLabel>
      <DataLayerNameField>
        <TextInput
          type="text"
          labelText=""
          name='code'
          id="layer-code"
          disabled={isEditMode}
          value={formData?.code}
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
          required
          placeholder="Enter layer unique code"
        />
      </DataLayerNameField>
    </DataLayerFieldContainer>
    <DataLayerFieldContainer>
      <InputLabel>
        Layer Name
      </InputLabel>
      <DataLayerNameField>
        <TextInput
          type="text"
          labelText=""
          name='name'
          id="layer-name"
          value={formData?.name}
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
          required
          placeholder="Enter layer name"
        />
      </DataLayerNameField>
    </DataLayerFieldContainer>
    <DataLayerFieldContainer>
      <InputLabel>
        Layer Description
      </InputLabel>
      <DataLayerNameField>
        <TextInput
          type="text"
          labelText=""
          name='description'
          id="layer-description"
          value={formData.description}
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
          required
          placeholder="Enter layer description"
        />
      </DataLayerNameField>
    </DataLayerFieldContainer>

    <SelectLayerConfig
      required
      name='entityType'
      labelText="Entity Type"
      id={`entity-type`}
      value={String(formData.entityType)}
      disabled={isEditMode}
      onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value ? Number(e.target.value) : ''])}
      placeholder="Choose entity type">
      <SelectItem value="" text="Choose entity type" />
      {entityTypes &&
        entityTypes.map((entity) => (
          <SelectItem key={entity.id} value={String(entity.id)} text={entity.name} />
        ))
      }
    </SelectLayerConfig>

    <SelectLayerConfig
      required
      name='type'
      labelText="Layer Type"
      id={`layer-type-select`}
      value={formData.type}
      disabled={isEditMode}
      onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
      placeholder="Choose layer type">
      <SelectItem value="" text="Choose layer type" />
      {appConfigValues?.LAYER_TYPE_CHOICES &&
        Object.entries(appConfigValues?.LAYER_TYPE_CHOICES).map(([value]) => (
          <SelectItem key={value} value={value} text={LayerTypeNames[value]} />
        ))
      }
    </SelectLayerConfig>
    <MultiSelectLayerConfig
      name="sourceType"
      required
      label="Choose source type"
      titleText="Source Type"
      disabled={isDefaultLayer}
      itemToString={(item: SourceTypeItem | null) => item?.name ?? ''}
      itemToElement={(item: SourceTypeItem | null) => (
        <span>
          {item?.name}
        </span>
      )}
      items={dataSourceList}
      id={`source-type`}
      placeholder="Select data source"
      onChange={({ selectedItems }: { selectedItems: SourceTypeItem[] }) => {
        onUdpateGigaLayerForm(['sourceType', selectedItems ?? []])
      }}
      selectedItems={formData.sourceType}
    />
    <MultiSelectLayerConfig
      id={`apiSource-select`}
      label="Choose API source"
      titleText="API Source"
      items={apiSourceValues}
      ListBoxSize={"sm"}
      disabled={isDefaultLayer}
      itemToString={(item: DataSource) => item?.name ?? ''}
      itemToElement={(item: DataSource) => (
        <span>
          {item?.name}
        </span>
      )}
      onChange={({ selectedItems }: { selectedItems: DataSource[] }) => {
        onUdpateGigaLayerForm(['dataSource', selectedItems?.map((item) => item.id)])
      }}
      selectedItems={apiSourceSelected}
      selectionFeedback="top-after-reopen">
    </MultiSelectLayerConfig>
    <SelectLayerConfig
      name="dataSourceColumn"
      required
      labelText="Parameter"
      disabled={isDefaultLayer}
      id={`parameter-select`}
      value={formData?.dataSourceColumn?.name}
      placeholder="Select parameter"
      onChange={(e) => onUdpateGigaLayerForm([e.target.name, parameters.find(item => e.target.value === item.name)])}
    >
      <SelectItem value="" text="Select parameter" />
      {parameters?.map((parameter) => <SelectItem key={parameter?.name} value={parameter?.name} text={parameter?.alias} />)}
    </SelectLayerConfig>
    <MultiSelectLayerConfig
      required
      direction='top'
      titleText="Countries"
      id={`country-select`}
      disabled={isDefaultLayer}
      items={countryList}
      itemToString={(item: CountryListType) => item?.name}
      itemToElement={(item: CountryListType) => (
        <span>
          {item?.name}
        </span>
      )}
      selectedItems={selectedCountries}
      onChange={({ selectedItems }: { selectedItems: CountryListType[] }) => onUdpateGigaLayerForm(['applicableCountries', selectedItems.map(item => item.id)])}
      label={'Choose countries'} />
  </>
}
