import { createEffect } from 'effector';
import mapboxGL from 'mapbox-gl';

import { defaultCenter, defaultZoom, maxZoom, styleUrls } from '~/@/map/map.constant';
import { changeMap, onStyleLoaded, onZoomStateChange } from '~/@/map/map.model';
import { InitMapOptions } from '~/@/map/map.types';
import { API_MAPBOX_ACCESS_TOKEN } from '~/env';
let timeout: ReturnType<typeof setTimeout>;
export const initMapFx = createEffect(
  ({ style, container, center, zoom }: InitMapOptions) => {
    mapboxGL.accessToken = API_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxGL.Map({
      style: styleUrls[style],
      center: center ?? defaultCenter,
      zoom: zoom ?? defaultZoom,
      maxZoom: maxZoom,
      container,
    });
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.on('load', () => {
      changeMap(map);
    });

    map.on('zoomstart', (e) => {
      if (e.originalEvent) return;
      const date = new Date();
      clearTimeout(timeout);
      onZoomStateChange('start');
    });

    // map.on('zoom', () => {
    //   const date = new Date();
    //   console.log('zoom', date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    // });

    map.on('zoomend', (e) => {
      if (e.originalEvent) return;
      const date = new Date();
      timeout = setTimeout(() => {
        onZoomStateChange('end');
      }, 10);
    });

    map.on('styledata', (e) => {
      onStyleLoaded();
    });
  }
);
