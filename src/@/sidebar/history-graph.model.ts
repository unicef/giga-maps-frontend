import { add, Interval, sub } from 'date-fns';
import { combine, createEvent, createStore, merge, sample } from 'effector';

import { $admin1Code } from '~/@/country/country.model';
import { $activeEntityTypes, EntityType } from '~/@/entities';
import {
  defaultInterval,
  defaultIntervalMonth,
} from '~/@/sidebar/sidebar.constant';
import { $mapRoutes, router } from '~/core/routes';
import { getInterval, isCurrentInterval } from '~/lib/date-fns-kit';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

import {
  $connectivityAvailabilityByEntity,
  $currentLayerTypeUtilsByEntity,
} from './sidebar.model';
import { createHistoryIntervalFormat } from './sidebar.util';

export const changeEntityHistoryIntervalUnit = createEvent<{
  entityType: EntityType;
  unit: IntervalUnit;
}>();
export const nextEntityHistoryInterval = createEvent<EntityType>();
export const previousEntityHistoryInterval = createEvent<EntityType>();

export const changeEntityHistoryInterval = createEvent<{
  entityType: EntityType;
  interval: Interval;
}>();
export const setHistoryIntervalByEntity =
  createEvent<Partial<Record<EntityType, Interval>>>();

export const $historyIntervalByEntity = createStore<
  Partial<Record<EntityType, Interval>>
>({});
$historyIntervalByEntity.on(changeEntityHistoryInterval, (state, payload) => ({
  ...state,
  [payload.entityType]: payload.interval,
}));
$historyIntervalByEntity.on(setHistoryIntervalByEntity, (state, payload) => ({
  ...state,
  ...payload,
}));

export const $historyIntervalUnitByEntity = createStore<
  Partial<Record<EntityType, IntervalUnit>>
>({});
$historyIntervalUnitByEntity.on(
  changeEntityHistoryIntervalUnit,
  (state, payload) => ({
    ...state,
    [payload.entityType]: payload.unit,
  }),
);

export const $isCurrentHistoryIntervalByEntity = combine(
  $historyIntervalByEntity,
  $historyIntervalUnitByEntity,
  (historyIntervalByEntity, historyIntervalUnitByEntity) => {
    const entityTypes = new Set<EntityType>([
      ...(Object.keys(historyIntervalByEntity) as EntityType[]),
      ...(Object.keys(historyIntervalUnitByEntity) as EntityType[]),
    ]);
    return Array.from(entityTypes).reduce(
      (acc, entityType) => {
        acc[entityType] = isCurrentInterval(
          historyIntervalByEntity[entityType] ?? defaultInterval(),
          historyIntervalUnitByEntity[entityType] ?? IntervalUnit.week,
        );
        return acc;
      },
      {} as Partial<Record<EntityType, boolean>>,
    );
  },
);

export const $isNextHistoryIntervalAvailableByEntity =
  $isCurrentHistoryIntervalByEntity.map((isCurrentHistoryIntervalByEntity) => {
    return Object.entries(isCurrentHistoryIntervalByEntity).reduce(
      (acc, [entityType, isCurrent]) => {
        acc[entityType as EntityType] = !isCurrent;
        return acc;
      },
      {} as Partial<Record<EntityType, boolean>>,
    );
  });

type LastAvailableDates = {
  [IntervalUnit.week]: Interval;
  [IntervalUnit.month]: Interval;
};
export const $lastAvailableDatesByEntity = createStore<
  Partial<Record<EntityType, LastAvailableDates | null>>
>({});

export const $isCheckedLastDate = combine(
  [
    $lastAvailableDatesByEntity,
    $currentLayerTypeUtilsByEntity,
    $activeEntityTypes,
    $mapRoutes,
  ],
  ([
    lastAvailableDatesByEntity,
    currentLayerTypeUtilsByEntity,
    activeEntityTypes,
    mapRoutes,
  ]) => {
    if (mapRoutes.map) return true;
    return activeEntityTypes.every((entityType) => {
      const { isLive } = currentLayerTypeUtilsByEntity[entityType] ?? {};
      return !isLive || !!lastAvailableDatesByEntity[entityType];
    });
  },
);

