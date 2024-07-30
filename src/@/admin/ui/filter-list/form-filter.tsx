import { Form, Button } from '@carbon/react';
import React, { FormEvent, useMemo } from 'react'
import { useStore } from 'effector-react';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { CountryListType } from '~/@/api-docs/types/country-list.type';
import { $formData, onUdpateGigaLayerForm } from '~/@/admin/models/giga-layer.model';
import { ButtonWrapper, FilterHeadingWrapper, FilterInputLabel, FilterScroll, FilterTextInput, FormFieldsContainer, FormFieldsWrapper, MultiSelectConfig, ViewFilterWrapper } from './filter-list.styles';

const AddEditFilterListForm = ({ isEditMode, filterItemId, openFilterSidebar }: { isEditMode: boolean, filterItemId?: number, openFilterSidebar?: () => void }) => {

  const countryList = useStore($countryList);
  const formData = useStore($formData);
  const selectedCountries = useMemo(() => {
    if (!countryList || !formData?.applicableCountries) return [];
    return countryList?.filter(item => formData?.applicableCountries.includes(item.id))
  }, [formData?.applicableCountries, countryList])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  }

  console.log("isEditMode", isEditMode);

  const handleCancel = () => {
    openFilterSidebar()
  }

  return (
    <Form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', color: 'white', height: 'inherit', justifyContent: 'space-between' }}>
      <div>
        <FilterScroll>
          <ViewFilterWrapper>
            <FilterHeadingWrapper>
              <h6>Add filter</h6>
            </FilterHeadingWrapper>
          </ViewFilterWrapper>
          <FormFieldsWrapper>
            <FormFieldsContainer>
              <MultiSelectConfig
                required
                direction='top'
                titleText="Parameter"
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
                label={'Number of students'} />
              <FilterInputLabel>
                Filter name
              </FilterInputLabel>
              <FilterTextInput
                type="text"
                placeholder="Placeholder text (optional)"
              />
              <FilterInputLabel>
                Filter description
              </FilterInputLabel>
              <FilterTextInput
                type="text"
                placeholder="Description will show in info box"
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
      </div>
      <ButtonWrapper>
        <Button onClick={handleCancel} size='sm' style={{ background: '#474747' }}>Cancel</Button>
        <Button size='sm'>Apply</Button>
      </ButtonWrapper>
    </Form>
  )
}

export default AddEditFilterListForm