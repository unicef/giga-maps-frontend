import { createEffect } from 'effector';
import mapboxGL from 'mapbox-gl';

import { defaultCenter, defaultZoom, maxZoom, styleUrls } from '~/@/map/map.constant';
import { changeMap, onStyleLoaded, onZoomLevelChange, onZoomStateChange } from '~/@/map/map.model';
import { InitMapOptions } from '~/@/map/map.types';
import { API_MAPBOX_ACCESS_TOKEN } from '~/env';

import { bindWaterColor } from './apply-water-color';

let timeout: ReturnType<typeof setTimeout>;
export const initMapFx = createEffect(
  ({ style, container, center, zoom }: InitMapOptions) => {
    mapboxGL.accessToken = API_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxGL.Map({
      style: styleUrls[style],
      center: center ?? defaultCenter,
      zoom: zoom ?? defaultZoom,
      maxZoom,
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

    map.on('zoom', () => {
      onZoomLevelChange(Number(map.getZoom().toFixed(2)));
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

    bindWaterColor(map, style);

    map.on('styledata', (e) => {
      onStyleLoaded();
    });
  }
);
