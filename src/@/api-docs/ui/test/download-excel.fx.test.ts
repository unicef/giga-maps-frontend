import { describe, test, } from '@jest/globals';
import { downloadExcelFx } from '../../effects/download-excel.fx';

describe('downloadExcelFx', () => {
  test('downloads Excel file with correct file name', async () => {
    const params = {
      countryId: 123,
      schoolIds: ['SchoolId1', 'SchoolId2'],
      pageNo: 1,
      pageSize: 10,
      api: 1,
      apiKey: 'abc'
    };
    const result = {
      data: new Blob(['test'], { type: 'text/csv' }),
      response: {
        headers: new Map([['content-disposition', 'attachment; filename="exampleFileName.csv"']])
      }
    };

    const createObjectURLMock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock.mockReturnValue('exampleURL');

    const createElementMock = jest.spyOn(document, 'createElement');
    const clickMock = jest.spyOn(HTMLElement.prototype, 'click');

    await downloadExcelFx({ params, result });

    expect(createObjectURLMock).toHaveBeenCalledWith(result.data);
    expect(createElementMock).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
