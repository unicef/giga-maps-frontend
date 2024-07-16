import { createEffect } from "effector";
import mapboxgl from "mapbox-gl";
import { styleUrls, defaultCenter, defaultZoom } from "~/@/map/map.constant";
import { InitMapOptions } from "~/@/map/map.types";
import { API_MAPBOX_ACCESS_TOKEN } from "~/env";
import { changeAdminMap } from "./admin-map.model";

export const initAdminMapFx = createEffect(
  ({ style, container, center, zoom }: InitMapOptions) => {
    mapboxgl.accessToken = API_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      style: styleUrls[style],
      center: center ?? defaultCenter,
      zoom: zoom ?? defaultZoom,
      container,
    });

    map.on('load', () => {
      changeAdminMap(map);
    });
  }
);