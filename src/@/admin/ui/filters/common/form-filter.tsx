import { Form, Button, SelectItem } from '@carbon/react';
import React, { FormEvent, useEffect, useMemo } from 'react'
import { useStore } from 'effector-react';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { CountryListType } from '~/@/api-docs/types/country-list.type';
import { $formData, onUdpateGigaLayerForm } from '~/@/admin/models/giga-layer.model';
import { ButtonWrapper, FilterHeadingWrapper, FilterInputLabel, FilterScroll, FilterTextInput, FormFieldsContainer, FormFieldsWrapper, MultiSelectConfig, SelectDropdown, ViewFilterWrapper } from '../filter-list.styles';
import { adminFilterRoute } from '~/core/routes';
import { $filterColumnList } from '~/@/admin/models/filter-list.model';
import { filterColumnListFx } from '~/@/admin/effects/filter-fx';
import { SelectLayerConfig } from '../../styles/admin-styles';
import { LayerTypeNames } from '~/@/admin/constants/giga-layer.constant';

const AddEditFilterListForm = ({ isEditMode, id }: { isEditMode: boolean; id: number }) => {
  const filterColumnList = useStore($filterColumnList);
  const countryList = useStore($countryList);
  const formData = useStore($formData);
  const selectedCountries = useMemo(() => {
    if (!countryList?.length) return [];
    return countryList?.filter(item => formData?.applicableCountries.includes(item.id))
  }, [formData?.applicableCountries, countryList])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  }

  useEffect(() => {
    filterColumnListFx();
  }, [])

  return (
    <Form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', color: 'white', height: 'inherit', justifyContent: 'space-between' }}>
      <FilterScroll>
        <ViewFilterWrapper>
          <FilterHeadingWrapper>
            <h6>{isEditMode ? 'Edit' : 'Add'} filter</h6>
          </FilterHeadingWrapper>
        </ViewFilterWrapper>
        <FormFieldsWrapper>
          <FormFieldsContainer>
            <SelectDropdown
              required
              name='type'
              labelText="Parameter"
              id={`filter-type-select`}
              value={formData.type}
              onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
              placeholder="Choose parameter type"
            >
              <SelectItem value="" text="Choose parameter" />
              {filterColumnList.map((item) => (
                <SelectItem key={item.name} value={item.name} text={item.label}></SelectItem>
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
              onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
              required
            />
            <FilterInputLabel>
              Filter description
            </FilterInputLabel>
            <FilterTextInput
              type="text"
              placeholder="Description will show in info box"
              labelText=""
              name='description'
              id="filter-description"
              value={formData?.description}
              onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
              required
            />
            <MultiSelectConfig
              required
              direction='top'
              titleText="Countries"
              id={`country-select`}
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
          </FormFieldsContainer>
        </FormFieldsWrapper>
      </FilterScroll>
      <ButtonWrapper>
        <Button onClick={() => adminFilterRoute.navigate()} style={{ background: '#474747' }}>Cancel</Button>
        <Button>{isEditMode ? 'Update' : 'Save'}</Button>
      </ButtonWrapper>
    </Form>
  )
}

export default AddEditFilterListForm