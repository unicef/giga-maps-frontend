import { fireEvent, getByTestId, render, screen, waitFor } from "@testing-library/react"
import { createEvent } from "effector"

import Toast from "~/@/common/Toast";
import { AdminCountryList, countryList } from "~/tests/data/country-filter-modal";
import { testWrapper } from "~/tests/jest-wrapper"

import { $countryListAdmin } from "../../models/country-model";
import AddCountry from "../country/country-crud/add-country";
import EditCountry from "../country/country-crud/edit-country";
import FormCountry from "../country/country-crud/form-country";
import ListCountry from "../country/country-crud/list-country";
import MainCountryView from "../country/main-country-view"

const setCountryList = createEvent();
$countryListAdmin.on(setCountryList, (_, payload) => payload)

describe("Country Crud Tab", () => {
  test("render MainCountryView", () => {
    const { asFragment } = render(testWrapper(<MainCountryView />))
    expect(asFragment()).toMatchSnapshot()
  })

  test('change tab by click', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<MainCountryView onClick={handleClick} />));
    const button = getByTestId('admin-Country Summary-tab');
    fireEvent.click(button);
  })

  test("Select county and delete and verify", () => {
    setCountryList(AdminCountryList)
    const handleClick = jest.fn();
    const { container, getByTestId } = render(testWrapper(<ListCountry onClick={handleClick} />));
    const checkboxes = container.querySelectorAll('.cds--checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[1]);
      const button = getByTestId('delete-selected-country');
      const verifyButton = getByTestId('verify-selected-country');
      fireEvent.click(verifyButton)
      fireEvent.click(button)
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
      void waitFor(() => {
        render(<Toast />)
        expect(screen.getByText('Record Deleted.'))
      })
    } else {
      console.error('No button with class name found');
    }

  })

  test("render edit EditCountry by click on edit , and field and sumbit", () => {
    setCountryList(AdminCountryList)
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<ListCountry onClick={handleClick} />));
    const button = getByTestId(`admin-edit-country-${AdminCountryList.results[0]?.id}`);
    fireEvent.click(button)
    render(<EditCountry />)
    expect(screen.getByText('Edit country'))
    expect(screen.getByText(AdminCountryList.results[0]?.name))
  })

  test("render form of country edit and submit by editing country field", () => {
    const { container, getByTestId } = render(<FormCountry isEdit={true} countryItemId={AdminCountryList.results[0]?.id} />);
    const input = container.querySelector('#country-name');
    fireEvent.change(input, { target: { value: 'United States' } });
    expect(input.value).toBe('United States');
    const form = container.querySelector("#formElem")
    fireEvent.submit(form)
  })

  // test("", () => {
  //   const { container, getByTestId } = render(<FormCountry isEdit={true} countryItemId={AdminCountryList.results[0]?.id} />);
  //   const file = new File(['test'], 'test.png', { type: 'image/png' });
  //   const fileInput = container.querySelector('#fileInput')
  //   fireEvent.change(fileInput, { target: { files: [file] } });
  //   const form = container.querySelector("#formElem")
  //   fireEvent.submit(form)
  // })

  test("Render AddCountry", () => {
    render(<AddCountry />)
  })
})
