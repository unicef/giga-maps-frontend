import type { EntityConfig } from '../config/entity-config.types';

/**
 * Entity resolver — pure utility functions that accept registry as a parameter.
 *
 * Since the entity registry is now an Effector store ($entityRegistry),
 * these functions take the registry as input instead of reading from
 * a mutable variable. Use with $entityRegistry.getState() or inside
 * combine/sample blocks.
 */

/**
 * Get configuration for a specific entity type from a registry.
 */
export const getEntityConfig = (
  registry: Record<string, EntityConfig>,
  entityType: string
): EntityConfig | undefined => {
  return registry[entityType];
};

/**
 * Check if an entity type should use legacy API (e.g., schools).
 */
export const isLegacyEntity = (
  registry: Record<string, EntityConfig>,
  entityType: string
): boolean => {
  const config = registry[entityType];
  return config?.useLegacyApi ?? false;
};

/**
 * Get the API endpoint for an entity type.
 * Returns null for legacy entities (they use their own API functions).
 */
export const getEntityApiEndpoint = (
  registry: Record<string, EntityConfig>,
  entityType: string
): string | null => {
  const config = registry[entityType];
  if (!config || config.useLegacyApi) return null;
  return config.apiEndpoint;
};

/**
 * Get the marker type for an entity.
 */
export const getEntityMarkerType = (
  registry: Record<string, EntityConfig>,
  entityType: string
): 'circle' | 'symbol' => {
  const config = registry[entityType];
  return config?.markerType ?? 'circle';
};

/**
 * Get fields configured for popup display.
 */
export const getPopupFields = (
  registry: Record<string, EntityConfig>,
  entityType: string
) => {
  const config = registry[entityType];
  return config?.fields.filter(f => f.showInPopup) ?? [];
};

/**
 * Get fields configured for sidebar display.
 */
export const getSidebarFields = (
  registry: Record<string, EntityConfig>,
  entityType: string
) => {
  const config = registry[entityType];
  return config?.fields.filter(f => f.showInSidebar) ?? [];
};

/**
 * Get all non-legacy entity types (those using the new generic API).
 */
export const getNewEntityTypes = (registry: Record<string, EntityConfig>): string[] => {
  return Object.keys(registry).filter(type => !registry[type].useLegacyApi);
};

/**
 * Get all legacy entity types.
 */
export const getLegacyEntityTypes = (registry: Record<string, EntityConfig>): string[] => {
  return Object.keys(registry).filter(type => registry[type].useLegacyApi);
};
