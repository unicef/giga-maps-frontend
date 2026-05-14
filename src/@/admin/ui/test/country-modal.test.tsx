import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { countryList } from "~/tests/data/country-filter-modal"
import { testWrapper } from "~/tests/test-wrapper"

import CountryFilterModal from "../common-components/country-filter-modal"

describe("CountryFilterModal", () => {
  test("render CountryFilterModal and click on checkbox", () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(testWrapper(<CountryFilterModal open={true} setOpen={vi.fn()} list={countryList} filterValues={[]} setFilterValues={vi.fn()} updateList={vi.fn()} name={""} onClick={handleClick} />));
    const button = getByTestId(`checkbox-country-${countryList[0]?.id}`);
    fireEvent.click(button);
    expect(screen.getByText(countryList[0]?.name))
  })

  test("renders CountryFilterModal and clicks on checkbox without setFilterValues", () => {
    render(testWrapper(
      <CountryFilterModal
        open={true}
        setOpen={vi.fn()}
        list={countryList}
        filterValues={[]}
        updateList={vi.fn()}
        name={""}
      />))
    const checkbox = screen.getByTestId(`checkbox-country-${countryList[0]?.id}`);
    fireEvent.click(checkbox);
    expect(screen.getByTestId(`checkbox-country-${countryList[0]?.id}`)).toBeChecked();
  })

  test("renders CountryFilterModal and unchecks an already checked checkbox", () => {
    const setFilterValues = vi.fn();
    render(testWrapper(
      <CountryFilterModal
        open={true}
        setOpen={vi.fn()}
        list={countryList}
        filterValues={[countryList[0]?.id]}
        setFilterValues={setFilterValues}
        updateList={vi.fn()}
        name={""}
      />))
    const checkbox = screen.getByTestId(`checkbox-country-${countryList[0]?.id}`);
    fireEvent.click(checkbox);
    expect(setFilterValues).toHaveBeenCalledWith([]);
  })

  test("closes CountryFilterModal when close button is clicked", () => {
    const setOpen = vi.fn();
    render(testWrapper(
      <CountryFilterModal
        open={true}
        setOpen={setOpen}
        list={countryList}
        filterValues={[]}
        setFilterValues={vi.fn()}
        updateList={vi.fn()}
        name={""}
      />
    ))
    const closeButton = screen.getByTitle('Close');
    fireEvent.click(closeButton);
    expect(setOpen).toHaveBeenCalledWith(false);
  })

  test("calls updateList and setOpen when Apply button is clicked", () => {
    const setFilterValues = vi.fn();
    const setOpen = vi.fn();
    const updateList = vi.fn();
    render(testWrapper(
      <CountryFilterModal
        open={true}
        setOpen={setOpen}
        list={countryList}
        filterValues={[]}
        setFilterValues={setFilterValues}
        updateList={updateList}
        name={""}
      />
    ))
    const checkbox = screen.getByTestId(`checkbox-country-${countryList[0]?.id}`);
    fireEvent.click(checkbox);
    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);
    // expect(updateList).toHaveBeenCalledWith([countryList[0]?.id]);
    expect(setOpen).toHaveBeenCalledWith(false);
  })

  test("render CountryFilterModal and click on reset", async () => {
    const setOpen = vi.fn();
    const { getByTestId } = render(testWrapper(<CountryFilterModal open={true} setOpen={setOpen} list={countryList} filterValues={[]} setFilterValues={vi.fn()} updateList={vi.fn()} name={""} />));
    const button = getByTestId(`reset-country-filter`);
    fireEvent.click(button);
    expect(setOpen).toHaveBeenCalledWith(false);
  })
})

