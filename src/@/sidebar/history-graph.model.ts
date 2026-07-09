import { add, Interval, sub } from 'date-fns';
import { combine, createEvent, createStore, merge, sample } from 'effector';

import { $admin1Code } from '~/@/country/country.model';
import { EntityType } from '~/@/entities';
import { $selectedEntityType } from '~/@/entities/models/entity.model';
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

export const changeHistoryIntervalUnit = createEvent<IntervalUnit>();
export const changeEntityHistoryIntervalUnit = createEvent<{
  entityType: EntityType;
  unit: IntervalUnit;
}>();
export const nextHistoryInterval = createEvent();
export const nextEntityHistoryInterval = createEvent<EntityType>();
export const previousHistoryInterval = createEvent();
export const previousEntityHistoryInterval = createEvent<EntityType>();

export const changeHistoryInterval = createEvent<Interval>();
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

export const $historyInterval = combine(
  $historyIntervalByEntity,
  $selectedEntityType,
  (historyIntervalByEntity, selectedEntityType) =>
    historyIntervalByEntity[selectedEntityType] ?? defaultInterval(),
);

export const $historyIntervalUnit = combine(
  $historyIntervalUnitByEntity,
  $selectedEntityType,
  (historyIntervalUnitByEntity, selectedEntityType) =>
    historyIntervalUnitByEntity[selectedEntityType] ?? IntervalUnit.week,
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

export const $isCurrentHistoryInterval = combine(
  $isCurrentHistoryIntervalByEntity,
  $selectedEntityType,
  (isCurrentHistoryIntervalByEntity, selectedEntityType) =>
    isCurrentHistoryIntervalByEntity[selectedEntityType] ?? false,
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

export const $isNextHistoryIntervalAvailable = combine(
  $isNextHistoryIntervalAvailableByEntity,
  $selectedEntityType,
  (isNextHistoryIntervalAvailableByEntity, selectedEntityType) =>
    isNextHistoryIntervalAvailableByEntity[selectedEntityType] ?? true,
);
export const $isPreviousHistoryIntervalAvailable = createStore(false);
export const $lastAvailableDates = createStore<null | {
  [IntervalUnit.week]: Interval;
  [IntervalUnit.month]: Interval;
}>(null);
type LastAvailableDates = NonNullable<
  ReturnType<typeof $lastAvailableDates.getState>
>;
export const $lastAvailableDatesByEntity = createStore<
  Partial<Record<EntityType, LastAvailableDates | null>>
>({});

export const $isCheckedLastDate = combine(
  [$lastAvailableDates, $currentLayerTypeUtilsByEntity, $selectedEntityType, $mapRoutes],
  ([lastAvailableDates, currentLayerTypeUtilsByEntity, selectedEntityType, mapRoutes]) => {
    const { isLive } = currentLayerTypeUtilsByEntity[selectedEntityType] ?? {};
    if (mapRoutes.map) return true;
    if (isLive) {
      return !!lastAvailableDates;
    }
    return true;
  },
);
sample({
  clock: changeHistoryInterval,
  source: $selectedEntityType,
  fn: (entityType, interval) => ({ entityType, interval }),
  target: changeEntityHistoryInterval,
});

sample({
  clock: changeHistoryIntervalUnit,
  source: $selectedEntityType,
  fn: (entityType, unit) => ({ entityType, unit }),
  target: changeEntityHistoryIntervalUnit,
});

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
  clock: nextHistoryInterval,
  source: $selectedEntityType,
  target: nextEntityHistoryInterval,
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
  clock: previousHistoryInterval,
  source: $selectedEntityType,
  target: previousEntityHistoryInterval,
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

sample({
  clock: merge([$lastAvailableDatesByEntity, $selectedEntityType]),
  source: combine({
    lastAvailableDatesByEntity: $lastAvailableDatesByEntity,
    selectedEntityType: $selectedEntityType,
  }),
  fn: ({ lastAvailableDatesByEntity, selectedEntityType }) =>
    lastAvailableDatesByEntity[selectedEntityType] ?? null,
  target: $lastAvailableDates,
});
// reset
$historyIntervalByEntity.reset(router.historyUpdated);
$historyIntervalUnitByEntity.reset(router.historyUpdated);
$lastAvailableDates.reset(router.historyUpdated);
$lastAvailableDatesByEntity.reset(router.historyUpdated);
