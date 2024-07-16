import { fireEvent, render } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import ToggleButton from "../ui/advanced-filter/toggle-button"
import { ScrollableContainer, StyledApplyFilterDropdown } from "../ui/advanced-filter/filter-button.style"
import SingleDropdown from "../ui/advanced-filter/single-dropdown"
import RangeTextInput from "../ui/advanced-filter/range-text-input"
import MultiSelectDropdown from "../ui/advanced-filter/multi-select-dropdown"
import TextField from "../ui/advanced-filter/text-input"
import FilterPopupContent from "../ui/advanced-filter/filter-popup-content"
import filter from "~/tests/data/filter"
import { fetchAdvanceFilterFx } from "~/api/project-connect"
import { router } from "~/core/routes"
import FilterPopup from "../ui/advanced-filter/filter-popup"

describe('ToggleButton', () => {
  const mockProps = {
    name: 'Has Computer Lab',
    type: "",
    value: 'false',
    itemKey: 'computer_lab__on',
    onChange: jest.fn(),
    description: "",
    choices: [],
    parameter: {
      label: "",
      table: "",
      field: "",
      filter: "",
    },
    active_countries_list: null
  };

  it('ToggleButton', () => {
    const { container } = render(<ToggleButton {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should call onChange on toggle', () => {
    const { getByLabelText } = render(<ToggleButton {...mockProps} />);
    const toggleButton = getByLabelText('Has Computer Lab');
  
    fireEvent.click(toggleButton);
    expect(mockProps.onChange).toHaveBeenCalledWith('computer_lab__on', 'true');
  
    fireEvent.click(toggleButton);
    expect(mockProps.onChange).toHaveBeenCalledWith('computer_lab__on', 'false');
  });

  it('should set isToggled based on value prop', () => {
    const { getByLabelText } = render(<ToggleButton {...mockProps} value="true" />);
    const toggleButton = getByLabelText('Has Computer Lab');
    expect(toggleButton).toBeInTheDocument();
  });
})

describe('StyledApplyFilterDropdown', () => {
  test('StyledApplyFilterDropdown', () => {
    const { asFragment, getByLabelText } = render(testWrapper(<StyledApplyFilterDropdown  />));
    expect(getByLabelText('Apply filters to')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot();
  })
});

describe('TextField with StyledTextInput', () => {
  const mockOnChange = jest.fn();

  test('should call onChange handler when user types in the input', () => {
    const { getByPlaceholderText } = render(<TextField name="Data Source" onChange={mockOnChange} />);

    const input = getByPlaceholderText('Enter Data Source');

    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Data Source', 'New Value');
  });
});

describe('<SingleDropdown />', () => {
  const items = [
    {label: 'All', value: ''},
    {label: 'Urban', value: 'uAllrban'},
    {label: 'Rural', value: 'rural'},
  ];

  const mockOnChange = jest.fn();

  it('renders with default "All" selected', () => {
    const { getByLabelText } = render(
      <SingleDropdown
        id="dropdown-education_level"
        label="All"
        items={items}
        onChange={mockOnChange}
      />
    );

    const dropdownLabel = getByLabelText('All');
    expect(dropdownLabel).toBeInTheDocument();
    expect(dropdownLabel).toHaveTextContent('All');

    const selectedItem = getByLabelText('All');
    expect(selectedItem).toBeInTheDocument();
    expect(selectedItem).toHaveTextContent('All');
  });
});

describe('MultiSelectDropdown Component', () => {
  const items = [
    {label: 'No', value: 'no'},
    {label: '2G', value: '2g'},
    {label: '3G', value: '3g'},
    {label: '4G', value: '4g'},
  ];

  const mockProps = {
    name: 'Coverage Type',
    parameter: {
      label: "Coverage Type",
      table: "school_static",
      field: "Coverage Type",
      filter: "in",
    },
    choices: items,
    itemKey: 'coverage_type__in',
    value: '2g, 3g, 4g',
    onChange: jest.fn(),
    type: 'select',
    description: 'test multiselect dropdown',
    active_countries_list: null
  };

  it('MultiSelectDropdown Component', () => {
    const { container } = render(<MultiSelectDropdown {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle onChange event', () => {
    const { getByLabelText } = render(<MultiSelectDropdown {...mockProps} />);
    const dropdownComponent = getByLabelText(`Select ${mockProps.name}`);

    fireEvent.change(dropdownComponent, { target: { selectedItems: [{ value:  '2g' }] } });
    expect(mockProps.onChange).toHaveBeenCalledWith('computer_lab__on', '2g');
  });
});

describe('RangeTextInput Component', () => {
  const mockProps = {
    name: 'No of Computers',
    value: '10,20',
    parameter: {
      label: "No of Computers",
      table: "school_static",
      field: "num_computers",
      filter: "range",
    },
    itemKey: 'num_computers__range',
    onChange: jest.fn(),
    type: 'range',
    description: 'test range input',
    active_countries_list: null
  };

  it('RangeTextInput input', () => {
    const { container } = render(<RangeTextInput {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle onChange event for min input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min');

    fireEvent.change(minInput, { target: { value: '15' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', '15,20');
  });

  it('should handle onChange event for min input (invalid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min');

    fireEvent.change(minInput, { target: { value: 'abc' } }); // Invalid input

    expect(mockProps.onChange).not.toHaveBeenCalled(); // Expect no call
  });

  it('should handle onChange event for max input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const maxInput = getByPlaceholderText('Max');

    fireEvent.change(maxInput, { target: { value: '25' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', '10,25');
  });

  

  it('should handle onChange event for clearing min input only', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min');
    const maxInput = getByPlaceholderText('Max');

    fireEvent.change(minInput, { target: { value: '' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', ',20');
  });

  it('should handle onChange event for clearing max input only', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min');
    const maxInput = getByPlaceholderText('Max');

    fireEvent.change(maxInput, { target: { value: '' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', '10,');
  });
});

describe('FilterPopup test', () => {
  it('should render valid mode', () => {
    const { asFragment } = render(
      testWrapper(<FilterPopup open={false} setOpen={jest.fn()} />)
    );
    expect(asFragment()).toMatchSnapshot();
  })
  it('should render valid mode', () => {
    const { asFragment } = render(
      testWrapper(<FilterPopup open={true} setOpen={jest.fn()} />)
    );
    expect(asFragment()).toMatchSnapshot();
  })
})
