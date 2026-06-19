import { VectorSource } from 'mapbox-gl';

import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import { EntityType } from '~/@/entities/types/base-entity.type';

import {
  CONNECTIVITY_STATUS_SOURCE,
  DEFAULT_SOURCE,
  getEntitySelectedLayerId,
  getEntityStatusLayerId,
  getSourceLayerName,
} from '../map.constant';
import { ChangeLayerOptions } from '../map.types';
import {
  animateCircles,
  checkSourceAvailable,
  createEntitySymbolLayer,
  createSchoolLayer,
  createSelectedLayer,
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
  const { schoolId: schoolLayerId, selectedId: selectedLayerId } =
    selectedLayerIds ?? {};
  const selectedLayerIdByEntity: Partial<Record<EntityType, number | null>> =
    selectedLayerIds?.selectedIdByEntity ??
    (selectedLayerId ? { [EntityType.SCHOOL]: selectedLayerId } : {});
  const lastLayerIdByEntity: Partial<Record<EntityType, number | null>> =
    lastSelectedLayer?.layerIdByEntity ??
    (lastSelectedLayer?.layerId
      ? { [EntityType.SCHOOL]: lastSelectedLayer.layerId }
      : {});
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
    : !!(selectedLayerId && selectedLayerId !== lastSelectedLayer?.layerId);
  const isLastSelectionChange = refresh || checkSelectionChange;
  return {
    schoolLayerId,
    selectedLayerId,
    selectedLayerIdByEntity,
    isLastSelectionChange,
  };
};

export const createSourceForMapAndCountry = ({
  map,
  schoolPageIds,
  schoolAdminId,
  countrySearch,
  connectivityBenchMark,
  selectedLayerId: layerId,
  connectivityFilter,
  layerUtils,
  mapRoute,
  country,
  lastSelectedLayer,
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
  const { coverageLayerId } = layerUtils;
  if (!layerId) {
    layerId = mapRoute.map
      ? layerUtils.globalLayerId
      : (lastSelectedLayer.layerId ?? coverageLayerId);
  }
  let admin1Id = mapRoute.schools ? schoolAdminId : admin1Data?.id;
  if (mapRoute.schools) {
    if (admin1Id) {
      admin1Data =
        country?.admin1_metadata?.find((admin) => admin.id === admin1Id) ??
        null;
    } else if (admin1Id === 0) {
      admin1Id = undefined;
    } else {
      return false;
    }
  }
  let url = null;
  if (!isConnectivityStatus) {
    url = generateLayerUrls({
      layerId,
      activeEntityTypes,
      connectivityBenchMark,
      schoolPageIds,
      layerUtils,
      connectivityFilter,
      mapRoute,
      country,
      admin1Id,
      countrySearch,
      entityRegistry,
    });
  } else {
    url = generateStaticLayerUrl({
      mapRoute,
      country,
      schoolPageIds,
      admin1Id,
      countrySearch,
    });
  }
  const options = {} as VectorSource;
  if (!!country) {
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
  connectivitySpeedFilter,
  connectivitySpeedFilterByEntity,
  coverageFilter,
  coverageFilterByEntity,
  layerUtils,
  selectedLayerId,
  selectedLayerIds,
  paintData,
  lastSelectedLayer,
  isMobile,
  activeEntityTypes,
  entityRegistry,
}: ChangeLayerOptions & {
  selectedLayerId: number | null;
  schoolLayerId: number | string | null;
}) => {
  if (!map) return;
  const { currentLayerTypeUtils, globalLayerId } = layerUtils;
  const isLive = mapRoute.map || currentLayerTypeUtils.isLive;
  const isSourceAvailable = checkSourceAvailable(map, DEFAULT_SOURCE);

  // Cancel all previous entity animations
  cancelAnimation();

  // Determine active entity types (fallback to school-only for backward compat)
  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : [EntityType.SCHOOL];

  // --- Selected layer (connectivity/coverage) per entity type ---
  if (isSourceAvailable && selectedLayerId) {
    for (const entityType of entityTypes) {
      const entityLayerId = mapRoute.map
        ? globalLayerId
        : (layerUtils.selectedLayerIdByEntity?.[entityType] ?? selectedLayerId);
      if (!entityLayerId) continue;
      const isDynamicLayer = !(entityLayerId === globalLayerId);
      const sourceLayer = getSourceLayerName(entityType);
      const layerIdStr = getEntitySelectedLayerId(entityType, entityLayerId);
      const entityConnectivityFilter =
        connectivitySpeedFilterByEntity?.[entityType] ??
        connectivitySpeedFilter;
      const entityCoverageFilter =
        coverageFilterByEntity?.[entityType] ?? coverageFilter;
      const options: Record<string, unknown> = {
        filter: isLive
          ? filterConnectivityList(entityConnectivityFilter, isDynamicLayer)
          : filterCoverageList(entityCoverageFilter, isDynamicLayer),
        'source-layer': sourceLayer,
      };

      if (isLive) {
        animateCircleHandlers[entityType] = animateCircles({
          map,
          id: layerIdStr,
        });
      }

      createSelectedLayer(map, {
        id: layerIdStr,
        isMobile,
        isLive,
        isDynamicLayer,
        paintData,
        mapRoute,
        options,
      });
    }
  } else {
    // hide previous selected layers for all entity types
    for (const entityType of entityTypes) {
      hideLayer(
        map,
        getEntitySelectedLayerId(entityType, lastSelectedLayer.layerId),
      );
    }
  }

  if (!mapRoute.map) return;

  // --- Status layer (connectivity_status dots) per entity type in global view ---
  if (isSourceAvailable) {
    for (const entityType of entityTypes) {
      const isStatusSelected =
        selectedLayerIds?.schoolIdByEntity?.[entityType] ??
        selectedLayerIds?.schoolId;
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
        });
      }
    }
  }
};

export const createAndUpdateConnectiivtyStatusLayer = ({
  map,
  mapRoute,
  paintData,
  selectedLayerIds,
  schoolLegends,
  schoolLegendsByEntity,
  isMobile,
  activeEntityTypes,
  entityRegistry,
}: ChangeLayerOptions) => {
  if (!map || mapRoute.map) return;
  const { schoolId: schoolLayerId, schoolIdByEntity = {} } = selectedLayerIds;
  const isSourceAvailable = checkSourceAvailable(
    map,
    CONNECTIVITY_STATUS_SOURCE,
  );
  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : [EntityType.SCHOOL];
  if (
    isSourceAvailable &&
    entityTypes.some(
      (entityType) => schoolIdByEntity[entityType] ?? schoolLayerId,
    )
  ) {
    for (const entityType of entityTypes) {
      const entityStatusLayerId = schoolIdByEntity[entityType] ?? schoolLayerId;
      if (!entityStatusLayerId) {
        hideLayer(map, getEntityStatusLayerId(entityType));
        continue;
      }
      const config = entityRegistry?.[entityType] as EntityConfig | undefined;
      const markerType = config?.markerType ?? 'circle';
      const options = {
        'source-layer': getSourceLayerName(entityType),
        filter: filterSchoolStatus(
          schoolLegendsByEntity?.[entityType] ?? schoolLegends,
        ),
      };

      if (markerType === 'circle') {
        createSchoolLayer(map, {
          source: CONNECTIVITY_STATUS_SOURCE,
          id: getEntityStatusLayerId(entityType),
          paintData,
          isMobile,
          options,
          mapRoute,
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
        });
      }
    }
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
