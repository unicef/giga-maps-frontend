import '~/@/map/map.init';
// import '~/@/country/country.init';
import '@/sidebar/init';

// import '@/project/init';
import { createEvent, guard, restore } from 'effector';

import { getInverted, getVoid } from '~/lib/effector-kit';
import { ToLocation } from '~/lib/router/types';

import { instantScrollFx, scrollToHashFx } from '@/scroll';

import { router } from './routes';

export const appLoadEvent = createEvent<boolean>();
export const $appLoaded = restore<boolean>(appLoadEvent, false);

const getHash = (toLocation: ToLocation) =>
  typeof toLocation === 'object' && typeof toLocation.to === 'object'
    ? toLocation.to.hash
    : typeof toLocation === 'string' && toLocation.includes('#')
      ? toLocation.replace(/^.*#/, '#')
      : undefined;

guard({
  source: router.navigate.map(getHash),
  filter: Boolean,
  target: scrollToHashFx,
});

guard({
  source: router.navigate.map(getHash),
  filter: getInverted,
  target: instantScrollFx.prepend(getVoid),
});
