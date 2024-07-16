import { fireEvent, render } from "@testing-library/react"
import { createEvent } from "effector"

import { fileImportList } from "~/tests/data/file-import-list";

import { $importCsvList } from "../../models/school-model";
import FilesImportsList from "../schools/file-import/files-imports-list"


const setImportCsvList = createEvent();
$importCsvList.on(setImportCsvList, (_, payload) => payload)

describe(("FilesImportsList"), () => {
  test("Render FilesImportsList", () => {
    setImportCsvList(fileImportList)

    const handleClick = jest.fn();
    const { container } = render(<FilesImportsList onClick={handleClick} />);
    const importCsv = container.querySelector('#admin-import-csv');
    fireEvent.click(importCsv)

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const fileInput = container.querySelector('#fileInput');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const form = container.querySelector("#formElemImportCsv");
    fireEvent.submit(form);
  })
})