import { Image, Search, ChevronDown, ChevronUp } from '@carbon/icons-react';
import { Button, Checkbox, DatePicker, DatePickerInput, Form, Link, RadioButton, TextInput } from "@carbon/react";
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { createOrUpdateCountryFx, getPublishDataLayerListFx } from '~/@/admin/effects/api-country-fx';
import { $formDataCountry, $publishDataLayerListResponce, onUdpateCountryForm, setToasterWarning } from '~/@/admin/models/country-model';
import { FilterListWithOptionsTypes, FiltersDefaultValueType } from '~/@/admin/types/filter-list.type';
import { DataLayer, LegendConfigType } from '~/@/admin/types/giga-layer.type';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { Div } from '~/@/common/style/styled-component-style';
import { components } from '~/@/map/ui/advanced-filter/filter-popup-content';
import { adminCountry, router } from '~/core/routes';
import { speedConverterUtil } from '~/lib/utils';

import { getFilterListWithOptionsFx, getFilterPublishedListFx } from '@/admin/effects/filter-fx';
import { $filterListWithOptions, $filterPublishedList } from '@/admin/models/filter-list.model';

import { BottomButtonWrapper, CountryFormScroll, CountryListDataLayer, CountryListDefaultFilters, CountryListDefaultFilterTitle, DateOfJoiningWrapper, DatePickerBoxWrapper, InputBoxWrapper, InputContainer, InputLabel, LastWeekStatusWrapper, MultiSelectLayerConfig, RowContainer, SchoolFieldsWrapper, UploadFlagImage } from "../../styles/admin-styles";
import CountryLegendBenchmark from './common/CountryLegendBenchmark';
import { ActiveFilterListType } from '~/api/types';

type RangeValue = { none_range: boolean; value: string };
type SelectedFieldValue = string | RangeValue;
type AdminDefinedDefaultFilterValuesRecord = Record<string, SelectedFieldValue>;

