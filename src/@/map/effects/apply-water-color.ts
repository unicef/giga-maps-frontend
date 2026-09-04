import { waterColorByStyle } from '~/@/map/map.constant';
import { Map, Style } from '~/@/map/map.types';

const WATER_LAYER_ID = 'water';

const boundHandlers = new WeakMap<Map, () => void>();

/**
 * Re-applies the override on every styledata event: the water layer only exists
 * once the basemap has loaded, and mapbox drops the override on every setStyle.
 */
export const bindWaterColor = (map: Map, style: Style) => {
  const previous = boundHandlers.get(map);
  if (previous) map.off('styledata', previous);

  const apply = () => {
    const color = waterColorByStyle[style];
    if (!color || !map.getLayer(WATER_LAYER_ID)) return;
    // setPaintProperty re-fires styledata, which calls this back.
    if (map.getPaintProperty(WATER_LAYER_ID, 'fill-color') === color) return;
    map.setPaintProperty(WATER_LAYER_ID, 'fill-color', color);
  };

  boundHandlers.set(map, apply);
  map.on('styledata', apply);
  apply();
};
