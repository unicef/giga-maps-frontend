import { describe, expect, test, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStore } from 'effector-react';
import AddEditFilterListForm from '../form-filter';
import { $filterColumnList, $formFilterData } from '~/@/admin/models/filter-list.model';
import { $userPermissions } from '~/core/auth/models';
import { fetchMockResponse } from '~/tests/fetchMock';
import filterColumnconfigurationData from '~/tests/data/filter-columnconfiguration.data';


jest.mock('effector-react', () => ({
  useStore: jest.fn(),
}));


describe('AddEditFilterListForm', () => {

  const mockFormData = {
    name: 'Test Filter',
    code: 'test_filter',
    type: 'range',
    query_param_filter: 'test',
    column_configuration: {},
    options: [],
    description: 'Test description'
  };

  const mockPermissions = {
    CAN_UPDATE_ADVANCE_FILTER: true,
    CAN_ADD_ADVANCE_FILTER: true
  };

  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)

    useStore.mockImplementation((store) => {
      if (store === $formFilterData) return mockFormData;
      if (store === $userPermissions) return mockPermissions;
      if (store === $filterColumnList) return filterColumnconfigurationData.results
      return {};
    });
  });

  test('renders form in add mode', () => {
    render(<AddEditFilterListForm isEditMode={false} id={0} />);
    expect(screen.getByText('Add filter')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('renders form in edit mode', () => {
    render(<AddEditFilterListForm isEditMode={true} id={1} />);
    expect(screen.getByText('Edit filter')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  test('submits form in add mode', async () => {
    render(<AddEditFilterListForm isEditMode={false} id={0} />);

    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);

  });

  test('submits form in edit mode', async () => {
    render(<AddEditFilterListForm isEditMode={true} id={1} />);

    const submitButton = screen.getByText('Update');
    fireEvent.click(submitButton);

  });

  test('disables submit button when user lacks permissions', () => {
    useStore.mockImplementation((store) => {
      if (store === $formFilterData) return mockFormData;
      if (store === $userPermissions) return {
        CAN_UPDATE_ADVANCE_FILTER: false,
        CAN_ADD_ADVANCE_FILTER: false
      };
      if (store === $filterColumnList) return filterColumnconfigurationData.results
      return {};
    });

    render(<AddEditFilterListForm isEditMode={true} id={1} />);
    expect(screen.getByText('Update')).toBeDisabled();
  });

  test('navigates on cancel button click', () => {
    render(<AddEditFilterListForm isEditMode={false} id={0} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

  });
});
