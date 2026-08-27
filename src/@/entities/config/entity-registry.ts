import { EntityType } from '../types/base-entity.type';
import type { EntityConfig } from './entity-config.types';

/**
 * Default entity registry - hardcoded fallback configuration.
 *
 * This is ONLY the default data. The live registry lives in the
 * Effector store `$entityRegistry` in entity.model.ts.
 *
 * On app load:
 * 1. Store initializes with these defaults
 * 2. fetchEntityRegistryFx tries to load from API
 * 3. API response merges with defaults via store update
 * 4. If API fails, defaults remain
 */
export const DEFAULT_ENTITY_REGISTRY: Record<EntityType, EntityConfig> = {
  [EntityType.SCHOOL]: {
    type: EntityType.SCHOOL,
    displayName: 'Schools',
    slug: 'school',
    icon: 'Education',
    active: true,
    visible: true,
    markerType: 'circle',
    symbol: '●',
    mapAnimation: {
      zoomRadius: [
        { zoom: 0, radius: 0.2 },
        { zoom: 3, radius: 1 },
        { zoom: 8, radius: 4 },
        { zoom: 14, radius: 24 },
      ],
      growSpeed: 1,
      glowMinScale: 1.2,
      glowMaxScale: 2.5,
    },
    sidebar: {
      estimatedTotalInMillions: 6,
    },
    useLegacyApi: true,
  },

  [EntityType.HEALTH]: {
    type: EntityType.HEALTH,
    displayName: 'Health facilities',
    slug: 'health-facilities',
    icon: 'Hospital',
    active: true,
    visible: true,
    markerType: 'symbol',
    symbol: '■',
    mapAnimation: {
      zoomRadius: [
        { zoom: 0, radius: 0.2 },
        { zoom: 3, radius: 2 },
        { zoom: 8, radius: 6 },
        { zoom: 14, radius: 40 },
      ],
      growSpeed: 1,
      glowMinScale: 1.37,
      glowMaxScale: 2.2,
    },
    sidebar: {},
    useLegacyApi: false,
  },
};
