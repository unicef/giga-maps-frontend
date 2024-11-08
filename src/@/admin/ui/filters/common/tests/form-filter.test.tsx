import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useStore } from "effector-react";
import AddEditFilterListForm from "../form-filter";
import { addFilterFx, editFilterFx } from "~/@/admin/effects/filter-fx";
import { $userPermissions } from "~/core/auth/models";


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

  it('renders the form with "Add filter" heading', () => {
    render(<AddEditFilterListForm isEditMode={false} id={0} />);

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Add filter');
  });

  it('renders the form with "Edit filter" heading', () => {
    render(<AddEditFilterListForm isEditMode={true} id={1} />);

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Edit filter');
  });

  // it('calls addFilterFx on form submission when in add mode', async () => {
  //   render(<AddEditFilterListForm isEditMode={false} id={0} />);

  //   fireEvent.submit(screen.getByRole('form'));

  //   await waitFor(() => {
  //     expect(addFilterFx).toHaveBeenCalledWith({ body: mockFormData });
  //   });
  // });

  // it('calls editFilterFx on form submission when in edit mode', async () => {
  //   render(<AddEditFilterListForm isEditMode={true} id={1} />);

  //   fireEvent.submit(screen.getByRole('form'));

  //   await waitFor(() => {
  //     expect(editFilterFx).toHaveBeenCalledWith({ id: 1, body: mockFormData });
  //   });
  // });

  // it('disables the submit button if permissions are not granted', () => {
  //   useStore.mockImplementation((store) => {
  //     if (store === $userPermissions) return { CAN_UPDATE_ADVANCE_FILTER: false, CAN_ADD_ADVANCE_FILTER: false };
  //   });

  //   render(<AddEditFilterListForm isEditMode={true} id={1} />);

  //   const submitButton = screen.getByRole('button', { name: /update/i });
  //   expect(submitButton).toBeDisabled();
  // });

  // it('navigates back when cancel button is clicked', () => {
  //   const navigateMock = jest.fn();
  //   jest.spyOn(require('~/core/routes'), 'adminFilterRoute').mockImplementation(() => ({
  //     navigate: navigateMock
  //   }));

  //   render(<AddEditFilterListForm isEditMode={false} id={0} />);

  //   fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  //   expect(navigateMock).toHaveBeenCalled();
  // });
})