/**
 * Entity system initialization.
 *
 * Wires entity Effector effects to app lifecycle events.
 * This file is imported by core/init.ts so it runs on app startup.
 */
// Import route model (now a stub - URL sync handled in sidebar/url-params.model.ts)
import { guard, merge, sample } from 'effector';

import { $map, $stylePaintData, onLoadPage } from '~/@/map/map.model';
import { fetchEntityRegistryFx } from '~/api/entities';
import { entityView, map } from '~/core/routes';

import { createActiveEntityLayers } from './map/entity-layers';
import {
  $activeEntityTypes,
  $entityPopupData,
} from './models/entity.model';

/**
 * On app load: fetch entity registry from API.
 * Same trigger as fetchCountriesFx — runs when page loads or map becomes visible.
 * If API fails, $entityRegistry keeps its defaults (silent fallback).
 */
sample({
  clock: merge([onLoadPage, map.visible]),
  target: fetchEntityRegistryFx,
});

/**
 * When active entity types change, show/hide entity layers on the map.
 */
// $activeEntityTypes.watch((activeTypes) => {
//   const mapInstance = $map.getState();
//   if (!mapInstance) return;

//   const paintData = $stylePaintData.getState();
//   createActiveEntityLayers(mapInstance, {
//     activeEntityTypes: activeTypes,
//     paintData,
//     options: {
//       'source-layer': 'default',
//     },
//   });
// });

// ─────────────────────────────────────────────────
// Entity sidebar data fetching on /map/view route
// Note: entity_id removed from URL params - specific entity fetching disabled
// ─────────────────────────────────────────────────

/**
 * Clear entity popup data when leaving the entity route.
 */
const entityRouteLeft = guard(entityView.visible, {
  filter: (visible: boolean) => !visible,
});
$entityPopupData.reset(entityRouteLeft);

