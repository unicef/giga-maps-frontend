import {
  combine,
  createEffect,
  createEvent,
  createStore,
  merge,
  restore,
  sample,
} from 'effector';

import {
  fetchAdvanceFilterFx,
  fetchCountriesFx,
  fetchCountryFx,
  fetchLayerListFx,
} from '~/api/project-connect';
import { $lng, onLanguageChange } from '~/core/i18n/store';

import { $admin1Code, $country } from '../country/country.model';
import {
  $activeEntityTypes,
  $entityRegistry,
  $isGlobalMode,
  changeActiveEntityTypes,
  changeSelectedEntityType,
  setGlobalMode,
} from '../entities/models/entity.model';
import type { EntityType } from '../entities/types/base-entity.type';
import {
  ConnectivityDistribution,
  ConnectivityStatusDistribution,
} from './sidebar.constant';
import {
  $connectivitySpeedFilterByEntity,
  $coverageStatusAllByEntity,
  $selectedLayerIdByEntity,
  $selectedSchoolIds,
  $staticLegendsSelectedByEntity,
  $statusLayerIdByEntity,
  changeEntityConnectivitySpeed,
  changeEntityCoverageStatus,
  entityStaticLegendsSelection,
  onSelectEntityMainLayer,
  onSelectEntityStatusLayer,
} from './sidebar.model';
import {
  getUrlParams,
  parseBoolParam,
  URL_PARAM_KEYS,
} from './url-params.util';

export const setAppSettled = createEvent<boolean>();
export const $isAppSettled = restore(setAppSettled, false);

const $isCountrySettled = createStore(false);
const $isCountriesSettled = createStore(false);
const $isLayersSettled = createStore(false);
const $isFilterSettled = createStore(false);

$isCountrySettled.on(fetchCountryFx.doneData, () => true);
$isCountriesSettled.on(fetchCountriesFx.doneData, () => true);
$isLayersSettled.on(fetchLayerListFx.doneData, () => true);
$isFilterSettled.on(fetchAdvanceFilterFx.doneData, () => true);

sample({
  source: combine(
    $isCountrySettled,
    $isCountriesSettled,
    $isLayersSettled,
    $isFilterSettled,
    (...all) => all.every(Boolean),
  ),
  filter: (isAllDone: boolean) => isAllDone,
  target: setAppSettled,
});

// Track if URL params have been consumed on initial load
export const $urlParamsConsumed = createStore(false);
export const markUrlParamsConsumed = createEvent();
$urlParamsConsumed.on(markUrlParamsConsumed, () => true);

type EntityStoreMap<T> = Partial<Record<EntityType, T>>;
type NullableLayerIdByEntity = EntityStoreMap<number | null>;
type NullableStatusLayerByEntity = EntityStoreMap<string | null>;
type DistributionKey =
  | ConnectivityDistribution.good
  | ConnectivityDistribution.moderate
  | ConnectivityDistribution.bad
  | ConnectivityDistribution.unknown;

type DistributionFilter = Record<DistributionKey, boolean>;

