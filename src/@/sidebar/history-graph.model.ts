import { add, Interval, sub } from 'date-fns';
import { combine, createEvent, createStore, merge, sample } from 'effector';

import {
  $admin1Code,
} from '~/@/country/country.model';
import { defaultInterval, defaultIntervalMonth } from '~/@/sidebar/sidebar.constant';
import { $mapRoutes, router } from '~/core/routes';
import { getInterval, isCurrentInterval } from '~/lib/date-fns-kit';
import { IntervalUnit } from '~/lib/date-fns-kit/types';
import { getInverted, setPayload } from '~/lib/effector-kit';

import { $connectivityAvailability, $currentLayerTypeUtils, $selectedLayerId } from "./sidebar.model";
import { createHistoryIntervalFormat } from './sidebar.util';

export const changeHistoryIntervalUnit = createEvent<IntervalUnit>();
export const nextHistoryInterval = createEvent();
export const previousHistoryInterval = createEvent();

export const $historyInterval = createStore<Interval>(defaultInterval());
export const changeHistoryInterval = createEvent<Interval>();
$historyInterval.on(changeHistoryInterval, setPayload)

export const $historyIntervalUnit = createStore<IntervalUnit>(IntervalUnit.week);
export const $isCurrentHistoryInterval = createStore(false);
export const $isNextHistoryIntervalAvailable = createStore(true);
export const $isPreviousHistoryIntervalAvailable = createStore(false);
export const $lastAvailableDates = createStore<null | { [IntervalUnit.week]: Interval, [IntervalUnit.month]: Interval }>(null);

export const $isCheckedLastDate = combine([
  $lastAvailableDates, $currentLayerTypeUtils, $mapRoutes
], ([lastAvailableDates, currentLayerTypeUtils, mapRoutes]) => {
  const { isLive } = currentLayerTypeUtils;
  if (mapRoutes.map) return true
  if (isLive) {
    return !!lastAvailableDates
  }
  return true;
})
sample({
  clock: $historyIntervalUnit,
  source: combine({ unit: $historyIntervalUnit, interval: $historyInterval }),
  fn: ({ unit, interval }) => {
    return getInterval(unit === IntervalUnit.week ? interval.start : interval.end, unit)
  },
  target: changeHistoryInterval,
});

sample({
  source: combine([$historyInterval, $historyIntervalUnit]),
  fn: ([interval, unit]) => isCurrentInterval(interval, unit),
  target: $isCurrentHistoryInterval,
});

sample({
  source: $isCurrentHistoryInterval,
  fn: getInverted,
  target: $isNextHistoryIntervalAvailable,
});

sample({
  clock: nextHistoryInterval,
  source: combine([$historyInterval, $historyIntervalUnit]),
  fn: ([interval, unit]) =>
    getInterval(add(interval.start, { [`${unit}s`]: 1 }), unit),
  target: changeHistoryInterval,
});

sample({
  source: combine([$historyInterval, $historyIntervalUnit]),
  clock: previousHistoryInterval,
  fn: ([interval, unit]) =>
    getInterval(sub(interval.start, { [`${unit}s`]: 1 }), unit),
  target: changeHistoryInterval,
});

sample({
  clock: merge([$connectivityAvailability]),
  source: combine({ isAdmin: $admin1Code, connectivityDates: $connectivityAvailability }),
  fn: (_, availableDates) => {
    if (availableDates) {
      return {
        [IntervalUnit.week]: createHistoryIntervalFormat(availableDates?.week) ?? defaultInterval(),
        [IntervalUnit.month]: createHistoryIntervalFormat(availableDates?.month) ?? defaultIntervalMonth(),
      }
    }
    return null;
  },
  filter: ({ isAdmin, connectivityDates }) => {
    if (isAdmin) {
      return Boolean(connectivityDates)
    }
    return true;
  },
  target: $lastAvailableDates
})
sample({
  clock: $lastAvailableDates,
  source: $historyIntervalUnit,
  fn: (unit, lastAvailableDates) => {
    return lastAvailableDates ? lastAvailableDates[unit] : defaultInterval()
  },
  target: changeHistoryInterval
})

// reset 
$historyIntervalUnit.on(changeHistoryIntervalUnit, setPayload);
$historyInterval.reset(router.historyUpdated);
$lastAvailableDates.reset(router.historyUpdated, $selectedLayerId);