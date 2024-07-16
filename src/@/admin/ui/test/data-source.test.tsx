import { fireEvent, render } from "@testing-library/react"
import { createEvent } from "effector";

import { $admin1Code } from "~/@/country/country.model";

import EditDataSource from "../data-source/edit-data-source"
import EditableField from "../data-source/editable-field.view";
import { getAppConfigValues } from "../../models/admin-model";
import { getCountryList } from "~/@/api-docs/models/explore-api.model";
import { fetchMockResponse } from "~/tests/fetchMock";

const setAdmin1 = createEvent();
$admin1Code.on(setAdmin1, (_, payload) => payload)

describe('Data source', () => {

  beforeEach(() => {
    getAppConfigValues()
    getCountryList();
    fetchMock.mockResponse(fetchMockResponse)
  });
  test('take a snapshot of EditDataSource', async () => {
    const { asFragment } = render(<EditDataSource />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('trigger select all and uncheck', async () => {
    const { container } = render(<EditDataSource />)
    const checkboxAll = container.querySelector('#Select-all-checkbox-data-source') as Element;
    await fireEvent.click(checkboxAll);
    expect(checkboxAll).toBeInTheDocument();

    // uncheck row;
    const rowCheckbox = container.querySelector(`#checkbox-data-source3`) as Element;
    await fireEvent.click(rowCheckbox);
    // else case
    await fireEvent.click(rowCheckbox);
    expect(rowCheckbox).toBeInTheDocument();

  })

  test('click status link', async () => {
    const { getByText } = render(<EditDataSource />)
    const statusText = getByText('Status');
    // order asc
    await fireEvent.click(statusText);
    // order dsc
    await fireEvent.click(statusText);
    // set default
    await fireEvent.click(statusText);
    expect(statusText).toBeInTheDocument();
  })

  test('Change form input', async () => {
    const { container } = render(<EditDataSource />)
    const inputFields = container.querySelector('.editable-field-container')?.querySelector('input') as HTMLInputElement;
    if (inputFields) {
      await fireEvent.change(inputFields, { target: { value: 'Test' } });
    }
    expect(inputFields.value).toEqual('Test');
  })
  // test('Render DataSourceActionBar', () => {
  //   render(<EditDataSource />)
  // })

  test('EditableField', () => {
    const { asFragment } = render(<EditableField
      item={{ id: 1 }}
      fieldName={""}
      updatedData={{}}
      handleInputChange={jest.fn()}
      isEditable={true}
      readOnly={true}
    />)
    expect(asFragment()).toMatchSnapshot()
  })
})