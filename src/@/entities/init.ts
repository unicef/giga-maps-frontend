/**
 * Entity system initialization.
 *
 * This file is imported by core/init.ts so it runs on app startup.
 */
import { merge, sample } from 'effector';

import { onLoadPage } from '~/@/map/map.model';
import { fetchEntityRegistryFx } from '~/api/entities';
import { map } from '~/core/routes';

/**
 * On app load: fetch entity registry from API.
 * Same trigger as fetchCountriesFx — runs when page loads or map becomes visible.
 * If API fails, $entityRegistry keeps its defaults (silent fallback).
 */
sample({
  clock: merge([onLoadPage, map.visible]),
  target: fetchEntityRegistryFx,
});
