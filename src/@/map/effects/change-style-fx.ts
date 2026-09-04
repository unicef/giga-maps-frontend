import { createEffect } from 'effector';

import { styleUrls } from '~/@/map/map.constant';
import { Map, Style } from '~/@/map/map.types';

import { bindWaterColor } from './apply-water-color';

export const changeStyleFx = createEffect(
  ({ map, style }: { map: Map; style: Style }) => {
    map.setStyle(styleUrls[style]);
    bindWaterColor(map, style);
  }
);
