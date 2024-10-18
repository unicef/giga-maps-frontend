import { VectorSource } from "mapbox-gl";

import { getSchoolsGeoJson } from "~/@/country/lib/get-schools-geojson";

import { ChangeLayerOptions } from "../map.types";
import { animateCircles, checkSourceAvailable, createSchoolLayer, createSchoolSource, createSelectedLayer, createSource, defaultSource, deleteSourceAndLayers, filterSchoolStatus, getMapId, generateLayerUrls, hideLayer, removePreviewsMapClickHandlers, filterConnectivityList, filterCoverageList } from "../utils";
import { mapSchools } from "~/core/routes";

let animateCircleHandler = { requestId: 0 }; // to clear animation;
const ignoreCountriesForBounds = ['fj']
export const getLayerIdsAndLastChange = ({ selectedLayerIds, refresh, lastSelectedLayer }: Pick<ChangeLayerOptions, "selectedLayerIds" | "refresh" | "lastSelectedLayer">) => {
  const { schoolId: schoolLayerId, selectedId: selectedLayerId } = selectedLayerIds;
  const checkSelectionChange = selectedLayerId && selectedLayerId !== lastSelectedLayer.layerId;
  const isLastSelectionChange = refresh || !!checkSelectionChange;
  return { schoolLayerId, selectedLayerId, isLastSelectionChange };
}

export const createSourceForMapAndCountry = async ({ map, schoolAdminId, countrySearch, connectivityBenchMark, selectedLayerId: layerId, connectivityFilter, layerUtils, mapRoute, country, lastSelectedLayer, admin1Data }: ChangeLayerOptions & { selectedLayerId: number | null; }) => {
  if (!map) return;
  // cancel animation;
  cancelAnimationFrame(animateCircleHandler.requestId)
  // delete existing source;
  deleteSourceAndLayers({ map });
  // create new source

  // remove click handlers
  removePreviewsMapClickHandlers(map);
  const { coverageLayerId } = layerUtils;
  if (!layerId) {
    layerId = lastSelectedLayer.layerId ?? coverageLayerId;
    // return;
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
  const url = generateLayerUrls({ layerId, connectivityBenchMark, layerUtils, connectivityFilter, mapRoute, country, admin1Id, countrySearch });
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
  createSource({ map, url }, options)
  return true;
}

export const createSourceForSchool = ({ map, layerUtils, schoolStats, selectedLayerId, lastSelectedLayer }: Pick<ChangeLayerOptions, "map" | "schoolStats" | "layerUtils" | "lastSelectedLayer"> & { selectedLayerId: number | null; }) => {
  if (!map) return;
  // cancel animation;
  cancelAnimationFrame(animateCircleHandler.requestId)

  deleteSourceAndLayers({ map });
  selectedLayerId = selectedLayerId ?? lastSelectedLayer.layerId
  // remove preview click handler;
  removePreviewsMapClickHandlers(map);
  if (selectedLayerId && schoolStats?.length) {
    let schoolData = getSchoolsGeoJson(schoolStats);
    createSchoolSource({ map, schoolData });
  }
}

export const createAndUpdateMapLayer = ({ map, mapRoute, connectivitySpeedFilter, coverageFilter, layerUtils, selectedLayerId, paintData, schoolLayerId, lastSelectedLayer, schoolLegends, isMobile }: ChangeLayerOptions & { selectedLayerId: number | null; schoolLayerId: number | null; }) => {
  if (!map) return;
  const { currentLayerTypeUtils, downloadLayerId, coverageLayerId } = layerUtils;
  const { isLive } = currentLayerTypeUtils;
  const isDynamicLayer = !(selectedLayerId === downloadLayerId || selectedLayerId === coverageLayerId);
  const isSourceAvailable = checkSourceAvailable(map, defaultSource);
  const options: Record<string, any> = {
    filter: isLive ? filterConnectivityList(connectivitySpeedFilter, isDynamicLayer) : filterCoverageList(coverageFilter, isDynamicLayer)
  };
  // if (!mapRoute.schools) {
  options['source-layer'] = "default"
  // }
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
  // create school layer;
  if (isSourceAvailable && schoolLayerId) {
    createSchoolLayer(map, {
      id: getMapId(schoolLayerId),
      paintData,
      isMobile,
      options: {
        ...options,
        filter: filterSchoolStatus(schoolLegends)
      }, mapRoute
    });
  } else {
    hideLayer(map, getMapId(lastSelectedLayer.schoolId));
  }
}

export const cancelAnimation = () => {
  cancelAnimationFrame(animateCircleHandler.requestId)
}

export const setAnimationHandler = (handler: { requestId: number }) => {
  animateCircleHandler = handler;
}