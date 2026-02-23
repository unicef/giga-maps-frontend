import { combine, createEvent, createStore } from 'effector';

import type { EntityType } from '../types/base-entity.type';
import type { BaseEntity, EntityStatistics } from '../types/base-entity.type';
import type { EntityConfig } from '../config/entity-config.types';
import { DEFAULT_ENTITY_REGISTRY } from '../config/entity-registry';
import { ENTITY_TYPES } from '../types/entity-types';
import { setPayload } from '~/lib/effector-kit';

/**
 * Entity system Effector stores.
 *
 * These stores sit ALONGSIDE existing school stores (map.model.ts, sidebar.model.ts).
 * Schools continue using their existing stores ($activeSchoolPopup, $schoolClickData, etc.).
 */

// ─────────────────────────────────────────────────
// Entity Registry Store (core of the entity system)
// ─────────────────────────────────────────────────

/**
 * The live entity registry — initialized from defaults, updated by API.
 * All components and resolvers read from this store.
 */
export const updateEntityRegistry = createEvent<Record<string, EntityConfig>>();
export const mergeEntityRegistryFromApi = createEvent<Partial<Record<string, Partial<EntityConfig>>>>();

export const $entityRegistry = createStore<Record<string, EntityConfig>>({ ...DEFAULT_ENTITY_REGISTRY });

// Full replacement (e.g., reset)
$entityRegistry.on(updateEntityRegistry, (_, payload) => payload);

// Merge from API — API data overrides defaults, new types get added
$entityRegistry.on(mergeEntityRegistryFromApi, (current, apiConfigs) => {
  const merged = { ...current };
  Object.entries(apiConfigs).forEach(([type, config]) => {
    if (merged[type]) {
      merged[type] = {
        ...merged[type],
        ...config,
        colors: {
          ...merged[type].colors,
          ...(config?.colors ?? {}),
        },
        fields: config?.fields ?? merged[type].fields,
      };
    } else {
      // New entity type from API
      merged[type] = config as EntityConfig;
    }
  });
  return merged;
});

// ─────────────────────────────────────────────────
// Derived stores from registry
// ─────────────────────────────────────────────────

/** All registered entity type keys */
export const $registeredEntityTypes = $entityRegistry.map(
  registry => Object.keys(registry) as string[]
);

/** Get config for a specific entity type (use with combine or .map) */
export const $entityConfigMap = $entityRegistry;

// ─────────────────────────────────────────────────
// Active entity types (what's visible on the map)
// ─────────────────────────────────────────────────

/**
 * Currently active entity types visible on the map.
 * Default: only schools (to preserve current behavior).
 */
export const changeActiveEntityTypes = createEvent<EntityType[]>();
export const setActiveEntityTypes = changeActiveEntityTypes; // alias for route model sync
export const $activeEntityTypes = createStore<EntityType[]>(['school']);
$activeEntityTypes.on(changeActiveEntityTypes, setPayload);

/**
 * Toggle a single entity type on/off in the active list.
 */
export const toggleEntityType = createEvent<EntityType>();
$activeEntityTypes.on(toggleEntityType, (current, entityType) => {
  if (current.includes(entityType)) {
    if (current.length <= 1) return current;
    return current.filter(t => t !== entityType);
  }
  return [...current, entityType];
});

/**
 * Select all registered entity types at once.
 */
export const selectAllEntityTypes = createEvent();
$activeEntityTypes.on(selectAllEntityTypes, () => {
  const registry = $entityRegistry.getState();
  return Object.keys(registry) as EntityType[];
});

// ─────────────────────────────────────────────────
// Selected entity type (for sidebar, filters, stats)
// ─────────────────────────────────────────────────

export const changeSelectedEntityType = createEvent<EntityType>();
export const $selectedEntityType = createStore<EntityType>('school');
$selectedEntityType.on(changeSelectedEntityType, setPayload);

// ─────────────────────────────────────────────────
// Entity popup data (for new entities only)
// ─────────────────────────────────────────────────

/**
 * Data store for new entity popup (health, postoffice, etc.).
 * Schools use their existing $schoolClickData in map.model.ts.
 */
export type EntityPopupData = {
  entityType: EntityType;
  data: BaseEntity | null;
  statistics?: EntityStatistics;
} | null;

export const setEntityPopupData = createEvent<EntityPopupData>();
export const $entityPopupData = createStore<EntityPopupData>(null);
$entityPopupData.on(setEntityPopupData, setPayload);

// ─────────────────────────────────────────────────
// Loading state
// ─────────────────────────────────────────────────

export const setEntityLoading = createEvent<boolean>();
export const $entityLoading = createStore<boolean>(false);
$entityLoading.on(setEntityLoading, setPayload);

// ─────────────────────────────────────────────────
// Derived / computed stores
// ─────────────────────────────────────────────────

/** Config for the currently selected entity type */
export const $selectedEntityConfig = combine(
  $entityRegistry,
  $selectedEntityType,
  (registry, selectedType) => registry[selectedType] ?? null
);

/** Check if a specific entity type is active on the map */
export const $isSchoolActive = $activeEntityTypes.map(types => types.includes('school'));
export const $isHealthActive = $activeEntityTypes.map(types => types.includes('health'));

/** Check if we're in multi-entity view mode */
export const $isMultiEntityView = $activeEntityTypes.map(types => types.length > 1);

/** Configs for all currently active entity types */
export const $activeEntityConfigs = combine(
  $entityRegistry,
  $activeEntityTypes,
  (registry, activeTypes) => activeTypes
    .map(type => registry[type])
    .filter(Boolean) as EntityConfig[]
);