sample({
  clock: changeEntityHistoryIntervalUnit,
  source: $historyIntervalByEntity,
  fn: (historyIntervalByEntity, { entityType, unit }) => {
    const interval = historyIntervalByEntity[entityType] ?? defaultInterval();
    return {
      entityType,
      interval: getInterval(
        unit === IntervalUnit.week ? interval.start : interval.end,
        unit,
      ),
    };
  },
  target: changeEntityHistoryInterval,
});

sample({
  clock: nextEntityHistoryInterval,
  source: combine({
    historyIntervalByEntity: $historyIntervalByEntity,
    historyIntervalUnitByEntity: $historyIntervalUnitByEntity,
  }),
  fn: (
    { historyIntervalByEntity, historyIntervalUnitByEntity },
    entityType,
  ) => {
    const unit = historyIntervalUnitByEntity[entityType] ?? IntervalUnit.week;
    const interval = historyIntervalByEntity[entityType] ?? defaultInterval();
    return {
      entityType,
      interval: getInterval(add(interval.start, { [`${unit}s`]: 1 }), unit),
    };
  },
  target: changeEntityHistoryInterval,
});

sample({
  clock: previousEntityHistoryInterval,
  source: combine({
    historyIntervalByEntity: $historyIntervalByEntity,
    historyIntervalUnitByEntity: $historyIntervalUnitByEntity,
  }),
  fn: (
    { historyIntervalByEntity, historyIntervalUnitByEntity },
    entityType,
  ) => {
    const unit = historyIntervalUnitByEntity[entityType] ?? IntervalUnit.week;
    const interval = historyIntervalByEntity[entityType] ?? defaultInterval();
    return {
      entityType,
      interval: getInterval(sub(interval.start, { [`${unit}s`]: 1 }), unit),
    };
  },
  target: changeEntityHistoryInterval,
});

sample({
  clock: merge([$connectivityAvailabilityByEntity]),
  source: combine({
    isAdmin: $admin1Code,
    connectivityDatesByEntity: $connectivityAvailabilityByEntity,
  }),
  fn: (_, availableDatesByEntity) => {
    return Object.entries(availableDatesByEntity).reduce(
      (acc, [entityType, availableDates]) => {
        acc[entityType as EntityType] = {
          [IntervalUnit.week]: availableDates
            ? (createHistoryIntervalFormat(availableDates.week) ??
              defaultInterval())
            : defaultInterval(),
          [IntervalUnit.month]: availableDates
            ? (createHistoryIntervalFormat(availableDates.month) ??
              defaultIntervalMonth())
            : defaultInterval(),
        };
        return acc;
      },
      {} as Partial<Record<EntityType, LastAvailableDates | null>>,
    );
  },
  filter: ({ isAdmin, connectivityDatesByEntity }) => {
    if (isAdmin) {
      return Object.keys(connectivityDatesByEntity).length > 0;
    }
    return true;
  },
  target: $lastAvailableDatesByEntity,
});

sample({
  clock: $lastAvailableDatesByEntity,
  source: $historyIntervalUnitByEntity,
  fn: (historyIntervalUnitByEntity, lastAvailableDatesByEntity) => {
    return Object.entries(lastAvailableDatesByEntity).reduce(
      (acc, [entityType, lastAvailableDates]) => {
        const typedEntityType = entityType as EntityType;
        const unit =
          historyIntervalUnitByEntity[typedEntityType] ?? IntervalUnit.week;
        acc[typedEntityType] = lastAvailableDates?.[unit] ?? defaultInterval();
        return acc;
      },
      {} as Partial<Record<EntityType, Interval>>,
    );
  },
  target: setHistoryIntervalByEntity,
});

// reset
$historyIntervalByEntity.reset(router.historyUpdated);
$historyIntervalUnitByEntity.reset(router.historyUpdated);
$lastAvailableDatesByEntity.reset(router.historyUpdated);
