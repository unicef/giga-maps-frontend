import { Map, VectorSource } from 'mapbox-gl';

import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import { EntityType } from '~/@/entities/types/base-entity.type';

import {
  CONNECTIVITY_STATUS_SOURCE,
  DEFAULT_SOURCE,
  getEntitySelectedLayerId,
  getEntityStatusLayerId,
  getSourceLayerName,
} from '../map.constant';

export const DEFAULT_ENTITY_DISTRIBUTION_FILTER = {
  good: true,
  moderate: true,
  bad: true,
  unknown: true,
};
import { ChangeLayerOptions } from '../map.types';
import {
  animateCircles,
  checkSourceAvailable,
  createEntitySymbolLayer,
  createSchoolLayer,
  createSelectedLayer,
  createSelectedSymbolLayer,
  createSource,
  deleteSourceAndLayers,
  filterConnectivityList,
  filterCoverageList,
  filterSchoolStatus,
  generateLayerUrls,
  generateStaticLayerUrl,
  hideLayer,
} from '../utils';

/** Per-entity animation handlers (supports simultaneous animations for multiple entity types) */
let animateCircleHandlers: Record<string, { requestId: number }> = {};

const ignoreCountriesForBounds = ['fj'];

export const getEntityGlobalLayerId = (
  layerUtils: ChangeLayerOptions['layerUtils'],
  entityType: EntityType,
) => layerUtils.globalLayerDataByEntity?.[entityType]?.id ?? null;

export const getFirstGlobalLayerId = (
  layerUtils: ChangeLayerOptions['layerUtils'],
  entityTypes: EntityType[],
) =>
  entityTypes
    .map((entityType) => getEntityGlobalLayerId(layerUtils, entityType))
    .find((id): id is number => Boolean(id)) ?? null;

const moveEntityStatusLayersToTop = (map: Map, entityTypes: EntityType[]) => {
  if (
    typeof map.getLayer !== 'function' ||
    typeof map.moveLayer !== 'function'
  ) {
    return;
  }

  entityTypes.forEach((entityType) => {
    const statusLayerId = getEntityStatusLayerId(entityType);
    if (map.getLayer(statusLayerId)) {
      map.moveLayer(statusLayerId);
    }
  });
};

export function cancelAnimation() {
  Object.values(animateCircleHandlers).forEach((handler) => {
    cancelAnimationFrame(handler.requestId);
  });
  animateCircleHandlers = {};
}

export const getLayerIdsAndLastChange = ({
  selectedLayerIds,
  refresh,
  lastSelectedLayer,
}: Pick<
  ChangeLayerOptions,
  'selectedLayerIds' | 'refresh' | 'lastSelectedLayer'
>) => {
  const selectedLayerIdByEntity: Partial<Record<EntityType, number | null>> =
    selectedLayerIds?.selectedIdByEntity ?? {};
  const lastLayerIdByEntity: Partial<Record<EntityType, number | null>> =
    lastSelectedLayer?.layerIdByEntity ?? {};
  const entityTypes = new Set([
    ...Object.keys(selectedLayerIdByEntity),
    ...Object.keys(lastLayerIdByEntity),
  ]);
  const checkSelectionChange = entityTypes.size
    ? Array.from(entityTypes).some((entityType) => {
        const typedEntityType = entityType as EntityType;
        return (
          selectedLayerIdByEntity[typedEntityType] !==
          lastLayerIdByEntity[typedEntityType]
        );
      })
    : false;
  const isLastSelectionChange = refresh || checkSelectionChange;
  return {
    selectedLayerIdByEntity,
    isLastSelectionChange,
  };
};