const hasOwn = <T extends object>(source: T, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(source, key);

const defaultDistributionFilter: DistributionFilter = {
  [ConnectivityDistribution.good]: true,
  [ConnectivityDistribution.moderate]: true,
  [ConnectivityDistribution.bad]: true,
  [ConnectivityDistribution.unknown]: true,
};

const defaultEntityStatusLegends = [
  ConnectivityStatusDistribution.connected,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.unknown,
];

const distributionParamKeys: Record<DistributionKey, string> = {
  [ConnectivityDistribution.good]: URL_PARAM_KEYS.SPEED_GOOD,
  [ConnectivityDistribution.moderate]: URL_PARAM_KEYS.SPEED_MODERATE,
  [ConnectivityDistribution.bad]: URL_PARAM_KEYS.SPEED_NO_INTERNET,
  [ConnectivityDistribution.unknown]: URL_PARAM_KEYS.SPEED_UNKNOWN,
};

const coverageParamKeys: Record<DistributionKey, string> = {
  [ConnectivityDistribution.good]: URL_PARAM_KEYS.COVERAGE_5G4G,
  [ConnectivityDistribution.moderate]: URL_PARAM_KEYS.COVERAGE_3G2G,
  [ConnectivityDistribution.bad]: URL_PARAM_KEYS.COVERAGE_NO,
  [ConnectivityDistribution.unknown]: URL_PARAM_KEYS.COVERAGE_UNKNOWN,
};

const entityStatusLegendParamKeys = {
  [ConnectivityStatusDistribution.connected]:
    URL_PARAM_KEYS.ENTITY_STATUS_CONNECTED,
  [ConnectivityStatusDistribution.notConnected]:
    URL_PARAM_KEYS.ENTITY_STATUS_NOT_CONNECTED,
  [ConnectivityStatusDistribution.unknown]:
    URL_PARAM_KEYS.ENTITY_STATUS_UNKNOWN,
};

const legacyStatusLegendParamKeys = {
  [ConnectivityStatusDistribution.connected]: URL_PARAM_KEYS.SS_CONNECTED,
  [ConnectivityStatusDistribution.notConnected]:
    URL_PARAM_KEYS.SS_NOT_CONNECTED,
  [ConnectivityStatusDistribution.unknown]: URL_PARAM_KEYS.SS_UNKNOWN,
};

// Check if current route is mapOverview (global map without country)
const isMapOverviewRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return path === '/map' || path === '/map/';
};

const getRegistryEntityTypes = () => {
  const registry = $entityRegistry.getState();
  return Object.entries(registry)
    .filter(([, config]) => config.visible)
    .map(([entityType]) => entityType as EntityType);
};

