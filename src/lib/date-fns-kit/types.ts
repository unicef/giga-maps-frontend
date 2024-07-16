import { Locale } from 'date-fns';

export type IntervalOptions = {
  locale?: Locale;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};


export enum IntervalUnit {
  // "day" = "day",
  'week' = "week",
  "month" = "month"
}
