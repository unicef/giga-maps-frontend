import { createEffect } from 'effector';
import mapboxGL from 'mapbox-gl';

import { defaultCenter, defaultZoom, styleUrls } from '~/@/map/map.constant';
import { changeMap, onStyleLoaded } from '~/@/map/map.model';
import { InitMapOptions } from '~/@/map/map.types';
import { API_MAPBOX_ACCESS_TOKEN } from '~/env';

export const initMapFx = createEffect(
  ({ style, container, center, zoom }: InitMapOptions) => {
    mapboxGL.accessToken = API_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxGL.Map({
      style: styleUrls[style],
      center: center ?? defaultCenter,
      zoom: zoom ?? defaultZoom,
      container,
    });
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.on('load', () => {
      changeMap(map);
    });

    map.on('styledata', (e) => {
      onStyleLoaded();
    });
  }
);
