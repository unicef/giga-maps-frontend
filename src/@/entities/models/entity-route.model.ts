import { combine, sample } from 'effector';

import { map, mapEntities } from '~/core/routes';
import { setActiveEntityTypes } from './entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';

/**
 * $entityRouteParam — reads `?entity=` from any map route's search string.
 * Works across /map, /map/country/:code, /map/entities, etc.
 *
 * Returns an array of entity type strings, e.g. ['health'] or ['school','health'].
 * Returns [] if no ?entity= param is present.
 */
export const $entityRouteParam = sample({
  source: map.router.search,
  fn: (search: string) => {
    const params = new URLSearchParams(search);
    const entityParam = params.get('entity');
    return entityParam ? entityParam.split(',').filter(Boolean) : [];
  },
});

/**
 * $getEntityParams — reads params specific to the /map/entities route.
 * Used when navigating to a specific non-school entity.
 */
export const $getEntityParams = sample({
  source: mapEntities.router.search,
  fn: (search: string) => {
    const params = new URLSearchParams(search);
    return {
      entityType: params.get('entity') ?? null,
      entityId: params.get('entity_id') ? Number(params.get('entity_id')) : null,
      country: params.get('country') ?? null,
    };
  },
});

/**
 * Sync URL → $activeEntityTypes on initial page load.
 * When the URL has ?entity=health, set active entity types accordingly.
 */
sample({
  source: $entityRouteParam,
  filter: (types) => types.length > 0,
  fn: (types) => types as EntityType[],
  target: setActiveEntityTypes,
});
