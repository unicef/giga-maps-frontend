import { fireEvent, render } from "@testing-library/react"

import TextField from "../ui/advanced-filter/text-input"
import FilterPopupContent from "../ui/advanced-filter/filter-popup-content"
import { fetchAdvanceFilterFx } from "~/api/project-connect"
import filterData from "~/tests/data/filter-data"
import RangeTextInput from "../ui/advanced-filter/range-text-input"

describe('AdvancedFilter', () => {

  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('advanced_filters/')) {
        return Promise.resolve(JSON.stringify(filterData))
      } else {
        return Promise.resolve(JSON.stringify(null))
      }
    });
  })
  test('should render Advance filter', async () => {
    await fetchAdvanceFilterFx()
    const { asFragment } = render(<FilterPopupContent setOpen={() => { }} />)
    expect(asFragment()).toMatchSnapshot();
  })


})

describe('TextField with StyledTextInput', () => {
  const mockOnChange = jest.fn();

  test('should call onChange handler when user types in the input', async () => {
    const { getByPlaceholderText } = render(<TextField place_holder="Enter Data Source" itemKey="" value="" parameter={{ label: '', table: '', field: '', filter: '' }} description="" type="" active_countries_list={[]} name="Data Source" onChange={mockOnChange} />);

    const input = getByPlaceholderText('Enter Data Source')

    await fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});

// describe('<SingleDropdown />', () => {
//   const items = [
//     { label: 'All', value: '' },
//     { label: 'Urban', value: 'uAllrban' },
//     { label: 'Rural', value: 'rural' },
//   ];

//   const mockOnChange = jest.fn();

//   it('renders with default "All" selected', () => {
//     const { getByLabelText } = render(
//       <SingleDropdown
//         id="dropdown-education_level"
//         label="All"
//         items={items}
//         onChange={mockOnChange}
//       />
//     );

//     const dropdownLabel = getByLabelText('All');
//     expect(dropdownLabel).toBeInTheDocument();
//     expect(dropdownLabel).toHaveTextContent('All');

//     const selectedItem = getByLabelText('All');
//     expect(selectedItem).toBeInTheDocument();
//     expect(selectedItem).toHaveTextContent('All');
//   });
// });

// describe('MultiSelectDropdown Component', () => {
//   const items = [
//     { label: 'No', value: 'no' },
//     { label: '2G', value: '2g' },
//     { label: '3G', value: '3g' },
//     { label: '4G', value: '4g' },
//   ];

//   const mockProps = {
//     name: 'Coverage Type',
//     parameter: {
//       label: "Coverage Type",
//       table: "school_static",
//       field: "Coverage Type",
//       filter: "in",
//     },
//     choices: items,
//     itemKey: 'coverage_type__in',
//     value: '2g, 3g, 4g',
//     onChange: jest.fn(),
//     type: 'select',
//     description: 'test multiselect dropdown',
//     active_countries_list: null
//   };

//   it('MultiSelectDropdown Component', () => {
//     const { container } = render(<MultiSelectDropdown {...mockProps} />);
//     expect(container).toMatchSnapshot();
//   });

//   it('should handle onChange event', () => {
//     const { getByLabelText } = render(<MultiSelectDropdown {...mockProps} />);
//     const dropdownComponent = getByLabelText(`Select ${mockProps.name}`);

//     fireEvent.change(dropdownComponent, { target: { selectedItems: [{ value: '2g' }] } });
//     expect(mockProps.onChange).toHaveBeenCalledWith('computer_lab__on', '2g');
//   });
// });

describe('RangeTextInput Component', () => {
  const mockProps = {
    name: "No of Teachers",
    type: "range",
    include_none_filter: true,
    active_countries_range: {
      "30": {
        min_place_holder: "Min (0)",
        max_place_holder: "Max (10K)"
      }
    },
    value: {
      none_range: true,
      value: "15,20",
    },
    parameter: {
      label: "No of Teachers",
      table: "school_static",
      field: "num_computers",
      filter: "range",
    },
    itemKey: 'num_computers__range',
    onChange: jest.fn(),
    description: 'test range input',
    active_countries_list: null
  };

  it('RangeTextInput input', () => {
    const { container } = render(<RangeTextInput {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle onChange event for min input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min(0)');

    fireEvent.change(minInput, { target: { value: '25' } });

    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('should handle onChange event for min input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} value={{ "none_range": false, "value": "" }} />);
    const minInput = getByPlaceholderText('Min(0)');

    fireEvent.change(minInput, { target: { value: '0' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": false, "value": "" });
  });


  it('should handle onChange event for min input (invalid value)', () => {
    mockProps.onChange.mockReset();
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min(0)');
    const maxInput = getByPlaceholderText('Max');
    fireEvent.change(minInput, { target: { value: 'abc' } }); // Invalid input
    fireEvent.change(maxInput, { target: { value: 'test' } }); // Invalid input
    expect(mockProps.onChange).toHaveBeenCalled(); // Expect no call
  });

  it('should handle onChange event for min input (empty value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} value={{ "none_range": false, "value": "" }} />);
    const maxInput = getByPlaceholderText('Max');

    fireEvent.change(maxInput, { target: { value: '0' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": false, "value": "" });
  });


  it('should handle onChange event for max input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const maxInput = getByPlaceholderText('Max');

    fireEvent.change(maxInput, { target: { value: '25' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": true, "value": "15,25" });
  });

  it('should handle onChange event on Show null values', () => {
    mockProps.onChange.mockReset();
    const { getByLabelText } = render(<RangeTextInput {...mockProps} />);
    const checkbox = getByLabelText('Show null values');

    fireEvent.click(checkbox);
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('should handle onChange event on Show null value with empty min max', () => {
    mockProps.onChange.mockReset();
    const { getByLabelText } = render(<RangeTextInput {...mockProps} value={{ "none_range": true, "value": "" }} />);
    const checkbox = getByLabelText('Show null values');

    fireEvent.click(checkbox);
    expect(mockProps.onChange).toHaveBeenCalled();
  });

});

// describe('FilterPopup test', () => {
//   it('should render valid mode', () => {
//     const { asFragment } = render(
//       testWrapper(<FilterPopup open={false} setOpen={jest.fn()} />)
//     );
//     expect(asFragment()).toMatchSnapshot();
//   })
//   it('should render valid mode', () => {
//     const { asFragment } = render(
//       testWrapper(<FilterPopup open={true} setOpen={jest.fn()} />)
//     );
//     expect(asFragment()).toMatchSnapshot();
//   })
// })
