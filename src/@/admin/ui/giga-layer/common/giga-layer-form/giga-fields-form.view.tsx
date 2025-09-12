import { SelectItem, TextInput } from "@carbon/react";
import { useStore } from "effector-react";
import { useMemo } from "react";

import { DataSourceName, LayerDataSource, LayerTypeNames } from "~/@/admin/constants/giga-layer.constant";
import { $appConfigValues } from "~/@/admin/models/admin-model";
import { $apiSourceValues, $formData, onUdpateGigaLayerForm } from "~/@/admin/models/giga-layer.model";
import { DataSource } from "~/@/admin/types/giga-layer.type";
import { $countryList } from "~/@/api-docs/models/explore-api.model";
import { CountryListType } from "~/@/api-docs/types/country-list.type";

import { DataLayerFieldContainer, DataLayerNameField, InputLabel, MultiSelectLayerConfig, SelectLayerConfig } from "../../../styles/admin-styles";

export default function GigaFields({ isEditMode, isDefaultLayer }: { readonly isEditMode: boolean, readonly isDefaultLayer: boolean }) {
  const formData = useStore($formData);
  const appConfigValues = useStore($appConfigValues)
  const countryList = useStore($countryList);
  const apiSourceValues = useStore($apiSourceValues)
  const apiSourceSelected = useMemo(() => {
    return apiSourceValues.filter((item) => formData?.dataSource.includes(item.id))
  }, [formData.dataSource, apiSourceValues])
  const parameters = useMemo(() => {
    const list = apiSourceSelected
      ?.flatMap(item => item.column_config).filter((item) => item.is_parameter) ?? [];
    return Array.from(
      list.reduce((map, obj) => map.set(obj.name, obj), new Map()).values());
  }, [apiSourceSelected])
  const selectedCountries = useMemo(() => {
    if (!countryList || !formData?.applicableCountries) return [];
    return countryList?.filter(item => formData?.applicableCountries.includes(item.id))
  }, [formData?.applicableCountries, countryList])

  const dataSourceList = useMemo(() => {
    const type = formData.type;
    if (!type) return [];
    const source = LayerDataSource[type];
    return source.map((sourceName) => ({
      type: sourceName,
      name: DataSourceName[sourceName]
    }))
  }, [formData.type])
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
      name='type'
      labelText="Layer Type"
      id={`layer-type-select`}
      value={formData.type}
      disabled={isEditMode}
      onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
      placeholder="Choose layer type">
      <SelectItem value="" text="Choose layer type" />
      {appConfigValues?.LAYER_TYPE_CHOICES &&
        Object.entries(appConfigValues?.LAYER_TYPE_CHOICES).map(([value, text]) => (
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
      itemToString={(item) => item?.name}
      itemToElement={(item) => (
        <span>
          {item?.name}
        </span>
      )}
      items={dataSourceList}
      id={`source-type`}
      value={formData?.sourceType}
      placeholder="Select data source"
      onChange={({ selectedItems }: { selectedItems: string[] }) => {
        onUdpateGigaLayerForm(['sourceType', selectedItems])
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
      itemToString={(item: DataSource) => item?.name}
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