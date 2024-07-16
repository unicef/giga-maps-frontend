import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../common-components/Pagination';

describe('Pagination Component', () => {
  const setPageMock = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <Pagination
        page={props.page || 1}
        setPage={props.setPage || setPageMock}
        count={props.count || 100}
        pageSize={props.pageSize}
      />
    );
  };

  it('renders with default values', () => {
    renderComponent();

    expect(screen.getByText('Items per page')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with custom pageSize', () => {
    renderComponent({ pageSize: 50 });

    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
  });

  it('calls setPage when changing page', () => {
    renderComponent();

    const nextPageButton = screen.getByLabelText('Next page');
    fireEvent.click(nextPageButton);

    expect(setPageMock).toHaveBeenCalledWith({ page: 2, pageSize: 20 });
  });

  it('calls setPage when changing page size', () => {
    renderComponent();

    const pageSizeSelect = screen.getByLabelText('Items per page');
    fireEvent.change(pageSizeSelect, { target: { value: '50' } });

    expect(setPageMock).toHaveBeenCalledWith({ page: 1, pageSize: 50 });
  });
});
