import { Form, Button } from '@carbon/react';
import { FormEvent, useEffect } from 'react'
import { useStore } from 'effector-react';
import { ButtonWrapper, FilterFormScroll, FilterHeadingWrapper, FormFieldsContainer, FormFieldsWrapper, ViewFilterWrapper } from '../filter-list.styles';
import { adminFilterRoute } from '~/core/routes';
import { $formFilterData } from '~/@/admin/models/filter-list.model';
import { addFilterFx, editFilterFx, filterColumnListFx } from '~/@/admin/effects/filter-fx';
import FilterPlaceholderForm from './filter-placeholder';
import FilterRangeFields from './filter-range-fields';
import FilterDropdownFields from './filter-dropdown-filter';
import FilterCommonFields from './filter-common-fields';

const AddEditFilterListForm = ({ isEditMode, id }: { isEditMode: boolean; id: number }) => {
  const formData = useStore($formFilterData);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { name, code, type, query_param_filter, column_configuration, options, description } = formData;
    try {
      const body = {
        name,
        code,
        type,
        query_param_filter,
        column_configuration,
        options,
        description
      }
      if (isEditMode) {
        await editFilterFx({ id, body })
      } else {
        await addFilterFx({ body })
      }
      adminFilterRoute.navigate();
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    filterColumnListFx();
  }, [])

  return (
    <Form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', color: 'white', height: 'inherit', justifyContent: 'space-between' }}>
      <FilterFormScroll>
        <ViewFilterWrapper>
          <FilterHeadingWrapper>
            <h6>{isEditMode ? 'Edit' : 'Add'} filter</h6>
          </FilterHeadingWrapper>
        </ViewFilterWrapper>
        <FormFieldsWrapper>
          <FormFieldsContainer>
            <FilterCommonFields />
            <FilterRangeFields />
            <FilterPlaceholderForm />
            <FilterDropdownFields />
          </FormFieldsContainer>
        </FormFieldsWrapper>
      </FilterFormScroll>
      <ButtonWrapper>
        <Button onClick={() => adminFilterRoute.navigate()} style={{ background: '#474747' }}>Cancel</Button>
        <Button type='submit'>{isEditMode ? 'Update' : 'Save'}</Button>
      </ButtonWrapper>
    </Form>
  )
}

export default AddEditFilterListForm