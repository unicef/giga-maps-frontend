import "~/core/i18n/instance"

import { findByLabelText, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { fetchAdvanceFilterFx, fetchCountryFx } from "~/api/project-connect"
import filterData from "~/tests/data/filter-data"
import { testWrapper } from "~/tests/test-wrapper"

import FilterButton from "../ui/advanced-filter/filter"
import FilterPopupContent from "../ui/advanced-filter/filter-popup-content"
import RangeTextInput from "../ui/advanced-filter/range-text-input"
import TextField from "../ui/advanced-filter/text-input"

describe('AdvancedFilter', () => {

  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('accounts/adv_filters')) {
        return Promise.resolve(JSON.stringify(filterData))
      } else if (req.url.includes('api/v2/entities/countries/br')) {
        return Promise.resolve(JSON.stringify({
          id: 1,
          name: 'Brazil',
          code: 'br',
        }))
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

  test('should render Advance filter button', async () => {
    await fetchAdvanceFilterFx()
    const { asFragment } = render(testWrapper(<FilterButton />))
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render Advance filter button ', async () => {
    await fetchCountryFx('br')
    await fetchAdvanceFilterFx()
    const { asFragment } = render(testWrapper(<FilterButton />))
    expect(asFragment()).toMatchSnapshot();
  })

  test('should filter button trigger', async () => {
    await fetchCountryFx('br')
    await fetchAdvanceFilterFx()
    render(testWrapper(<FilterButton />))
    const button = (await screen.findByText("Filters")).parentNode as HTMLElement;
    await userEvent.click(button);

    const textInput = (await screen.findByPlaceholderText("Enter building id"))
    await fireEvent.change(textInput, "123");
    // screen.debug();
  })

  test('should render Advance filter', async () => {
    await fetchAdvanceFilterFx()
    const { asFragment } = render(<FilterPopupContent setOpen={() => { }} />)
    expect(asFragment()).toMatchSnapshot();
  })


})

describe.skip('TextField with StyledTextInput', () => {
  const mockOnChange = vi.fn();

  test('should call onChange handler when user types in the input', async () => {
    const { getByPlaceholderText } = render(<TextField
      name="Data Source"
      value=""
      itemKey="data_source"
      type="text"
      description=""
      column_configuration={{ name: '', label: '', type: '', table_name: '', table_alias: '', table_label: '', options: { downcast_aggr_str: '', upcast_aggr_str: '' } }}
      query_param_filter=""
      onChange={mockOnChange}
    />);

    const input = getByPlaceholderText('Enter Data Source')

    await fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});

describe('RangeTextInput Component', () => {
  const mockProps = {
    column_configuration: {
      name: '',
      label: '',
      type: '',
      table_name: '',
      table_alias: '',
      table_label: '',
      options: {
        downcast_aggr_str: '',
        upcast_aggr_str: '',
      }
    },
    options: {
      include_none_filter: true,
      active_range: {
        min_value: 0,
        max_value: 10000,
        min_place_holder: "Min (0)",
        max_place_holder: "Max (10K)"
      }
    },
    query_param_filter: "",
    name: "No of Teachers",
    type: "range",
    value: {
      none_range: true,
      value: "15,20",
    },
    itemKey: 'num_computers__range',
    onChange: vi.fn(),
    description: 'test range input',
  };

  it('RangeTextInput input', () => {
    const { container } = render(<RangeTextInput {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle onChange event for min input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min (0)');

    fireEvent.change(minInput, { target: { value: '25' } });

    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('should handle onChange event for min input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} value={{ "none_range": false, "value": "" }} />);
    const minInput = getByPlaceholderText('Min (0)');

    fireEvent.change(minInput, { target: { value: '0' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": false, "value": "" });
  });


  it('should handle onChange event for min input (invalid value)', () => {
    mockProps.onChange.mockReset();
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const minInput = getByPlaceholderText('Min (0)');
    const maxInput = getByPlaceholderText('Max (10K)');
    fireEvent.change(minInput, { target: { value: 'abc' } }); // Invalid input (treated as empty)
    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": true, "value": "null,20" });
    
    mockProps.onChange.mockReset();
    fireEvent.change(maxInput, { target: { value: 'test' } }); // Invalid input (treated as empty)
    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": true, "value": "15,null" });
  });

  it('should handle onChange event for min input (empty value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} value={{ "none_range": false, "value": ",20" }} />);
    const maxInput = getByPlaceholderText('Max (10K)');

    fireEvent.change(maxInput, { target: { value: '' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('num_computers__range', { "none_range": false, "value": "" });
  });


  it('should handle onChange event for max input (valid value)', () => {
    const { getByPlaceholderText } = render(<RangeTextInput {...mockProps} />);
    const maxInput = getByPlaceholderText('Max (10K)');

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


