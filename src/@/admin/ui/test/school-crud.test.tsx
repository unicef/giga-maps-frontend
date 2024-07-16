import { fireEvent, getByTestId, render, screen, waitFor } from "@testing-library/react"
import { createEvent } from "effector"

import { mockSchoolList } from "~/tests/data/school-list";
import { testWrapper } from "~/tests/jest-wrapper";

import { $schoolListAdmin } from "../../models/school-model";
import MainAdminSchoolView from "../schools/main-admin-school-view";
import AddSchools from "../schools/schools-crude/add-schools";
import EditSchools from "../schools/schools-crude/edit-schools";
import FormSchools from "../schools/schools-crude/form-schools";
import ListSchools from "../schools/schools-crude/list-schools";



const setSchoolList = createEvent();
$schoolListAdmin.on(setSchoolList, (_, payload) => payload)

describe("School Crud Tab", () => {
  test("render MainSchoolView", () => {
    const { asFragment } = render(testWrapper(<MainAdminSchoolView />))
    expect(asFragment()).toMatchSnapshot()
  })

  test('change tab by click', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<MainAdminSchoolView onClick={handleClick} />));
    const button = getByTestId('admin-School-tab');
    fireEvent.click(button);
  })

  test("Select School and delete", () => {
    setSchoolList(mockSchoolList)
    const handleClick = jest.fn();
    const { container } = render(testWrapper(<ListSchools onClick={handleClick} />));
    const checkboxes = container.querySelectorAll('.cds--checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[1]);
      const button = container.querySelector('#delete-selected-School');
      fireEvent.click(button)
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
    } else {
      console.error('No button with class name found');
    }

  })

  test("render edit EditSchool by click on edit , and field and sumbit", () => {
    setSchoolList(mockSchoolList)
    const handleClick = jest.fn();
    const { container } = render(testWrapper(<ListSchools onClick={handleClick} />));
    const button = container.querySelector(`#admin-edit-School-${mockSchoolList.results[0]?.id}`);
    fireEvent.click(button)
    render(<EditSchools />)
    expect(screen.getByText('School Edit'))
    expect(screen.getByText(mockSchoolList.results[0]?.name))
  })

  test("render form of School edit and submit by editing School field", () => {
    const { container } = render(<FormSchools isEditMode={true} schoolId={mockSchoolList.results[0]?.id} />);
    const schoolName = container.querySelector('#school-name');
    fireEvent.change(schoolName, { target: { value: 'United States' } });
    expect(schoolName.value).toBe('United States');

    const schoolGiga = container.querySelector('#giga-id');
    fireEvent.change(schoolGiga, { target: { value: 'test' } });

    const admin1 = container.querySelector('#select-admin-1');
    fireEvent.change(admin1, { target: { value: 'test' } });

    const admin2 = container.querySelector('#select-admin-2');
    fireEvent.change(admin2, { target: { value: 'test' } });

    const altitude = container.querySelector('#altitude');
    fireEvent.change(altitude, { target: { value: 'test' } });

    const gps = container.querySelector('#gps-confidence');
    fireEvent.change(gps, { target: { value: 'test' } });

    const form = container.querySelector("#admin-school-form")
    fireEvent.submit(form)
  })

  test("Render import csv pop up", () => {
    const handleClick = jest.fn();
    const { container } = render(<ListSchools onClick={handleClick} />);
    const importCsv = container.querySelector('#admin-import-csv');
    fireEvent.click(importCsv)
    expect(screen.getByText('CSV import'))

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const fileInput = container.querySelector('#fileInput');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const form = container.querySelector("#formElemImportCsv");
    fireEvent.submit(form);

  })

  test("Render AddSchool", () => {
    render(<AddSchools />)
  })
})