const FormCountry = ({ isEdit, countryItemId }: { isEdit: boolean, countryItemId?: number }) => {
  const id = Number(countryItemId);
  const formDataCountry = useStore($formDataCountry);
  const publishDataLayerListResponce = useStore($publishDataLayerListResponce);
  const filterPublishedList = useStore($filterPublishedList);
  const countryList = useStore($countryList);
  const filterListWithOptions = useStore($filterListWithOptions);

  const [selectedFile, setSelectedFile] = useState(null)
  const [layerDescriptions, setLayerDescriptions] = useState<Record<string, string>>({});
  const [layersBenchmark, setLayersBenchmark] = useState<Record<string, string>>({});
  const [benchmarkNames, setbenchmarkNames] = useState<Record<string, string>>({});
  const [defaultNationalBenchmark, setDefaultNationalBenchmark] = useState<Record<string, boolean>>({});
  const [dataSource, setDataSource] = useState<Record<string, { name: string, description: string }>>({});
  const [legendConfigList, setLegendConfigList] = useState<Record<string, LegendConfigType>>({});
  const [selectedActiveLayers, setSelectedActiveLayers] = useState<{ id: number; name: string; }[]>([]);
  const [selectedActiveFilters, setSelectedActiveFilters] = useState<{ id: number; name: string; }[]>([]);
  const [defaultLayer, setDefaultLayer] = useState<number | undefined>();
  const [adminDefinedDefaultFilterValues, setAdminDefinedDefaultFilterValues] = useState<Record<string, string | {
    none_range: boolean;
    value: string;
  }>>({});
  const [isDefaultFilterValuesLoaded, setIsDefaultFilterValuesLoaded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<'layers' | 'filters' | null>(null);

  const filteredPublishDataLayerList = useMemo(() => publishDataLayerListResponce.sort((a, b) => a.type.localeCompare(b.type)), [publishDataLayerListResponce]);
  const updateDefaultNationalBenchmark = (id: number, checked: boolean) => {
    if (checked) {
      setDefaultNationalBenchmark({
        ...defaultNationalBenchmark,
        [id]: checked
      })
    } else {
      delete defaultNationalBenchmark[id];
      setDefaultNationalBenchmark({ ...defaultNationalBenchmark });
    }
  }
  const layersNames = useMemo(() => {
    return publishDataLayerListResponce.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<string, DataLayer>)
  }, [publishDataLayerListResponce])

  const layerListAvailablility = useMemo(() => publishDataLayerListResponce.map((item) => ({ id: item.id, name: item.name, code: item.code })), [publishDataLayerListResponce]);
  const filterListAvailablility = useMemo(() => filterPublishedList.map((item) => ({ id: item.id, name: item.name, code: item.code })), [filterPublishedList]);

  const getActiveFilterListFromStore: ActiveFilterListType[] = useMemo(() => formDataCountry?.active_filters_list, [formDataCountry])
  const enrichedFilters = useMemo((): FilterListWithOptionsTypes[] => {
    // Map: filterId -> default info
    const defaultsById = new Map<number, ActiveFilterListType>(
      (getActiveFilterListFromStore ?? [])
        .filter(d => typeof d?.advance_filter_id === 'number')
        .map(d => [d!.advance_filter_id as number, d!])
    );

    return (filterListWithOptions ?? []).map(filter => {
      const defaults = defaultsById.get(filter.id);

      return {
        ...filter,
        options: {
          ...filter.options,
          is_default: !!defaults?.is_default, // ensure boolean
          default_filter_values: defaults?.default_filter_values ?? undefined,
        },
      };
    });
  }, [getActiveFilterListFromStore, filterListWithOptions]);

  useEffect(() => {
    const countryCode = countryList.find((country) => country.id === id)?.code.toLowerCase();
    if (countryCode) {
      void getFilterListWithOptionsFx(id);
    }
  }, [id, countryList])

  useEffect(() => {
    if (formDataCountry?.active_layers_list) {
      const dataSourceList = {} as Record<string, { name: string, description: string }>;
      const legendConfigDefault = {} as Record<string, LegendConfigType>;
      let currentDefaultLayer;
      const activeLayerList = formDataCountry.active_layers_list.map((layer: { data_layer_id: number; is_default: boolean; data_sources: { name?: string, description?: string }, legend_configs?: LegendConfigType; }) => {
        dataSourceList[String(layer.data_layer_id)] = {
          name: '',
          description: '',
          ...layer.data_sources
        }
        legendConfigDefault[String(layer.data_layer_id)] = layer.legend_configs || {};
        if (layer.is_default) {
          currentDefaultLayer = layer?.data_layer_id;
        }
        return {
          id: layer.data_layer_id,
          name: layersNames[String(layer.data_layer_id)]?.name,
          code: layersNames[String(layer.data_layer_id)]?.code
        }
      });
      setSelectedActiveLayers(activeLayerList);
      setDataSource(dataSourceList);
      setDefaultLayer(currentDefaultLayer);
      setLegendConfigList(legendConfigDefault);
    }
  }, [formDataCountry?.active_layers_list, layersNames]);

  useEffect(() => {
    if (formDataCountry?.active_filters_list && filterListAvailablility.length) {
      const activeFilterList = formDataCountry.active_filters_list.map((filter: { advance_filter_id: number; }) => {
        const foundFilter = filterListAvailablility.find((item) => item.id === filter.advance_filter_id);
        return {
          id: filter.advance_filter_id,
          name: foundFilter?.name ?? '',
          code: foundFilter?.code ?? ''
        }
      })
      setSelectedActiveFilters(activeFilterList);
    }
  }, [formDataCountry?.active_filters_list, filterListAvailablility])
  useEffect(() => {
    const { live_layer = {}, layer_descriptions = {}, default_national_benchmark = {}, benchmark_name = {} } = formDataCountry?.benchmark_metadata || {};
    setLayersBenchmark({ ...live_layer });
    setLayerDescriptions({ ...layer_descriptions });
    setDefaultNationalBenchmark({ ...default_national_benchmark });
    setbenchmarkNames({ ...benchmark_name });
  }, [formDataCountry?.benchmark_metadata]);

  const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setToasterWarning('Please select a valid JPEG or PNG image.');
        event.target.value = null;
        return;
      }
      const maxSize = 500 * 1024;
      if (file.size > maxSize) {
        setToasterWarning('File size exceeds the limit of 500 KB.');
        event.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const activeFilters = useMemo(() => {
    if (!enrichedFilters || enrichedFilters.length === 0) return [];
    const selectedIds = new Set(selectedActiveFilters.map(s => s.id));
    return (enrichedFilters || []).filter(f => selectedIds.has(f.id));
  }, [enrichedFilters, selectedActiveFilters]);

  const activeFiltersById = useMemo(() => {
    const m = new Map<number, FilterListWithOptionsTypes>();
    for (const f of activeFilters) m.set(f.id, f);
    return m;
  }, [activeFilters]);

  type MinimalFilterPayload = { advance_filter_id: number };
  type FullFilterPayload = {
    advance_filter_id: number;
    is_default: boolean;
    default_filter_values: { values: any };
  };
  type FilterPayload = MinimalFilterPayload | FullFilterPayload;

  const getFilterValueByName = useCallback((id: number): FilterPayload => {
    const key = String(id);
    const raw = adminDefinedDefaultFilterValues[key];
    // keep your empty-string => undefined behavior
    const b = raw === '' ? undefined : raw;

    // If b is undefined, return minimal object only
    if (b === undefined) {
      return { advance_filter_id: id };
    }

    // b is present -> build full payload
    const metaData = activeFiltersById.get(id);

    // If metadata is missing, still return full-ish object with values = null
    if (!metaData) {
      return {
        advance_filter_id: id,
        is_default: !!b,
        default_filter_values: { values: null }
      };
    }

    let values: any = null;

    switch (metaData.type) {
      case 'DROPDOWN_MULTISELECT': {
        const extraKey = `ignore_${id}`;
        const hasExtra = adminDefinedDefaultFilterValues[extraKey];

        if (hasExtra) {
          // extraValue contains labels joined by '|', convert to values by matching choices
          const labels = String(hasExtra).split('|').filter(Boolean);
          values = (metaData.options.choices ?? [])
            .filter(c => labels.includes(c.label))
            .map(c => c.value);
        } else {
          // b might be an array or a pipe-separated string
          if (Array.isArray(b)) values = b;
          else values = String(b).split('|').filter(Boolean);
        }
        break;
      }

      case 'RANGE': {
        if (typeof b !== 'object') {
          return { advance_filter_id: id };
        }
        const valStr = String((b as any).value ?? '');
        const noneRange = !!(b as any).none_range;
        if (valStr === '' && noneRange === false) {
          return { advance_filter_id: id };
        }
        // Normalize to { min, max, none_range }
        if (valStr === '') {
          // keep explicitly-empty range when none_range is true
          values = { min: null, max: null, none_range: noneRange };
        } else {
          const [minStr = '', maxStr = ''] = valStr.split(',');
          values = {
            min: minStr === '' ? null : Number(minStr),
            max: maxStr === '' ? null : Number(maxStr),
            none_range: noneRange
          };
        }
        break;
      }


      case 'BOOLEAN': {
        // b exists (string or boolean) -> convert to boolean
        values = (b === 'true' || b === true);
        break;
      }

      default: {
        values = b;
        break;
      }
    }

    return {
      advance_filter_id: id,
      is_default: !!b,
      default_filter_values: { values }
    };
  }, [adminDefinedDefaultFilterValues, activeFiltersById]);

  useEffect(() => {
    if (!activeFilters || activeFilters.length === 0) {
      return;
    }
    setAdminDefinedDefaultFilterValues(prev => {
      const updated: AdminDefinedDefaultFilterValuesRecord = { ...prev };
      for (const item of activeFilters) {
        const key = String(item.id);
        if (updated[key] && updated[key] !== '') continue;
        const defaultValue = item.options?.default_filter_values?.values ?? '';
        switch (item.type) {
          case 'DROPDOWN_MULTISELECT': {
            // defaultValue expected as array of values
            const values = Array.isArray(defaultValue) ? defaultValue : (defaultValue ? String(defaultValue).split('|') : []);
            const choices = item.options.choices ?? [];
            const matched = choices.filter(ch => values.includes(ch.value));
            updated[key] = matched.map(d => d.value).join('|');
            updated[`ignore_${key}`] = matched.map(d => d.label).join('|');
            break;
          }
          case 'RANGE': {
            if (defaultValue && typeof defaultValue === 'object') {
              updated[key] = { value: `${defaultValue.min},${defaultValue.max}`, none_range: !!defaultValue.none_range };
            } else {
              updated[key] = '';
            }
            break;
          }
          case 'BOOLEAN': {
            updated[key] = String(defaultValue ?? '');
            break;
          }
          default: {
            updated[key] = defaultValue ?? '';
          }
        }
      }
      setIsDefaultFilterValuesLoaded(true);
      return updated;
    });
  }, [activeFilters, setAdminDefinedDefaultFilterValues]);

  const onDefaultFiltersValueChange = (key: string, value: string, multiKeyValues?: Record<string, string>) => {
    setAdminDefinedDefaultFilterValues({
      ...adminDefinedDefaultFilterValues,
      [key]: value,
      ...multiKeyValues
    })
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile && !isEdit) {
      setToasterWarning("Please Upload flag image")
    }
    else {
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData();
      formData.append('name', formElement.name?.value);
      formData.append('code', formElement.code?.value);
      formData.append('description', formElement.description?.value);
      formData.append('iso3_format', formElement.iso3_format?.value);
      formData.append('data_source', formElement.data_source?.value);
      formData.append('last_weekly_status_id', formElement.last_weekly_status_id?.value)
      formData.append('country_disclaimer', formElement.country_disclaimer?.value)
      formData.append('date_of_join', formElement.date_of_join?.value?.split('/').join('-'));
      formData.append('date_schools_mapped', formElement.date_schools_mapped?.value?.split('/').join('-'));
      formData.append('active_layers_list', JSON.stringify(selectedActiveLayers?.map((layer) => ({
        data_layer_id: layer.id,
        data_sources: dataSource[String(layer.id)],
        is_default: String(defaultLayer) === String(layer.id),
        legend_configs: legendConfigList[String(layer.id)] ?? {}
      }))));
      formData.append('active_filters_list', JSON.stringify(selectedActiveFilters?.map((filter) =>
        getFilterValueByName(filter.id)
      )));

      if (selectedFile) {
        formData.append('flag', selectedFile);
      }

      formData.append('benchmark_metadata', JSON.stringify({
        live_layer: layersBenchmark,
        layer_descriptions: layerDescriptions,
        default_national_benchmark: defaultNationalBenchmark,
        static_layer: {},
        benchmark_name: benchmarkNames
      }));
      try {
        await createOrUpdateCountryFx({
          formData,
          isEdit,
          countryItemId
        })
        adminCountry.navigate();
      }
      catch (e) {
        console.error(e)
      }
    };
  }

  useEffect(() => {
    void getPublishDataLayerListFx()
    void getFilterPublishedListFx()
  }, [])

  const imageSource = selectedFile ? URL.createObjectURL(selectedFile) : formDataCountry?.flag;

  const defaultsReady = activeFilters.length > 0 && isDefaultFilterValuesLoaded;

  const toggleAccordion = (which: 'layers' | 'filters') => {
    setOpenAccordion(prev => (prev === which ? null : which));
  }

  return (
    <Form
      id="formElem"
      data-testid="country-form-submit"
      onSubmit={handleFormSubmit} autoComplete="off" >
      <CountryFormScroll>
        <RowContainer>
          <UploadFlagImage>
            {imageSource && <img src={imageSource} alt='' />}
            {!imageSource && <Image />}
            <h3>Upload Flag Image</h3>
            <p>
              Max file size is 500kb. Supported file types are .jpg and .png.
            </p>
            <TextInput
              type="file"
              labelText=""
              data-testid="flag-image-upload"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: 'none' }} />
            <Button
              id="flag-upload-button"
              onClick={() => document.getElementById('fileInput')?.click()}
              kind='primary'> Upload</Button>
          </UploadFlagImage>
          <InputContainer>
            <InputLabel>
              Last weekly status
            </InputLabel>
            <LastWeekStatusWrapper>
              <InputBoxWrapper>
                <TextInput
                  min={0}
                  type="number"
                  labelText=""
                  id="last-week-status"
                  name='last_weekly_status_id'
                  placeholder='Enter last week status'
                  value={formDataCountry?.last_weekly_status_id}
                  onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
                />
              </InputBoxWrapper>
              <Link href={`/admin/country/country-summary/edit/${formDataCountry?.last_weekly_status_id}`} target="_blank">
                <Search />
              </Link>
            </LastWeekStatusWrapper>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          <InputContainer>
            <InputLabel>
              Country name
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                labelText=""
                name='name'
                id="country-name"
                placeholder='Enter country name'
                required
                value={formDataCountry?.name}
                onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
              />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Country code
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                labelText=""
                id="country-code"
                name="code"
                placeholder='Enter country code'
                value={formDataCountry?.code}
                onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
                required
              />
            </InputBoxWrapper>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          <InputContainer>
            <InputLabel>
              Iso3 format
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                labelText=""
                id="iso3-format"
                name="iso3_format"
                placeholder='Enter iso3 format'
                value={formDataCountry?.iso3_format}
                onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
                required
              />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Description
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                labelText=""
                id="description"
                name="description"
                placeholder='Enter description'
                value={formDataCountry?.description}
                onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
              />
            </InputBoxWrapper>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          <DateOfJoiningWrapper>
            <InputLabel>
              Date of Join
            </InputLabel>
            <DatePickerBoxWrapper>
              <DatePicker
                datePickerType="single"
                dateFormat='d/m/Y'
                value={formDataCountry?.date_of_join}
                onChange={(date) => {
                  onUdpateCountryForm(['date_of_join', format(date[0], 'dd-MM-yyyy')])
                }}
              >
                <DatePickerInput
                  labelText=""
                  id="date-picker-join-date"
                  placeholder="dd-mm-yyyy"
                  Name='date_of_join'
                />
              </DatePicker>
            </DatePickerBoxWrapper>
          </DateOfJoiningWrapper>
          <DateOfJoiningWrapper>
            <InputLabel>
              School mapped Date
            </InputLabel>
            <DatePickerBoxWrapper>
              <DatePicker
                datePickerType="single"
                dateFormat='d/m/Y'
                value={formDataCountry?.date_schools_mapped}
                onChange={(date) => onUdpateCountryForm(['date_schools_mapped', format(date[0], 'dd-MM-yyyy')])}
              >
                <DatePickerInput
                  labelText=""
                  id="date-picker-school-mapped-date"
                  placeholder="dd-mm-yyyy"
                  Name='date_schools_mapped'
                />
              </DatePicker>
            </DatePickerBoxWrapper>
          </DateOfJoiningWrapper>
        </RowContainer>
        <RowContainer>
          <InputContainer>
            <InputLabel>
              Data Source
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                labelText=""
                id="data-souce"
                name="data_source"
                placeholder='Enter data source'
                value={formDataCountry?.data_source}
                onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
              />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Add a country disclaimer
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                labelText=""
                id="data-souce"
                maxLength={255}
                name="country_disclaimer"
                placeholder='Enter country disclaimer(Max 255 characters)'
                value={formDataCountry?.country_disclaimer}
                onChange={(e) => onUdpateCountryForm([e.target.name, e.target.value])}
              />
            </InputBoxWrapper>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          <InputContainer>
            <MultiSelectLayerConfig
              name="active_layers_list"
              required
              label="Choose active layers"
              titleText="Active layers"
              itemToString={(item: DataLayer) => item.name || ''}
              itemToElement={(item: DataLayer) => (
                <span>
                  {item.name} ({item.code})
                </span>
              )}
              items={layerListAvailablility}
              id={`active-layers`}
              onChange={({ selectedItems }: { selectedItems: { id: number; name: string }[] }) => {
                setSelectedActiveLayers(selectedItems);
              }}
              selectedItems={selectedActiveLayers}
            />
          </InputContainer>
          <InputContainer>
            <MultiSelectLayerConfig
              name="active_filters_list"
              required
              label="Choose active filters"
              titleText="Active filters"
              itemToString={(item: { id: number; name: string }) => item.name || ''}
              itemToElement={(item: { id: number; name: string }) => (
                <span>
                  {item.name} ({item.code})
                </span>
              )}
              items={filterListAvailablility}
              id={`active-filters`}
              onChange={({ selectedItems }: { selectedItems: { id: number; name: string }[] }) => {
                console.log("selectedItems: ", selectedItems);
                setSelectedActiveFilters(selectedItems);
              }}
              selectedItems={selectedActiveFilters}
            />
          </InputContainer>
        </RowContainer>

        {selectedActiveLayers.length > 0 && (
          <CountryListDataLayer>
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleAccordion('layers')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { toggleAccordion('layers') } }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '0rem 3rem',
              }}
              aria-expanded={openAccordion === 'layers'}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1.25rem 0rem 1.25rem' }}>
                <h3 style={{ margin: 0, padding: 0 }}>Associated Giga layers</h3>
                <div>({selectedActiveLayers.length})</div>
              </div>
              <div>
                {openAccordion === 'layers' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
            {openAccordion === 'layers' &&
              filteredPublishDataLayerList.map((item: DataLayer) => (
                selectedActiveLayers.some(layer => layer.id === item.id) && <React.Fragment key={item.id}>
                  <div style={{ paddingLeft: '3rem', gap: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 'bold' }}>{item.name} ({item.type.toLowerCase()})</p>
                    {item.type === 'LIVE' &&
                      <RadioButton labelText="Select default layer" name={item.name} value={item.id} id={String(item.id)} checked={String(item.id) === String(defaultLayer)} onChange={() => setDefaultLayer(item.id)} />
                    }
                  </div>
                  <RowContainer>
                    {item.type === 'LIVE' && <InputContainer>
                      <InputLabel>
                        National / School benchmark ({item.global_benchmark?.unit})
                        <Checkbox id={`default-national-benchmark-${item.id}`} disabled={!layersBenchmark[item?.id]} labelText="Is default benchmark" name={item.name} value={item.id} checked={defaultNationalBenchmark[item?.id]} onChange={(_, { checked }) => updateDefaultNationalBenchmark(item.id, checked)} />
                      </InputLabel>
                      <SchoolFieldsWrapper>
                        <TextInput
                          labelText=""
                          id={`${item?.name}{item?.id}`}
                          name={item?.name}
                          placeholder="Enter national / school benchmark"
                          value={layersBenchmark[item?.id] || ""}
                          onChange={(e) => {
                            if (!e.target.value) {
                              updateDefaultNationalBenchmark(item.id, false)
                            }
                            setLayersBenchmark({ ...layersBenchmark, [item?.id]: e.target.value })
                          }
                          }
                        />
                        <Div $margin="0.5rem 0">
                          {!isNaN(Number(layersBenchmark[item?.id])) && <InputLabel>
                            {speedConverterUtil(item.global_benchmark.unit, item.global_benchmark.convert_unit, Number(layersBenchmark[item?.id] || 0))}
                            {' '}<b>{item?.global_benchmark?.convert_unit?.toUpperCase()}</b>
                          </InputLabel>}
                        </Div>
                      </SchoolFieldsWrapper>
                    </InputContainer>}
                    {item.type === 'LIVE' &&
                      <InputContainer>
                        <InputLabel>
                          National / School benchmark description
                        </InputLabel>
                        <SchoolFieldsWrapper>
                          <TextInput
                            labelText=""
                            id={`${item?.name}{item?.id}`}
                            name={item?.name}
                            placeholder="Enter national / school benchmark description"
                            value={layerDescriptions[item?.id] || ""}
                            onChange={(e) => setLayerDescriptions({ ...layerDescriptions, [item?.id]: e.target.value })}
                          />
                        </SchoolFieldsWrapper>
                      </InputContainer>
                    }
                    <CountryLegendBenchmark globalConfig={item.legend_configs} config={legendConfigList[item?.id]} onChange={(value: LegendConfigType) => setLegendConfigList({ ...legendConfigList, [item?.id]: value })} />
                    <InputContainer style={{ alignSelf: 'flex-start' }}>
                      <InputLabel>
                        Benchmark name (default: National)
                      </InputLabel>
                      <SchoolFieldsWrapper>
                        <TextInput
                          labelText=""
                          id={`benchmark-types-${item?.id}`}
                          name={`${item?.name}_benchmark-type`}
                          placeholder="Enter benchmark name (default: National)"
                          value={benchmarkNames[item?.id] || ""}
                          onChange={(e) => {
                            setbenchmarkNames({ ...benchmarkNames, [item?.id]: e.target.value })
                          }
                          }
                        />
                      </SchoolFieldsWrapper>
                    </InputContainer>
                  </RowContainer>
                  <RowContainer>
                    <InputContainer>
                      <InputLabel>
                        Data source name
                      </InputLabel>
                      <SchoolFieldsWrapper>
                        <TextInput
                          labelText=""
                          id={`${item?.name}data_source${item?.id}`}
                          name={`${item?.name}_data_source_name`}
                          placeholder="Enter data source name"
                          value={dataSource[item.id]?.name || ""}
                          onChange={(e) => setDataSource({ ...dataSource, [item.id]: { ...dataSource[item.id], name: e.target.value } })}
                        />
                      </SchoolFieldsWrapper>
                    </InputContainer>
                    <InputContainer>
                      <InputLabel>
                        Data source descriptions
                      </InputLabel>
                      <SchoolFieldsWrapper>
                        <TextInput
                          labelText=""
                          id={`${item?.name}datasource${item?.id}`}
                          name={`data_source_description_${item.id}`}
                          placeholder="Enter data source descriptions"
                          value={dataSource[item.id]?.description || ""}
                          onChange={(e) => setDataSource({ ...dataSource, [item.id]: { ...dataSource[item.id], description: e.target.value } })}
                        />
                      </SchoolFieldsWrapper>
                    </InputContainer>
                  </RowContainer>
                </React.Fragment>
              ))
            }
          </CountryListDataLayer>
        )}

        {defaultsReady &&
          <>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleAccordion('filters')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { toggleAccordion('filters') } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '0rem 3rem',
              background: '#f4f4f4',
              marginTop: '12px'
            }}
            aria-expanded={openAccordion === 'filters'}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CountryListDefaultFilterTitle style={{ margin: 0 }}>Associated Giga filters</CountryListDefaultFilterTitle>
              <span>({selectedActiveFilters.length})</span>
            </div>
            <div>
              {openAccordion === 'filters' ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
          {openAccordion === 'filters' && (
            <CountryListDefaultFilters>
              {activeFilters.map(item => {
                const Component = components?.[item.type] as React.JSXElementConstructor<any>;
                if (!Component) return null;
                const itemKey = `${item.id}`;
                const extraItemKey = `ignore_${itemKey}`;
                const extraValue = adminDefinedDefaultFilterValues[extraItemKey];
                const value = adminDefinedDefaultFilterValues[itemKey];
                return (
                  <Component
                    key={item.id}
                    {...item}
                    itemKey={itemKey}
                    value={value}
                    extraValue={extraValue}
                    onChange={onDefaultFiltersValueChange}
                    light
                  />
                );
              })}
            </CountryListDefaultFilters>
          )}
          </>}
      </CountryFormScroll>
      <BottomButtonWrapper>
        <Button
          kind="secondary"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          kind="primary">
          Save
        </Button>
      </BottomButtonWrapper>
    </Form >
  )
}

export default FormCountry;
