import { createEffect } from 'effector';
import mapboxGL from 'mapbox-gl';

import { defaultCenter, defaultZoom, maxZoom, styleUrls } from '~/@/map/map.constant';
import { changeMap, onStyleLoaded, onZoomLevelChange, onZoomStateChange } from '~/@/map/map.model';
import { InitMapOptions } from '~/@/map/map.types';
import { captureComponentError } from '~/core/sentry';
import { API_MAPBOX_ACCESS_TOKEN } from '~/env';

let timeout: ReturnType<typeof setTimeout>;

export const initMapFx = createEffect(
  ({ style, container, center, zoom }: InitMapOptions) => {
    try {
      mapboxGL.accessToken = API_MAPBOX_ACCESS_TOKEN;

      const map = new mapboxGL.Map({
        style: styleUrls[style],
        center: center ?? defaultCenter,
        zoom: zoom ?? defaultZoom,
        maxZoom,
        container,
      });

      map.on('error', (e) => {
        if (e?.error) {
          captureComponentError(e.error, 'MapboxGL', {
            message: e.error.message,
            style,
            zoom,
          });
        }
      });

      map.on('zoom', () => {
        onZoomLevelChange(Number(map.getZoom().toFixed(2)));
      });

      map.on('zoomstart', (e) => {
        if (e.originalEvent) return;
        clearTimeout(timeout);
        onZoomStateChange('start');
      });

      map.on('zoom', () => {
        onZoomLevelChange(Number(map.getZoom().toFixed(1)));
      });

      map.on('zoomend', (e) => {
        if (e.originalEvent) return;
        timeout = setTimeout(() => {
          onZoomStateChange('end');
        }, 10);
      });

      map.on('styledata', () => {
        onStyleLoaded();
      });
    } catch (error) {
      captureComponentError(error, 'InitMapFx', { style, center, zoom });
      throw error;
    }
  }
);