const parseCsvParam = (value: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseEntityTypesParam = (value: string | null) => {
  const knownEntityTypes = getRegistryEntityTypes();
  const entityTypes = parseCsvParam(value).map((item) => item.toLowerCase());
  if (entityTypes.includes('all')) return knownEntityTypes;

  return entityTypes.filter((entityType): entityType is EntityType =>
    knownEntityTypes.includes(entityType as EntityType),
  );
};

const getTargetEntityTypes = (entityTypes: EntityType[]) =>
  entityTypes.length ? entityTypes : getRegistryEntityTypes();

const parseNullableLayerIds = (value: string | null) =>
  parseCsvParam(value).map((item) => {
    if (item === 'null') return null;
    const layerId = Number(item);
    return Number.isFinite(layerId) ? layerId : null;
  });

const parseNullableStatusLayerIds = (value: string | null) =>
  parseCsvParam(value).map((item) => (item === 'null' ? null : item));

const getEntityFromStatusLayerId = (
  statusLayerId: string,
  entityTypes: EntityType[],
) =>
  entityTypes.find((entityType) => statusLayerId.startsWith(`${entityType}_`));

const createLayerIdByEntity = (
  layerIds: Array<number | null>,
  entityTypes: EntityType[],
  hasEntityParam: boolean,
): NullableLayerIdByEntity => {
  if (!layerIds.length) return {};
  if (layerIds.every((layerId) => layerId === null)) {
    return entityTypes.reduce<NullableLayerIdByEntity>((acc, entityType) => {
      acc[entityType] = null;
      return acc;
    }, {});
  }
  if (!hasEntityParam) return {};

  return entityTypes.reduce<NullableLayerIdByEntity>(
    (acc, entityType, index) => {
      if (index < layerIds.length) {
        acc[entityType] = layerIds[index];
      }
      return acc;
    },
    {},
  );
};

const createStatusLayerIdByEntity = (
  statusLayerIds: Array<string | null>,
  entityTypes: EntityType[],
  hasEntityParam: boolean,
): NullableStatusLayerByEntity => {
  if (!statusLayerIds.length) return {};
  if (statusLayerIds.every((statusLayerId) => statusLayerId === null)) {
    return entityTypes.reduce<NullableStatusLayerByEntity>(
      (acc, entityType) => {
        acc[entityType] = null;
        return acc;
      },
      {},
    );
  }

  return statusLayerIds.reduce<NullableStatusLayerByEntity>(
    (acc, statusLayerId, index) => {
      if (statusLayerId === null) {
        if (hasEntityParam && entityTypes[index]) {
          acc[entityTypes[index]] = null;
        }
        return acc;
      }

      const entityType =
        getEntityFromStatusLayerId(statusLayerId, entityTypes) ??
        (hasEntityParam ? entityTypes[index] : undefined);
      if (entityType) {
        acc[entityType] = statusLayerId;
      }
      return acc;
    },
    {},
  );
};

const parseDisabledEntities = (
  params: URLSearchParams,
  key: string,
  targetEntityTypes: EntityType[],
  legacyKey?: string,
) => {
  const rawValue =
    params.get(key) ?? (legacyKey ? params.get(legacyKey) : null);
  if (rawValue === null || rawValue === '1' || rawValue === 'true') {
    return new Set<EntityType>();
  }
  if (rawValue === '0' || rawValue === 'false') {
    return new Set(targetEntityTypes);
  }

  return new Set(
    parseCsvParam(rawValue).filter((entityType): entityType is EntityType =>
      targetEntityTypes.includes(entityType as EntityType),
    ),
  );
};

const createDistributionFilterByEntity = (
  params: URLSearchParams,
  targetEntityTypes: EntityType[],
  paramKeys: Record<DistributionKey, string>,
): EntityStoreMap<DistributionFilter> => {
  const disabledEntitiesByKey = Object.entries(paramKeys).reduce(
    (acc, [key, paramKey]) => {
      acc[key as DistributionKey] = parseDisabledEntities(
        params,
        paramKey,
        targetEntityTypes,
      );
      return acc;
    },
    {} as Record<DistributionKey, Set<EntityType>>,
  );

  return targetEntityTypes.reduce<EntityStoreMap<DistributionFilter>>(
    (acc, entityType) => {
      acc[entityType] = (
        Object.keys(defaultDistributionFilter) as DistributionKey[]
      ).reduce(
        (filter, key) => {
          filter[key] = !disabledEntitiesByKey[key].has(entityType);
          return filter;
        },
        { ...defaultDistributionFilter },
      );
      return acc;
    },
    {},
  );
};

const createEntityStatusLegendsByEntity = (
  params: URLSearchParams,
  targetEntityTypes: EntityType[],
) => {
  const disabledEntitiesByStatus = defaultEntityStatusLegends.reduce(
    (acc, status) => {
      acc[status] = parseDisabledEntities(
        params,
        entityStatusLegendParamKeys[status],
        targetEntityTypes,
        legacyStatusLegendParamKeys[status],
      );
      return acc;
    },
    {} as Record<ConnectivityStatusDistribution, Set<EntityType>>,
  );

  return targetEntityTypes.reduce<EntityStoreMap<string[]>>(
    (acc, entityType) => {
      acc[entityType] = defaultEntityStatusLegends.filter(
        (status) => !disabledEntitiesByStatus[status].has(entityType),
      );
      return acc;
    },
    {},
  );
};

const hasAnyOwnValue = <T>(
  values: Partial<Record<EntityType, T>>,
  entityTypes: EntityType[],
) => entityTypes.some((entityType) => hasOwn(values, entityType));

const setNullableEntityListParam = <T extends number | string | null>(
  searchParams: URLSearchParams,
  key: string,
  values: Partial<Record<EntityType, T>>,
  entityTypes: EntityType[],
) => {
  if (!hasAnyOwnValue(values, entityTypes)) {
    searchParams.delete(key);
    return;
  }

  searchParams.set(
    key,
    entityTypes
      .map((entityType) => {
        const value = hasOwn(values, entityType) ? values[entityType] : null;
        return value === null || value === undefined ? 'null' : String(value);
      })
      .join(','),
  );
};

const setDisabledEntitiesParam = (
  searchParams: URLSearchParams,
  key: string,
  values: EntityStoreMap<DistributionFilter>,
  entityTypes: EntityType[],
  distributionKey: DistributionKey,
) => {
  const disabledEntityTypes = entityTypes.filter(
    (entityType) => values[entityType]?.[distributionKey] === false,
  );
  if (disabledEntityTypes.length) {
    searchParams.set(key, disabledEntityTypes.join(','));
  } else {
    searchParams.delete(key);
  }
};

const setDisabledLegendEntitiesParam = (
  searchParams: URLSearchParams,
  key: string,
  legacyKey: string,
  values: EntityStoreMap<string[]>,
  entityTypes: EntityType[],
  status: ConnectivityStatusDistribution,
) => {
  const disabledEntityTypes = entityTypes.filter((entityType) => {
    const selectedLegends = values[entityType] ?? defaultEntityStatusLegends;
    return !selectedLegends.includes(status);
  });

  searchParams.delete(legacyKey);
  if (disabledEntityTypes.length) {
    searchParams.set(key, disabledEntityTypes.join(','));
  } else {
    searchParams.delete(key);
  }
};

// Read initial URL params
export const getInitialUrlParams = () => {
  const params = getUrlParams();
  const entityTypes = parseEntityTypesParam(params.get(URL_PARAM_KEYS.ENTITY));
  const targetEntityTypes = getTargetEntityTypes(entityTypes);
  const hasEntityParam = params.has(URL_PARAM_KEYS.ENTITY);
  const layerIds = parseNullableLayerIds(params.get(URL_PARAM_KEYS.LAYER_ID));
  const statusLayerIds = parseNullableStatusLayerIds(
    params.get(URL_PARAM_KEYS.ENTITY_STATUS_LAYER) ??
      params.get(URL_PARAM_KEYS.SCHOOL_STATUS_LAYER),
  );

  const isGlobal = parseBoolParam(
    params.get(URL_PARAM_KEYS.GLOBAL),
    entityTypes.length === 0,
  );

  // On /map overview route, ignore layer/filter params but keep entity selection.
  if (isMapOverviewRoute()) {
    return {
      layerId: null,
      layerIds: [] as Array<number | null>,
      layerIdByEntity: {} as NullableLayerIdByEntity,
      isLayerIdNull: false,
      entityStatusLayer: null,
      entityStatusLayerIds: [] as Array<string | null>,
      entityStatusLayerByEntity: {} as NullableStatusLayerByEntity,
      isEntityStatusLayerNull: false,
      schoolStatusLayer: null,
      isSchoolStatusLayerNull: false,
      entityTypes,
      isGlobal,
      connectivitySpeedFilterByEntity: {} as EntityStoreMap<DistributionFilter>,
      coverageFilterByEntity: {} as EntityStoreMap<DistributionFilter>,
      entityStatusLegendsByEntity: {} as EntityStoreMap<string[]>,
      schoolStatusLegends: defaultEntityStatusLegends,
      language: params.get(URL_PARAM_KEYS.LANGUAGE), // Keep language
    };
  }
  const entityStatusLegendsByEntity = createEntityStatusLegendsByEntity(
    params,
    targetEntityTypes,
  );
  const selectedEntityType = targetEntityTypes[0];

  return {
    layerId: layerIds[0] ?? null,
    layerIds,
    layerIdByEntity: createLayerIdByEntity(
      layerIds,
      targetEntityTypes,
      hasEntityParam,
    ),
    isLayerIdNull: params.get(URL_PARAM_KEYS.LAYER_ID) === 'null',
    entityStatusLayer: statusLayerIds[0] ?? null,
    entityStatusLayerIds: statusLayerIds,
    entityStatusLayerByEntity: createStatusLayerIdByEntity(
      statusLayerIds,
      targetEntityTypes,
      hasEntityParam,
    ),
    isEntityStatusLayerNull:
      (params.get(URL_PARAM_KEYS.ENTITY_STATUS_LAYER) ??
        params.get(URL_PARAM_KEYS.SCHOOL_STATUS_LAYER)) === 'null',
    // Legacy aliases kept for slices that still read the old names during migration.
    schoolStatusLayer: statusLayerIds[0] ?? null,
    isSchoolStatusLayerNull:
      (params.get(URL_PARAM_KEYS.ENTITY_STATUS_LAYER) ??
        params.get(URL_PARAM_KEYS.SCHOOL_STATUS_LAYER)) === 'null',
    entityTypes,
    isGlobal,
    connectivitySpeedFilterByEntity: createDistributionFilterByEntity(
      params,
      targetEntityTypes,
      distributionParamKeys,
    ),
    coverageFilterByEntity: createDistributionFilterByEntity(
      params,
      targetEntityTypes,
      coverageParamKeys,
    ),
    entityStatusLegendsByEntity,
    schoolStatusLegends:
      entityStatusLegendsByEntity[selectedEntityType] ??
      defaultEntityStatusLegends,
    language: params.get(URL_PARAM_KEYS.LANGUAGE),
  };
};

// Store for initial URL params (captured once on load)
export const $initialUrlParams = createStore(getInitialUrlParams());

// Combined store for all URL-tracked values
export const $urlTrackedParams = combine({
  layerIdByEntity: $selectedLayerIdByEntity,
  entityStatusLayerByEntity: $statusLayerIdByEntity,
  entityTypes: $activeEntityTypes,
  isGlobal: $isGlobalMode,
  connectivitySpeedFilterByEntity: $connectivitySpeedFilterByEntity,
  coverageFilterByEntity: $coverageStatusAllByEntity,
  entityStatusLegendsByEntity: $staticLegendsSelectedByEntity,
  language: $lng,
});

// Effect to update URL params
const updateUrlParamsFx = createEffect(
  (params: ReturnType<typeof $urlTrackedParams.getState>) => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    // On /map overview route, only keep language and entity params
    if (isMapOverviewRoute()) {
      // Clear all params except language and entity
      const keysToDelete = Array.from(searchParams.keys()).filter(
        (key) =>
          key !== URL_PARAM_KEYS.LANGUAGE && key !== URL_PARAM_KEYS.ENTITY,
      );
      keysToDelete.forEach((key) => searchParams.delete(key));

      // Update entity and global params
      if (params.isGlobal) {
        searchParams.delete(URL_PARAM_KEYS.ENTITY);
        searchParams.delete(URL_PARAM_KEYS.GLOBAL);
      } else {
        searchParams.set(URL_PARAM_KEYS.ENTITY, params.entityTypes.join(','));
        searchParams.set(URL_PARAM_KEYS.GLOBAL, '0');
      }

      // Update language if needed
      if (params.language && params.language !== 'en') {
        searchParams.set(URL_PARAM_KEYS.LANGUAGE, params.language);
      } else {
        searchParams.delete(URL_PARAM_KEYS.LANGUAGE);
      }

      const newUrl = `${url.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}${url.hash}`;
      window.history.replaceState(window.history.state, '', newUrl);
      return;
    }

    const entityTypes = params.entityTypes.length
      ? params.entityTypes
      : getRegistryEntityTypes();

    // For other routes, update all params from entity-keyed state.
    setNullableEntityListParam(
      searchParams,
      URL_PARAM_KEYS.LAYER_ID,
      params.layerIdByEntity,
      entityTypes,
    );
    setNullableEntityListParam(
      searchParams,
      URL_PARAM_KEYS.ENTITY_STATUS_LAYER,
      params.entityStatusLayerByEntity,
      entityTypes,
    );
    searchParams.delete(URL_PARAM_KEYS.SCHOOL_STATUS_LAYER);

    (Object.keys(distributionParamKeys) as DistributionKey[]).forEach((key) => {
      setDisabledEntitiesParam(
        searchParams,
        distributionParamKeys[key],
        params.connectivitySpeedFilterByEntity,
        entityTypes,
        key,
      );
    });

    (Object.keys(coverageParamKeys) as DistributionKey[]).forEach((key) => {
      setDisabledEntitiesParam(
        searchParams,
        coverageParamKeys[key],
        params.coverageFilterByEntity,
        entityTypes,
        key,
      );
    });

    defaultEntityStatusLegends.forEach((status) => {
      setDisabledLegendEntitiesParam(
        searchParams,
        entityStatusLegendParamKeys[status],
        legacyStatusLegendParamKeys[status],
        params.entityStatusLegendsByEntity,
        entityTypes,
        status,
      );
    });

    // Update entity and global params
    if (params.isGlobal) {
      searchParams.delete(URL_PARAM_KEYS.ENTITY);
      searchParams.delete(URL_PARAM_KEYS.GLOBAL);
    } else {
      searchParams.set(URL_PARAM_KEYS.ENTITY, entityTypes.join(','));
      searchParams.set(URL_PARAM_KEYS.GLOBAL, '0');
    }

    // Update language param (only set if not default)
    if (params.language && params.language !== 'en') {
      searchParams.set(URL_PARAM_KEYS.LANGUAGE, params.language);
    } else {
      searchParams.delete(URL_PARAM_KEYS.LANGUAGE);
    }

    // Update URL without page reload using replaceState
    const newUrl = `${url.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}${url.hash}`;
    window.history.replaceState(window.history.state, '', newUrl);
  },
);

