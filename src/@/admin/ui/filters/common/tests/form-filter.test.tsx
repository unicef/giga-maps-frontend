import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useStore } from "effector-react";
import AddEditFilterListForm from "../form-filter";
import { addFilterFx, editFilterFx } from "~/@/admin/effects/filter-fx";
import { $userPermissions } from "~/core/auth/models";
import { fetchMockResponse } from "~/tests/fetchMock";


const mockFormData = {
  name: 'Test Filter',
  code: 'test_code',
  type: 'string',
  query_param_filter: 'test_param',
  column_configuration: {},
  options: [],
  description: 'A test filter'
};

describe('AddEditFilterListForm', () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)

  })

  it('renders the form with "Add filter" heading', () => {
    render(<AddEditFilterListForm isEditMode={false} id={0} />);

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Add filter');
  });

  it('renders the form with "Edit filter" heading', () => {
    render(<AddEditFilterListForm isEditMode={true} id={1} />);

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Edit filter');
  });
})