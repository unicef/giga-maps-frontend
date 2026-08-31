import { combine, createEvent, createStore } from 'effector';

import { setPayload } from '~/lib/effector-kit';

import type { EntityConfig } from '../config/entity-config.types';
import { DEFAULT_ENTITY_REGISTRY } from '../config/entity-registry';
import {
  BaseEntity,
  EntityStatistics,
  EntityType,
} from '../types/base-entity.type';

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
export const mergeEntityRegistryFromApi =
  createEvent<Partial<Record<string, Partial<EntityConfig>>>>();

export const $entityRegistry = createStore<Record<string, EntityConfig>>({
  ...DEFAULT_ENTITY_REGISTRY,
});

/** Registry filtered to only active entities (from config.active flag), in registry order */
export const $entityRegistryFiltered = $entityRegistry.map((registry) => {
  const entries = Object.entries(registry).filter(
    ([, config]) => config.visible,
  );
  return Object.fromEntries(entries) as Record<EntityType, EntityConfig>;
});

/** Active entity types in registry order (based on config.active flag) */
export const $entityTypesFiltered = $entityRegistry.map((registry) => {
  return Object.entries(registry)
    .filter(([, config]) => config.visible)
    .map(([type]) => type as EntityType);
});

// Full replacement (e.g., reset)
$entityRegistry.on(updateEntityRegistry, (_, payload) => payload);

// Merge from API — API data overrides defaults, new types get added
$entityRegistry.on(mergeEntityRegistryFromApi, (current, apiConfigs) => {
  if (!apiConfigs) return current;
  const merged = { ...current };
  Object.entries(apiConfigs).forEach(([type, config]) => {
    if (merged[type]) {
      const defaults = DEFAULT_ENTITY_REGISTRY[type as EntityType];
      merged[type] = {
        ...merged[type],
        ...config,
        // Keep local naming so API "Health centers" cannot override UI copy
        displayName: defaults?.displayName ?? config?.displayName ?? merged[type].displayName,
        slug: defaults?.slug ?? config?.slug ?? merged[type].slug,
        mapAnimation: config?.mapAnimation
          ? {
            ...merged[type].mapAnimation,
            ...config.mapAnimation,
          }
          : merged[type].mapAnimation,
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
export const $registeredEntityTypes = $entityRegistry.map((registry) =>
  Object.keys(registry),
);

/** Get config for a specific entity type (use with combine or .map) */
export const $entityConfigMap = $entityRegistry;

// ─────────────────────────────────────────────────
// Active entity types (what's visible on the map)
// ─────────────────────────────────────────────────

/**
 * Currently active entity types visible on the map.
 * The set is never empty; callers must provide at least one explicit entity.
 */
export const changeActiveEntityTypes = createEvent<EntityType[]>();
export const setActiveEntityTypes = changeActiveEntityTypes; // alias for route model sync
export const $activeEntityTypes = createStore<EntityType[]>([
  EntityType.HEALTH,
  EntityType.SCHOOL,
]);
$activeEntityTypes.on(changeActiveEntityTypes, (current, next) =>
  next.length ? next : current,
);

/**
 * Toggle a single entity type on/off in the active list.
 */
export const toggleEntityType = createEvent<EntityType>();

$activeEntityTypes.on(toggleEntityType, (current, entityType) => {
  if (current.includes(entityType)) {
    if (current.length <= 1) return current;
    return current.filter((t) => t !== entityType);
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
// Global Mode (Selection state)
// ─────────────────────────────────────────────────

/**
 * Tracks if the user is in "Global" selection mode (clicked "All Entities").
 * In this mode, individual button highlights are suppressed.
 */
export const $isGlobalMode = createStore<boolean>(true);
export const setGlobalMode = createEvent<boolean>();

$isGlobalMode
  .on(setGlobalMode, (_, payload) => payload)
  .on(selectAllEntityTypes, () => true)
  .on(changeActiveEntityTypes, () => false)
  .on(toggleEntityType, () => false);

// ─────────────────────────────────────────────────
// Loading state
// ─────────────────────────────────────────────────

export const setEntityLoading = createEvent<boolean>();
export const $entityLoading = createStore<boolean>(false);
$entityLoading.on(setEntityLoading, setPayload);

// ─────────────────────────────────────────────────
// Derived / computed stores
// ─────────────────────────────────────────────────

/** Check if a specific entity type is active on the map */
export const $isSchoolActive = $activeEntityTypes.map((types) =>
  types.includes(EntityType.SCHOOL),
);
export const $isHealthActive = $activeEntityTypes.map((types) =>
  types.includes(EntityType.HEALTH),
);

/** Check if we're in multi-entity view mode */
export const $isMultiEntityView = $activeEntityTypes.map(
  (types) => types.length > 1,
);

/** Configs for all currently active entity types */
export const $activeEntityConfigs = combine(
  $entityRegistry,
  $activeEntityTypes,
  (registry, activeTypes) =>
    activeTypes
      .map((type) => registry[type])
      .filter((config): config is EntityConfig => Boolean(config)),
);