// Event to initialize stores from URL params
export const initializeFromUrlParams = createEvent();

// Effect to apply URL params to stores
const applyUrlParamsToStoresFx = createEffect(() => {
  const params = getInitialUrlParams();
  const targetEntityTypes = getTargetEntityTypes(params.entityTypes);

  // Apply entity types and selected entity from URL before entity-keyed filters.
  if (params.entityTypes.length > 0) {
    changeActiveEntityTypes(params.entityTypes);
  }
  if (targetEntityTypes[0]) {
    changeSelectedEntityType(targetEntityTypes[0]);
  }

  // Apply global mode after active entities because changeActiveEntityTypes marks it false.
  setGlobalMode(params.isGlobal);

  if (hasAnyOwnValue(params.layerIdByEntity, targetEntityTypes)) {
    onSelectEntityMainLayer(params.layerIdByEntity);
  }
  if (hasAnyOwnValue(params.entityStatusLayerByEntity, targetEntityTypes)) {
    onSelectEntityStatusLayer(params.entityStatusLayerByEntity);
  }

  targetEntityTypes.forEach((entityType) => {
    const speedFilter =
      params.connectivitySpeedFilterByEntity[entityType] ??
      defaultDistributionFilter;
    const coverageFilter =
      params.coverageFilterByEntity[entityType] ?? defaultDistributionFilter;

    (Object.keys(defaultDistributionFilter) as DistributionKey[]).forEach(
      (key) => {
        changeEntityConnectivitySpeed({
          entityType,
          key,
          value: speedFilter[key],
        });
        changeEntityCoverageStatus({
          entityType,
          key,
          value: coverageFilter[key],
        });
      },
    );

    entityStaticLegendsSelection({
      entityType,
      legends:
        params.entityStatusLegendsByEntity[entityType] ??
        defaultEntityStatusLegends,
    });
  });

  // Apply language param (i18next handles this via URL detection)
  if (params.language) {
    void onLanguageChange(params.language);
  }

  return params;
});

