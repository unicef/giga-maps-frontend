import { fireEvent, render, screen } from "@testing-library/react";
import { createEvent } from "effector";

import { mockSchoolSummaryList } from "~/tests/data/school-list";
import { testWrapper } from "~/tests/jest-wrapper";

import { $schoolSummaryListAdmin } from "../../models/school-model";
import MainAdminSchoolView from "../schools/main-admin-school-view";
import AddSchoolSummary from "../schools/schools-summary-crud/add-school-summary";
import EditSchoolSummary from "../schools/schools-summary-crud/edit-school-summary";
import FormSchoolSummary from "../schools/schools-summary-crud/form-school-summary";
import ListSchoolSummary from "../schools/schools-summary-crud/list-school-summary";




const setSummarySummaryListAdmin = createEvent();
$schoolSummaryListAdmin.on(setSummarySummaryListAdmin, (_, payload) => payload)

describe("School Summary Crud Tab", () => {

  test('change tab by click', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<MainAdminSchoolView onClick={handleClick} />));
    const button = getByTestId('admin-School Summary-tab');
    fireEvent.click(button);
  })

  test("Select school summary and delete", () => {
    setSummarySummaryListAdmin(mockSchoolSummaryList)
    const handleClick = jest.fn();
    const { container } = render(testWrapper(<ListSchoolSummary onClick={handleClick} />));
    const checkboxes = container.querySelectorAll('.cds--checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[1]);
      const button = container.querySelector('#delete-selected-School-Summary');
      fireEvent.click(button)
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
    } else {
      console.error('No button with class name found');
    }

  })

  test("render edit EditSchoolSummary by click on edit , and field and sumbit", () => {
    setSummarySummaryListAdmin(mockSchoolSummaryList)
    const handleClick = jest.fn();
    const { container } = render(testWrapper(<ListSchoolSummary onClick={handleClick} />));
    const button = container.querySelector(`#admin-edit-School-summary-${mockSchoolSummaryList.results[0]?.id}`);
    fireEvent.click(button)
    render(<EditSchoolSummary />)
    expect(screen.getByText('School Summary Edit'))
    expect(screen.getByText(mockSchoolSummaryList.results[0]?.school_name))
  })

  test("render form of School edit and submit by editing School field", () => {
    const { container } = render(<FormSchoolSummary isEditMode={true} schoolSummaryId={mockSchoolSummaryList.results[0]?.id} />);

    const schoolNum = container.querySelector('#num-student');
    fireEvent.change(schoolNum, { target: { value: '10' } });
    expect(schoolNum.value).toBe('10');

    const connectivitySpeed = container.querySelector('#connectivity-speed');
    fireEvent.change(connectivitySpeed, { target: { value: '10' } });
    expect(connectivitySpeed.value).toBe('10');

    const connectivityLatency = container.querySelector('#connectivity-latency');
    fireEvent.change(connectivityLatency, { target: { value: '10' } });
    expect(connectivityLatency.value).toBe('10');

    const numConnectedSchool = container.querySelector('#num-teacher');
    fireEvent.change(numConnectedSchool, { target: { value: '10' } });
    expect(numConnectedSchool.value).toBe('10');

    const numSchoolsConnectivityModerate = container.querySelector('#num-classroom');
    fireEvent.change(numSchoolsConnectivityModerate, { target: { value: '10' } });
    expect(numSchoolsConnectivityModerate.value).toBe('10');

    const form = container.querySelector("#admin-school-summary-form")
    fireEvent.submit(form)
  })

  test("Render AddSchool", () => {
    render(<AddSchoolSummary />)
  })

})