import { fireEvent, render, screen } from "@testing-library/react";
import { createEvent } from "effector";

import { adminCountrySummaryList } from "~/tests/data/country-filter-modal";
import { testWrapper } from "~/tests/jest-wrapper";

import { $countrySummaryList } from "../../models/country-model";
import AddCountrySummary from "../country/country-summary-crud/add-country-summary";
import EditCountySummary from "../country/country-summary-crud/edit-county-summary";
import FormCountrySummary from "../country/country-summary-crud/form-country-summary";
import ListCountySummary from "../country/country-summary-crud/list-county-summary";

const setCountrySummaryList = createEvent();
$countrySummaryList.on(setCountrySummaryList, (_, payload) => payload)



describe("Country Crud Tab", () => {

  test("Select county summary and delete and verify", () => {
    setCountrySummaryList(adminCountrySummaryList)
    const handleClick = jest.fn();
    const { container, getByTestId } = render(testWrapper(<ListCountySummary onClick={handleClick} />));
    const checkboxes = container.querySelectorAll('.cds--checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[1]);
      const button = getByTestId('delete-selected-country-summary');
      fireEvent.click(button)
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
    } else {
      console.error('No button with class name found');
    }

  })

  test("render EditCountySummary by click on edit , and field and sumbit", () => {
    setCountrySummaryList(adminCountrySummaryList)
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<ListCountySummary onClick={handleClick} />));
    const button = getByTestId(`admin-edit-country-summry-${adminCountrySummaryList.results[0]?.id}`);
    fireEvent.click(button)
    render(<EditCountySummary />)
    expect(screen.getByText(adminCountrySummaryList.results[0]?.country_name))
  })

  test("render form of country summary edit and submit by editing country field", () => {
    const { container } = render(<FormCountrySummary isEditMode={true} countrySummaryItemId={adminCountrySummaryList.results[0]?.id} />);

    const schoolNum = container.querySelector('#num-school');
    fireEvent.change(schoolNum, { target: { value: '10' } });
    expect(schoolNum.value).toBe('10');

    const connectivitySpeed = container.querySelector('#connectivity-speed');
    fireEvent.change(connectivitySpeed, { target: { value: '10' } });
    expect(connectivitySpeed.value).toBe('10');

    const connectivityLatency = container.querySelector('#connectivity-latency');
    fireEvent.change(connectivityLatency, { target: { value: '10' } });
    expect(connectivityLatency.value).toBe('10');

    const numConnectedSchool = container.querySelector('#num-connected-school');
    fireEvent.change(numConnectedSchool, { target: { value: '10' } });
    expect(numConnectedSchool.value).toBe('10');

    const numSchoolsConnectivityGood = container.querySelector('#num-Schools-connectivity-good');
    fireEvent.change(numSchoolsConnectivityGood, { target: { value: '10' } });
    expect(numSchoolsConnectivityGood.value).toBe('10');

    const numSchoolsConnectivityModerate = container.querySelector('#num-schools-connectivity-moderate');
    fireEvent.change(numSchoolsConnectivityModerate, { target: { value: '10' } });
    expect(numSchoolsConnectivityModerate.value).toBe('10');

    const numSchoolsConnectivityNo = container.querySelector('#num-schools-connectivity-no');
    fireEvent.change(numSchoolsConnectivityNo, { target: { value: '10' } });
    expect(numSchoolsConnectivityNo.value).toBe('10');

    const numSchoolsConnectivityUnknown = container.querySelector('#num-schools-connectivity-unknown');
    fireEvent.change(numSchoolsConnectivityUnknown, { target: { value: '10' } });
    expect(numSchoolsConnectivityUnknown.value).toBe('10');

    const form = container.querySelector("#country-summary-form")
    fireEvent.submit(form)
  })

  test("Render AddCountrySummary", () => {
    render(<AddCountrySummary />)
  })
})