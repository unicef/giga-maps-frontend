import { fireEvent, render, screen } from "@testing-library/react";
import { createEvent } from "effector";

import { mockSchoolDailtSummary, mockSchoolSummaryList } from "~/tests/data/school-list";
import { testWrapper } from "~/tests/jest-wrapper";

import { $schoolDailyListAdmin, $schoolSummaryListAdmin } from "../../models/school-model";
import MainAdminSchoolView from "../schools/main-admin-school-view";
import AddSchoolDailySummary from "../schools/school-daily-connectivity-summary-crud/add-school-daily-summary";
import EditSchoolDailySummary from "../schools/school-daily-connectivity-summary-crud/edit-school-daily-summary";
import FormSchoolDailySummary from "../schools/school-daily-connectivity-summary-crud/form-school-daily-summary";
import ListSchoolDailyConnectivitySummary from "../schools/school-daily-connectivity-summary-crud/list-school-daily-summary";
import AddSchoolSummary from "../schools/schools-summary-crud/add-school-summary";
import EditSchoolSummary from "../schools/schools-summary-crud/edit-school-summary";
import FormSchoolSummary from "../schools/schools-summary-crud/form-school-summary";
import ListSchoolSummary from "../schools/schools-summary-crud/list-school-summary";




const setSchoolDailyListAdmin = createEvent();
$schoolDailyListAdmin.on(setSchoolDailyListAdmin, (_, payload) => payload)

describe("School daily Summary Crud Tab", () => {
  test('change tab by click', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<MainAdminSchoolView onClick={handleClick} />));
    const button = getByTestId('admin-School Daily Connectivity Summary-tab');
    fireEvent.click(button);
  })

  test("Select school daily summary and delete", () => {
    setSchoolDailyListAdmin(mockSchoolDailtSummary)
    const handleClick = jest.fn();
    const { container } = render(testWrapper(<ListSchoolDailyConnectivitySummary onClick={handleClick} />));
    const checkboxes = container.querySelectorAll('.cds--checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[1]);
      const button = container.querySelector('#delete-selected-School-daily-Summary');
      fireEvent.click(button)
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
    } else {
      console.error('No button with class name found');
    }

  })

  test("render edit EditSchoolDailySummary by click on edit , and field and sumbit", () => {
    setSchoolDailyListAdmin(mockSchoolDailtSummary)
    const handleClick = jest.fn();
    const { container } = render(testWrapper(<ListSchoolDailyConnectivitySummary onClick={handleClick} />));
    const button = container.querySelector(`#admin-edit-School-daily-summary-${mockSchoolDailtSummary.results[0]?.id}`);
    fireEvent.click(button)
    render(<EditSchoolDailySummary />)
    expect(screen.getByText('School Daily Edit'))
    expect(screen.getByText(mockSchoolDailtSummary.results[0]?.school_name))
  })

  test("render form of School daily summary edit and submit by editing School field", () => {
    const { container } = render(<FormSchoolDailySummary isEditMode={true} schoolDailyId={mockSchoolDailtSummary.results[0]?.id} />);

    const connectivitySpeed = container.querySelector('#connectivity-speed');
    fireEvent.change(connectivitySpeed, { target: { value: '10' } });
    expect(connectivitySpeed.value).toBe('10');

    const connectivityLatency = container.querySelector('#connectivity-latency');
    fireEvent.change(connectivityLatency, { target: { value: '10' } });
    expect(connectivityLatency.value).toBe('10');

    const form = container.querySelector("#school-daily-form")
    fireEvent.submit(form)
  })

  test("Render AddSchoolDailySummary", () => {
    render(<AddSchoolDailySummary />)
  })

})