import { createHistoryIntervalFormat } from '../../../sidebar.util';

describe('createHistoryIntervalFormat', () => {
  it('should return null when no date is provided', () => {
    const result = createHistoryIntervalFormat(undefined);
    expect(result).toBeNull();
  });

  it('should correctly format dates when valid start and end dates are provided', () => {
    const input = {
      start_date: '01-01-2023',
      end_date: '31-12-2023'
    };

    const result = createHistoryIntervalFormat(input);

    expect(result).toEqual({
      start: new Date(2023, 0, 1),
      end: new Date(2023, 11, 31)
    });
  });

  it('should handle single digit dates and months', () => {
    const input = {
      start_date: '1-1-2023',
      end_date: '9-9-2023'
    };

    const result = createHistoryIntervalFormat(input);

    expect(result).toEqual({
      start: new Date(2023, 0, 1),
      end: new Date(2023, 8, 9)
    });
  });

  it('should handle dates across different years', () => {
    const input = {
      start_date: '31-12-2022',
      end_date: '01-01-2023'
    };

    const result = createHistoryIntervalFormat(input);

    expect(result).toEqual({
      start: new Date(2022, 11, 31),
      end: new Date(2023, 0, 1)
    });
  });
});
