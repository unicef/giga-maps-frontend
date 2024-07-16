import { Interval, isThisMonth, isThisWeek, isToday } from 'date-fns';

import { intervalOptions } from './defaults';
import { IntervalOptions, IntervalUnit } from './types';

export const isCurrentInterval = (
  { start }: Interval,
  intervalUnit: IntervalUnit,
  options: IntervalOptions = intervalOptions
): boolean => {
  switch (intervalUnit) {
    case IntervalUnit.day:
      return isToday(start);
    case IntervalUnit.week:
      return isThisWeek(start, options);
    case IntervalUnit.month:
      return isThisMonth(start);
    default:
      throw new Error('Unknown interval unit!');
  }
};
