import { createEffect } from "effector";

import { downloadSchoolDataFx } from "./explore-api-fx";


export const downloadExcelFx = createEffect(async ({ params, result }: Parameters<typeof downloadSchoolDataFx.done>['0']) => {
  try {
    const { countryId, schoolIds, pageNo, pageSize } = params;
    const { data: blob, response } = result;
    let fileName = `${schoolIds ? 'School_data' : ''}${!schoolIds && countryId ? 'Country_data' : ''}_page_${pageNo}_page_size_${pageSize}.csv`;
    const fileContent = response.headers.get('content-disposition');
    if (fileContent) {
      const extractedName = fileContent.split('filename="')[1]?.split('"')[0];
      fileName = extractedName || fileName;
    }
    // Create an Object URL from the Blob
    const csvURL = window.URL.createObjectURL(blob);

    // Create an anchor element for download
    const downloadLink = document.createElement("a");
    downloadLink.href = csvURL;
    downloadLink.download = fileName; // Set the file name

    // Trigger a click event to start the download
    downloadLink.click();

    // Clean up: Revoke the Object URL to release resources
    window?.URL?.revokeObjectURL?.(csvURL);

  } catch (e) {
    console.error(e);
  }
})