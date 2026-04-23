import { VectorSource } from "mapbox-gl";

import { getSchoolsGeoJson } from "~/@/country/lib/get-schools-geojson";

import { ChangeLayerOptions } from "../map.types";
import { animateCircles, checkSourceAvailable, createSchoolLayer, createEntitySymbolLayer, createSchoolSource, createSelectedLayer, createSource, deleteSourceAndLayers, filterSchoolStatus, getMapId, generateLayerUrls, hideLayer, removePreviewsMapClickHandlers, filterConnectivityList, filterCoverageList, generateStaticLayerUrl } from "../utils";
import { CONNECTIVITY_STATUS_SOURCE, DEFAULT_SOURCE, SCHOOL_LAYER_ID, getSourceLayerName, getEntityStatusLayerId, getEntitySelectedLayerId, SOURCE_LAYER_SCHOOLS } from "../map.constant";
import { EntityType } from "~/@/entities/types/base-entity.type";
import type { EntityConfig } from "~/@/entities/config/entity-config.types";

/** Per-entity animation handlers (supports simultaneous animations for multiple entity types) */
let animateCircleHandlers: Record<string, { requestId: number }> = {};

const ignoreCountriesForBounds = ['fj']
export const getLayerIdsAndLastChange = ({ selectedLayerIds, refresh, lastSelectedLayer }: Pick<ChangeLayerOptions, "selectedLayerIds" | "refresh" | "lastSelectedLayer">) => {
  const { schoolId: schoolLayerId, selectedId: selectedLayerId } = selectedLayerIds;
  const checkSelectionChange = selectedLayerId && selectedLayerId !== lastSelectedLayer.layerId;
  const isLastSelectionChange = refresh || !!checkSelectionChange;
  return { schoolLayerId, selectedLayerId, isLastSelectionChange };
}

export const createSourceForMapAndCountry = async ({ map, schoolPageIds, schoolAdminId, countrySearch, connectivityBenchMark, selectedLayerId: layerId, connectivityFilter, layerUtils, mapRoute, country, lastSelectedLayer, admin1Data, isConnectivityStatus }: ChangeLayerOptions & { selectedLayerId: number | null; isConnectivityStatus?: boolean }) => {
  if (!map) return;
  const sourceId = isConnectivityStatus ? CONNECTIVITY_STATUS_SOURCE : DEFAULT_SOURCE;
  if (!isConnectivityStatus) {
    // cancel all entity animations;
    cancelAnimation();
  }
  // delete existing source;
  deleteSourceAndLayers({ map, sourceId });
  // create new source
  const { coverageLayerId } = layerUtils;
  if (!layerId) {
    layerId = lastSelectedLayer.layerId ?? coverageLayerId;
  }
  let admin1Id = mapRoute.schools ? schoolAdminId : admin1Data?.id;
  if (mapRoute.schools) {
    if (admin1Id) {
      admin1Data = country?.admin1_metadata?.find(admin => admin.id === admin1Id) ?? null;
    } else if (admin1Id === 0) {
      admin1Id = undefined;
    } else {
      return false;
    }
  }
  let url = null;
  if (!isConnectivityStatus) {
    url = generateLayerUrls({ layerId, connectivityBenchMark, schoolPageIds, layerUtils, connectivityFilter, mapRoute, country, admin1Id, countrySearch });
  } else {
    url = generateStaticLayerUrl({ mapRoute, country, schoolPageIds, admin1Id, countrySearch });
  }
  const options = {} as VectorSource;
  if (!!country) {
    const removeBounds = ignoreCountriesForBounds.includes(country.code.toLocaleLowerCase());
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
  createSource({ map, url, source: sourceId }, options)
  return true;
}


export const createAndUpdateMapLayer = ({ map, mapRoute, connectivitySpeedFilter, coverageFilter, layerUtils, selectedLayerId, paintData, schoolLayerId, lastSelectedLayer, schoolLegends, isMobile, activeEntityTypes, entityRegistry }: ChangeLayerOptions & { selectedLayerId: number | null; schoolLayerId: number | null; }) => {
  if (!map) return;
  const { currentLayerTypeUtils, globalLayerId } = layerUtils;
  const { isLive } = currentLayerTypeUtils;
  const isDynamicLayer = !(selectedLayerId === globalLayerId);
  const isSourceAvailable = checkSourceAvailable(map, DEFAULT_SOURCE);

  // Cancel all previous entity animations
  cancelAnimation();

  // Determine active entity types (fallback to school-only for backward compat)
  const entityTypes = activeEntityTypes?.length ? activeEntityTypes : [EntityType.SCHOOL];

  // --- Selected layer (connectivity/coverage) per entity type ---
  if (isSourceAvailable && selectedLayerId) {
    for (const entityType of entityTypes) {
      const sourceLayer = getSourceLayerName(entityType);
      const layerIdStr = getEntitySelectedLayerId(entityType, selectedLayerId);
      const options: Record<string, any> = {
        filter: isLive
          ? filterConnectivityList(connectivitySpeedFilter, isDynamicLayer)
          : filterCoverageList(coverageFilter, isDynamicLayer),
        'source-layer': sourceLayer,
      };

      if (isLive) {
        animateCircleHandlers[entityType] = animateCircles({ map, id: layerIdStr });
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
      hideLayer(map, getEntitySelectedLayerId(entityType, lastSelectedLayer.layerId));
    }
  }

  if (!mapRoute.map) return;

  // --- Status layer (connectivity_status dots) per entity type in global view ---
  if (isSourceAvailable) {
    for (const entityType of entityTypes) {
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
}

export const createAndUpdateConnectiivtyStatusLayer = ({ map, mapRoute, paintData, selectedLayerIds, schoolLegends, isMobile }: ChangeLayerOptions) => {
  if (!map || mapRoute.map) return;
  const { schoolId: schoolLayerId } = selectedLayerIds;
  const isSourceAvailable = checkSourceAvailable(map, CONNECTIVITY_STATUS_SOURCE);
  // create school layer (country view — uses legacy source-layer "default");
  if (isSourceAvailable && schoolLayerId) {
    createSchoolLayer(map, {
      source: CONNECTIVITY_STATUS_SOURCE,
      id: getMapId(SCHOOL_LAYER_ID),
      paintData,
      isMobile,
      options: {
        'source-layer': "default",
        filter: filterSchoolStatus(schoolLegends)
      }, mapRoute
    });
  } else {
    hideLayer(map, getMapId(SCHOOL_LAYER_ID));
  }
}

export const cancelAnimation = () => {
  Object.values(animateCircleHandlers).forEach(handler => {
    cancelAnimationFrame(handler.requestId);
  });
  animateCircleHandlers = {};
}

export const setAnimationHandler = (entityType: string, handler: { requestId: number }) => {
  animateCircleHandlers[entityType] = handler;
}