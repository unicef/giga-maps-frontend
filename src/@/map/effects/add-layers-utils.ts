import { VectorSource } from "mapbox-gl";

import { getSchoolsGeoJson } from "~/@/country/lib/get-schools-geojson";

import { ChangeLayerOptions } from "../map.types";
import { animateCircles, checkSourceAvailable, createSchoolLayer, createSchoolSource, createSelectedLayer, createSource, defaultSource, deleteSourceAndLayers, filterSchoolStatus, getMapId, generateLayerUrls, hideLayer, removePreviewsMapClickHandlers, filterConnectivityList, filterCoverageList, staticSource, generateStaticLayerUrl } from "../utils";
import { mapSchools } from "~/core/routes";
import { SCHOOL_LAYER_ID } from "../map.constant";

let animateCircleHandler = { requestId: 0 }; // to clear animation;
const ignoreCountriesForBounds = ['fj']
export const getLayerIdsAndLastChange = ({ selectedLayerIds, refresh, lastSelectedLayer }: Pick<ChangeLayerOptions, "selectedLayerIds" | "refresh" | "lastSelectedLayer">) => {
  const { schoolId: schoolLayerId, selectedId: selectedLayerId } = selectedLayerIds;
  const checkSelectionChange = selectedLayerId && selectedLayerId !== lastSelectedLayer.layerId;
  const isLastSelectionChange = refresh || !!checkSelectionChange;
  return { schoolLayerId, selectedLayerId, isLastSelectionChange };
}

export const createSourceForMapAndCountry = async ({ map, schoolAdminId, countrySearch, connectivityBenchMark, selectedLayerId: layerId, connectivityFilter, layerUtils, mapRoute, country, lastSelectedLayer, admin1Data, isConnectivityStatus }: ChangeLayerOptions & { selectedLayerId: number | null; isConnectivityStatus?: boolean }) => {
  if (!map) return;
  const sourceId = isConnectivityStatus ? staticSource : defaultSource;
  if (!isConnectivityStatus) {
    // cancel animation;
    cancelAnimationFrame(animateCircleHandler.requestId)
  }
  // delete existing source;
  deleteSourceAndLayers({ map, sourceId });
  // create new source

  // remove click handlers
  removePreviewsMapClickHandlers(map);
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
    url = generateLayerUrls({ layerId, connectivityBenchMark, layerUtils, connectivityFilter, mapRoute, country, admin1Id, countrySearch });
  } else {
    url = generateStaticLayerUrl({ mapRoute, country, admin1Id, countrySearch });
  }
  const options = {} as VectorSource;
  if (!!country) {
    const removeBounds = ignoreCountriesForBounds.includes(country.code.toLocaleLowerCase());
    if (admin1Data) {
      options.bounds = admin1Data.bbox as VectorSource['bounds'];
    } else {
      options.bounds = country.admin_metadata.bbox as VectorSource['bounds'];
    }
    options.maxzoom = 8;
    if (removeBounds) {
      delete options.bounds;
      options.maxzoom = 4;
    }
  }
  createSource({ map, url, source: sourceId }, options)
  return true;
}


export const createAndUpdateMapLayer = ({ map, mapRoute, connectivitySpeedFilter, coverageFilter, layerUtils, selectedLayerId, paintData, schoolLayerId, lastSelectedLayer, schoolLegends, isMobile }: ChangeLayerOptions & { selectedLayerId: number | null; schoolLayerId: number | null; }) => {
  if (!map) return;
  const { currentLayerTypeUtils, downloadLayerId, coverageLayerId } = layerUtils;
  const { isLive } = currentLayerTypeUtils;
  const isDynamicLayer = !(selectedLayerId === downloadLayerId || selectedLayerId === coverageLayerId);
  const isSourceAvailable = checkSourceAvailable(map, defaultSource);
  const options: Record<string, any> = {
    filter: isLive ? filterConnectivityList(connectivitySpeedFilter, isDynamicLayer) : filterCoverageList(coverageFilter, isDynamicLayer),
    'source-layer': "default"
  };
  // create selected layer;
  if (isSourceAvailable && selectedLayerId) {
    if (isLive) {
      animateCircleHandler = animateCircles({ map, id: getMapId(selectedLayerId) });
    }
    createSelectedLayer(map, {
      id: getMapId(selectedLayerId),
      isMobile,
      isLive,
      isDynamicLayer,
      paintData,
      mapRoute,
      options
    });
  } else {
    // cancel animation;
    cancelAnimationFrame(animateCircleHandler.requestId);
    hideLayer(map, getMapId(lastSelectedLayer.layerId))
  }

  if (!mapRoute.map) return;
  // create school layer;
  if (isSourceAvailable && schoolLayerId) {
    createSchoolLayer(map, {
      id: getMapId(SCHOOL_LAYER_ID),
      paintData,
      isMobile,
      options: {
        ...options,
        filter: filterSchoolStatus(schoolLegends)
      }, mapRoute
    });
  } else {
    hideLayer(map, getMapId(SCHOOL_LAYER_ID));
  }

}

export const createAndUpdateConnectiivtyStatusLayer = ({ map, mapRoute, paintData, selectedLayerIds, schoolLegends, isMobile }: ChangeLayerOptions) => {
  if (!map || mapRoute.map) return;
  const { schoolId: schoolLayerId } = selectedLayerIds;
  const isSourceAvailable = checkSourceAvailable(map, staticSource);
  // create school layer;
  if (isSourceAvailable && schoolLayerId) {
    createSchoolLayer(map, {
      source: staticSource,
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
  cancelAnimationFrame(animateCircleHandler.requestId)
}

export const setAnimationHandler = (handler: { requestId: number }) => {
  animateCircleHandler = handler;
}