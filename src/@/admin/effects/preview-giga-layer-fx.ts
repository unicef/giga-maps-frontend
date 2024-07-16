import { createEffect } from "effector";
import { Map } from "mapbox-gl";

import { LayerDataProps, stylePaintData } from "~/@/map/map.constant";
import { animateCircles, checkSourceAvailable, createSchoolLayer, createSchoolSource, createSelectedLayer, defaultSource, deleteSourceAndLayers } from "~/@/map/utils";
import { Layers, SCHOOL_STATUS_LAYER } from "~/@/sidebar/sidebar.constant";

import { DataLayer, PreviewDataType } from "../types/giga-layer.type";
import { addCountryBoundries } from "./map-country-boundary.fx";
import { isLiveLayer } from "~/@/sidebar/sidebar.util";
import { changeAdminMap } from "~/@/common/admin-map-preview/admin-map.model";

let adminAnimateCircleHandler = { requestId: 0 }; // to clear animation;

const getSchoolsGeoJson = (data: PreviewDataType['map']) => {
  return {
    type: 'FeatureCollection',
    features: data.map((item: PreviewDataType['map'][0]) => ({
      type: 'Feature',

      properties: {
        id: item.name,
        [LayerDataProps.connectivityStatus.key]: item.connectivity_status,
        [LayerDataProps.connectivity.key]: item.connectivity,
        [LayerDataProps.coverage.key]: item?.field_status,
        is_rt_connected: item?.is_rt_connected
      },
      geometry: item.geopoint,
      id: item.id,
    })),
  };
}

export const plotMapData = ({ map, mapData, currentLayerItem }: { map: Map; mapData: PreviewDataType['map'], currentLayerItem: DataLayer }) => {
  if (checkSourceAvailable(map, defaultSource)) return null;
  createSchoolSource({ map, schoolData: getSchoolsGeoJson(mapData) });
  const isLive = !!isLiveLayer(currentLayerItem.type);

  createSelectedLayer(map, {
    id: Layers.connectivity,
    isLive,
    isDynamicLayer: false,
    paintData: stylePaintData.dark,
    mapRoute: { map: true, country: false, schools: false },
    options: {}
  });
  if (isLive) {
    adminAnimateCircleHandler = animateCircles({ map, id: Layers.connectivity });
  }
  // create school layer;
  createSchoolLayer(map, {
    id: String(SCHOOL_STATUS_LAYER.id),
    paintData: stylePaintData.dark,
    mapRoute: { map: true, country: false, schools: false },
    options: {}
  });

}

export const previewDataLayerFx = createEffect(({ map, mapData, currentLayerItem }: { map: Map; mapData: PreviewDataType['map'], currentLayerItem: DataLayer }) => {
  if (!map) return;
  try {
    addCountryBoundries(map);
    plotMapData({ map, mapData, currentLayerItem });
  } catch (e) {
    console.log(e);
  }
})

export const clearAdminMapData = createEffect(({ map }: { map: Map }) => {
  clearTimeout(adminAnimateCircleHandler.requestId);
  deleteSourceAndLayers({ map, sourceId: defaultSource });
  changeAdminMap(null);
});