import { fireEvent, render, screen } from "@testing-library/react";
import { createEvent } from "effector";

import { testCountryDailyList } from "~/tests/data/country-filter-modal";
import { testWrapper } from "~/tests/jest-wrapper";

import { $countryDailySummaryList, } from "../../models/country-model";
import AddCountryDailySummary from "../country/country-daily-connectivity-summary-crud/add-country-daily-summary";
import EditCountryDailySummary from "../country/country-daily-connectivity-summary-crud/edit-country-daily-summary";
import FormCountryDailySummary from "../country/country-daily-connectivity-summary-crud/form-country-daily-summary";
import ListCountryDailySummary from "../country/country-daily-connectivity-summary-crud/list-country-daily-summary";


const setCountryDailySummaryList = createEvent();
$countryDailySummaryList.on(setCountryDailySummaryList, (_, payload) => payload)



describe("Country Crud Tab", () => {
  test("Select CountryDailySummary and delete and verify", () => {
    setCountryDailySummaryList(testCountryDailyList)
    const handleClick = jest.fn();
    const { container, getByTestId } = render(testWrapper(<ListCountryDailySummary onClick={handleClick} />));
    const checkboxes = container.querySelectorAll('.cds--checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[1]);
      const button = getByTestId('delete-country-daily-summary');
      fireEvent.click(button)
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
    } else {
      console.error('No button with class name found');
    }

  })

  test("render  EditCountryDailySummary by click on edit , and field and sumbit", () => {
    setCountryDailySummaryList(testCountryDailyList)
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<ListCountryDailySummary onClick={handleClick} />));
    const button = getByTestId(`edit-country-daily-summary-${testCountryDailyList.results[0]?.id}`);
    fireEvent.click(button)
    render(<EditCountryDailySummary />)
    expect(screen.getByText(testCountryDailyList.results[0]?.country_name))
  })

  test("render form of EditCountryDailySummary edit and submit by editing country field", () => {
    const handleClick = jest.fn();
    const { container, getByTestId } = render(<EditCountryDailySummary onClick={handleClick} />)
    //const { container, getByTestId } = render(<FormCountryDailySummary isEdit={true} formData={{}} onUdpateForm={jest.fn} onSubmit={jest.fn} />);
    const connectivitySpeed = container.querySelector('#connectivity-speed');
    fireEvent.change(connectivitySpeed, { target: { value: '10' } });
    expect(connectivitySpeed.value).toBe('10');

    const connectivityLatency = container.querySelector('#connectivity-latency');
    fireEvent.change(connectivityLatency, { target: { value: '10' } });
    expect(connectivityLatency.value).toBe('10');

    const button = getByTestId("submit-country-daily-summary")
    fireEvent.click(button)

    const form = container.querySelector("#country-daily-summary-form")
    fireEvent.submit(form)
  })

  test("Render AddCountryDailySummary", () => {
    const handleClick = jest.fn();
    const { container, getByTestId } = render(<AddCountryDailySummary onClick={handleClick} />)
    //const { container, getByTestId } = render(<FormCountryDailySummary isEdit={true} formData={{}} onUdpateForm={jest.fn} onSubmit={jest.fn} />);

    const connectivitySpeed = container.querySelector('#connectivity-speed');
    fireEvent.change(connectivitySpeed, { target: { value: '10' } });
    expect(connectivitySpeed.value).toBe('10');

    const connectivityLatency = container.querySelector('#connectivity-latency');
    fireEvent.change(connectivityLatency, { target: { value: '10' } });
    expect(connectivityLatency.value).toBe('10');

    const button = getByTestId("submit-country-daily-summary")
    fireEvent.click(button)

    const form = container.querySelector("#country-daily-summary-form")
    fireEvent.submit(form)
  })
})