import { useStore } from "effector-react";
import FilterPlaceholderForm from "../filter-placeholder";
import AddEditFilterListForm from "../form-filter";
import { render, screen } from "@testing-library/react";
import { getFilterType } from "~/@/admin/utils/filter-list.util";
import FilterCommonFields from "../filter-common-fields";

describe('User role', () => {
  it('should render component', () => {
    render(<AddEditFilterListForm isEditMode={true} id={1} />)
    const filterEditWrapper = screen.getByLabelText('Edit');
    const filterAddWrapper = screen.getByLabelText('Add');
    expect(filterEditWrapper).toMatchSnapshot();
    expect(filterAddWrapper).toMatchSnapshot();
  });

  it('should render component', () => {
    render(<FilterCommonFields isEditMode={true} />)
    const filterLabel = screen.getByLabelText('Unique Code');
    const filterText = screen.getByText('Enter layer unique code');
    expect(filterLabel).toMatchSnapshot();
    expect(filterText).toMatchSnapshot();
  });

  it('should render component', () => {
    render(<FilterPlaceholderForm />)
    const filterPlaceholderText = screen.getByLabelText('Placeholder');
    expect(filterPlaceholderText).toMatchSnapshot();
  });

  test('renders range input fields when isRange is true and isAutoCompute is false', () => {
    useStore.mockReturnValue({
      type: 'rangeType',
      options: {
        minPlaceholder: 'min placeholder',
        maxPlaceholder: 'max placeholder',
        range_auto_compute: false,
      },
    });

    getFilterType.mockReturnValue({ isRange: true, isInput: false });

    render(<FilterPlaceholderForm />);

    expect(screen.getByPlaceholderText('Enter min placeholder')).toBeInTheDocument();
    expect(screen.getByLabelText('Min Placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter max placeholder')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Placeholder')).toBeInTheDocument();
  });
})