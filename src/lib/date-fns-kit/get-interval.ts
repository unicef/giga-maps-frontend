import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  Interval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import { intervalOptions } from './defaults';
import { IntervalOptions, IntervalUnit } from './types';

export const getInterval = (
  date: Date | number,
  intervalUnit: IntervalUnit,
  options: IntervalOptions = intervalOptions
): Interval => {
  switch (intervalUnit) {
    case IntervalUnit.day:
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };

    case IntervalUnit.week:
      return {
        start: startOfWeek(date, options),
        end: endOfWeek(date, options),
      };

    case IntervalUnit.month:
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };

    default:
      throw new Error('Unknown interval unit!');
  }
};