export const createSourceForMapAndCountry = ({
  map,
  entityPageSelection,
  schoolAdminId,
  countrySearch,
  connectivityBenchMarkByEntity,
  selectedLayerId: layerId,
  intervalByEntity,
  intervalUnitByEntity,
  layerUtils,
  mapRoute,
  country,
  admin1Data,
  activeEntityTypes,
  entityRegistry,
  isConnectivityStatus,
}: ChangeLayerOptions & {
  selectedLayerId: number | null;
  isConnectivityStatus?: boolean;
}) => {
  if (!map) return;
  const sourceId = isConnectivityStatus
    ? CONNECTIVITY_STATUS_SOURCE
    : DEFAULT_SOURCE;
  if (!isConnectivityStatus) {
    // cancel all entity animations;
    cancelAnimation();
  }
  // delete existing source;
  deleteSourceAndLayers({ map, sourceId });
  // create new source
  const fallbackLayerId = mapRoute.map
    ? getFirstGlobalLayerId(layerUtils, activeEntityTypes ?? [])
    : layerId;
  if (!layerId) {
    layerId = fallbackLayerId;
  }
  const isEntityDetailRoute = mapRoute.schools || mapRoute.entity;
  let admin1Id = isEntityDetailRoute ? schoolAdminId : admin1Data?.id;
  if (isEntityDetailRoute) {
    if (admin1Id) {
      admin1Data =
        country?.admin1_metadata?.find((admin) => admin.id === admin1Id) ??
        null;
    } else {
      admin1Id = undefined;
      admin1Data = null;
    }
  }
  let url = null;
  if (!isConnectivityStatus) {
    url = generateLayerUrls({
      layerId: fallbackLayerId,
      activeEntityTypes,
      connectivityBenchMarkByEntity,
      entityPageSelection,
      layerUtils,
      intervalByEntity,
      intervalUnitByEntity,
      mapRoute,
      country,
      admin1Id,
      countrySearch,
      entityRegistry,
    });
  } else {
    url = generateStaticLayerUrl({
      activeEntityTypes,
      entityRegistry,
      mapRoute,
      country,
      entityPageSelection,
      admin1Id,
      countrySearch,
    });
  }
  if (!url) return false;
  const options = {} as VectorSource;
  if (country) {
    const removeBounds = ignoreCountriesForBounds.includes(
      country.code.toLocaleLowerCase(),
    );
    if (admin1Data) {
      options.bounds = admin1Data.bbox as VectorSource['bounds'];
    } else {
      options.bounds = country.admin_metadata.bbox as VectorSource['bounds'];
    }
    options.maxzoom = 18;
    if (removeBounds) {
      delete options.bounds;
      options.maxzoom = 4;
    }
  }
  createSource({ map, url, source: sourceId }, options);
  return true;
};

export const createAndUpdateMapLayer = ({
  map,
  mapRoute,
  connectivitySpeedFilterByEntity,
  coverageFilterByEntity,
  layerUtils,
  selectedLayerIds,
  paintData,
  lastSelectedLayer,
  isMobile,
  activeEntityTypes,
  entityRegistry,
}: ChangeLayerOptions & {
  selectedLayerId: number | null;
}) => {
  if (!map) return;
  const getIsEntityLive = (entityType: EntityType) =>
    mapRoute.map ||
    !!layerUtils.currentLayerTypeUtilsByEntity?.[entityType]?.isLive;
  const isSourceAvailable = checkSourceAvailable(map, DEFAULT_SOURCE);

  // Cancel all previous entity animations
  cancelAnimation();

  const entityTypes = activeEntityTypes ?? [];

  const hasSelectedEntityLayer = mapRoute.map
    ? entityTypes.length > 0
    : entityTypes.some((entityType) =>
        Boolean(layerUtils.selectedLayerIdByEntity?.[entityType]),
      );

  // --- Selected layer (connectivity/coverage) per entity type ---
  if (isSourceAvailable && hasSelectedEntityLayer) {
    for (const entityType of entityTypes) {
      const entityLayerId = mapRoute.map
        ? getEntityGlobalLayerId(layerUtils, entityType)
        : layerUtils.selectedLayerIdByEntity?.[entityType];
      if (!entityLayerId) continue;
      const isDynamicLayer = !mapRoute.map;
      const sourceLayer = getSourceLayerName(entityType);
      const layerIdStr = getEntitySelectedLayerId(entityType, entityLayerId);
      const entityConnectivityFilter =
        connectivitySpeedFilterByEntity?.[entityType] ??
        DEFAULT_ENTITY_DISTRIBUTION_FILTER;
      const entityCoverageFilter =
        coverageFilterByEntity?.[entityType] ??
        DEFAULT_ENTITY_DISTRIBUTION_FILTER;
      const options: Record<string, unknown> = {
        filter: getIsEntityLive(entityType)
          ? filterConnectivityList(entityConnectivityFilter, isDynamicLayer)
          : filterCoverageList(entityCoverageFilter, isDynamicLayer),
        'source-layer': sourceLayer,
      };

      const config = entityRegistry?.[entityType] as EntityConfig | undefined;
      const markerType = config?.markerType ?? 'circle';

      if (getIsEntityLive(entityType)) {
        animateCircleHandlers[entityType] = animateCircles({
          map,
          id: layerIdStr,
          entityConfig: config,
          fallbackMarkerType: markerType,
        });
      }

      if (markerType === 'circle') {
        createSelectedLayer(map, {
          id: layerIdStr,
          isMobile,
          isLive: getIsEntityLive(entityType),
          isDynamicLayer,
          paintData,
          mapRoute,
          options,
          entityConfig: config,
        });
      } else {
        createSelectedSymbolLayer(map, {
          id: layerIdStr,
          symbol: config?.symbol ?? '\u25A0',
          isMobile,
          isLive: getIsEntityLive(entityType),
          isDynamicLayer,
          paintData,
          mapRoute,
          options,
          entityConfig: config,
        });
      }
    }
  } else {
    // hide previous selected layers for all entity types
    for (const entityType of entityTypes) {
      hideLayer(
        map,
        getEntitySelectedLayerId(
          entityType,
          lastSelectedLayer.layerIdByEntity?.[entityType] ?? null,
        ),
      );
    }
  }

  moveEntityStatusLayersToTop(map, entityTypes);
  if (!mapRoute.map) return;

  // --- Status layer (connectivity_status dots) per entity type in global view ---
  if (isSourceAvailable) {
    for (const entityType of entityTypes) {
      const isStatusSelected = selectedLayerIds?.schoolIdByEntity?.[entityType];
      if (!isStatusSelected) {
        hideLayer(map, getEntityStatusLayerId(entityType));
        continue;
      }
      const sourceLayer = getSourceLayerName(entityType);
      const statusLayerId = getEntityStatusLayerId(entityType);
      const config = entityRegistry?.[entityType] as EntityConfig | undefined;
      const markerType = config?.markerType ?? 'circle';

      if (markerType === 'circle') {
        // Circle marker (school / legacy) — fast circle layer
        createSchoolLayer(map, {
          id: statusLayerId,
          paintData,
          isMobile,
          options: {
            'source-layer': sourceLayer,
          },
          mapRoute,
          entityConfig: config,
        });
      } else {
        // Symbol marker (health, etc.) — text-based symbol layer
        const symbol = config?.symbol ?? '■';
        createEntitySymbolLayer(map, {
          id: statusLayerId,
          symbol,
          paintData,
          isMobile,
          options: {
            'source-layer': sourceLayer,
          },
          mapRoute,
          entityConfig: config,
        });
      }
    }
    moveEntityStatusLayersToTop(map, entityTypes);
  }
};

