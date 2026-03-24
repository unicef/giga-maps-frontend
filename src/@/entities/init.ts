/**
 * Entity system initialization.
 *
 * Wires entity Effector effects to app lifecycle events.
 * This file is imported by core/init.ts so it runs on app startup.
 */
// Import route model to activate URL → store sync on page load
import './models/entity-route.model';

import { guard, merge, sample } from 'effector';

import { $map, $stylePaintData, onLoadPage } from '~/@/map/map.model';
import { fetchEntityPopupDataFx, fetchEntityRegistryFx } from '~/api/entities';
import { map, mapEntities } from '~/core/routes';

import { createActiveEntityLayers } from './map/entity-layers';
import {
  $activeEntityTypes,
  $entityPopupData,
  setEntityLoading,
  setEntityPopupData,
} from './models/entity.model';
import { $getEntityParams } from './models/entity-route.model';
import type { EntityType } from './types/base-entity.type';
import { updateEntityUrlParam } from './utils/entity-navigation';

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
$activeEntityTypes.watch((activeTypes) => {
  const mapInstance = $map.getState();
  if (!mapInstance) return;

  const paintData = $stylePaintData.getState();
  createActiveEntityLayers(mapInstance, {
    activeEntityTypes: activeTypes,
    paintData,
    options: {
      'source-layer': 'default',
    },
  });
});

/**
 * Store → URL sync: when user toggles entity types, update the URL.
 * Uses history.replace to avoid creating new history entries.
 */
let isInitialLoad = true;
$activeEntityTypes.watch((activeTypes) => {
  // Skip updating URL on the initial store hydration from URL
  if (isInitialLoad) {
    isInitialLoad = false;
    return;
  }
  updateEntityUrlParam(activeTypes);
});

// ─────────────────────────────────────────────────
// Entity sidebar data fetching on /map/entities route
// ─────────────────────────────────────────────────

/**
 * When /map/entities route becomes visible with valid params,
 * fetch entity details via fetchEntityPopupDataFx.
 */
sample({
  clock: [mapEntities.visible, $getEntityParams],
  source: $getEntityParams,
  filter: (params) => !!params.entityType && !!params.entityId,
  fn: (params) => {
    setEntityLoading(true);
    return {
      entityType: params.entityType!,
      entityId: params.entityId!,
    };
  },
  target: fetchEntityPopupDataFx,
});

/**
 * Store fetch results into $entityPopupData for EntityView rendering.
 */
sample({
  clock: fetchEntityPopupDataFx.doneData,
  source: $getEntityParams,
  fn: (params, data) => {
    setEntityLoading(false);
    return {
      entityType: (params.entityType ?? 'unknown') as EntityType,
      data: data as any,
    };
  },
  target: setEntityPopupData,
});

/**
 * Clear entity popup data when leaving the entity route.
 */
const entityRouteLeft = guard(mapEntities.visible, {
  filter: (visible: boolean) => !visible,
});
$entityPopupData.reset(entityRouteLeft);

