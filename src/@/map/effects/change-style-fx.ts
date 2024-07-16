import { createEffect } from 'effector';

import { styleUrls } from '~/@/map/map.constant';
import { Map, Style } from '~/@/map/map.types';

export const changeStyleFx = createEffect(
  ({ map, style }: { map: Map; style: Style }) => {
    map.setStyle(styleUrls[style]);
  }
);