// Initialize from URL params on app start
sample({
  clock: initializeFromUrlParams,
  target: applyUrlParamsToStoresFx,
});

// Mark params as consumed after initialization
sample({
  clock: applyUrlParamsToStoresFx.done,
  target: markUrlParamsConsumed,
});

// Update URL when any tracked param changes (after initial load)
sample({
  clock: merge([
    $country,
    $admin1Code,
    $selectedSchoolIds,
    $selectedLayerIdByEntity,
    $statusLayerIdByEntity,
    $activeEntityTypes,
    $isGlobalMode,
    $connectivitySpeedFilterByEntity,
    $coverageStatusAllByEntity,
    $staticLegendsSelectedByEntity,
    $lng,
  ]),
  source: combine({
    params: $urlTrackedParams,
    consumed: $urlParamsConsumed,
  }),
  filter: ({ consumed }) => consumed,
  fn: ({ params }) => params,
  target: updateUrlParamsFx,
});

// Entity URL param handling - read from URL on initial load
export const $entityParamFromUrl = $initialUrlParams.map(
  (params) => params.entityTypes ?? [],
);

// Event to set active entity types from URL (avoiding circular updates)
export const setActiveEntityTypesFromUrl = createEvent<EntityType[]>();

// Apply entity types from URL to store on initialization
sample({
  clock: setActiveEntityTypesFromUrl,
  target: changeActiveEntityTypes,
});