export const createAndUpdateConnectiivtyStatusLayer = ({
  map,
  mapRoute,
  paintData,
  selectedLayerIds,
  schoolLegendsByEntity,
  isMobile,
  activeEntityTypes,
  entityRegistry,
}: ChangeLayerOptions) => {
  if (!map || mapRoute.map) return;
  const { schoolIdByEntity = {} } = selectedLayerIds;
  const isSourceAvailable = checkSourceAvailable(
    map,
    CONNECTIVITY_STATUS_SOURCE,
  );
  const entityTypes = activeEntityTypes ?? [];
  if (
    isSourceAvailable &&
    entityTypes.some((entityType) => schoolIdByEntity[entityType])
  ) {
    for (const entityType of entityTypes) {
      const entityStatusLayerId = schoolIdByEntity[entityType];
      if (!entityStatusLayerId) {
        hideLayer(map, getEntityStatusLayerId(entityType));
        continue;
      }
      const config = entityRegistry?.[entityType] as EntityConfig | undefined;
      const markerType = config?.markerType ?? 'circle';
      const options = {
        'source-layer': getSourceLayerName(entityType),
        filter: filterSchoolStatus(schoolLegendsByEntity?.[entityType] ?? []),
      };

      if (markerType === 'circle') {
        createSchoolLayer(map, {
          source: CONNECTIVITY_STATUS_SOURCE,
          id: getEntityStatusLayerId(entityType),
          paintData,
          isMobile,
          options,
          mapRoute,
          entityConfig: config,
        });
      } else {
        createEntitySymbolLayer(map, {
          source: CONNECTIVITY_STATUS_SOURCE,
          id: getEntityStatusLayerId(entityType),
          symbol: config?.symbol ?? '■',
          paintData,
          isMobile,
          options,
          mapRoute,
          entityConfig: config,
        });
      }
    }
    moveEntityStatusLayersToTop(map, entityTypes);
  } else {
    for (const entityType of entityTypes) {
      hideLayer(map, getEntityStatusLayerId(entityType));
    }
  }
};

export const setAnimationHandler = (
  entityType: string,
  handler: { requestId: number },
) => {
  animateCircleHandlers[entityType] = handler;
};
