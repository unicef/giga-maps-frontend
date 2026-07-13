import { EntityType } from '../types/base-entity.type';

interface LayerWithEntityCode {
  entity_type__code?: string;
}

/**
 * Checks if a layer is applicable to a specific entity type.
 * Returns true if the layer has no specific entity type code,
 * or if it matches the target entity type.
 */
export const isLayerForEntity = (
  layer: LayerWithEntityCode,
  entityType: EntityType,
): boolean => {
  return (
    !layer.entity_type__code ||
    layer.entity_type__code.toLowerCase() === String(entityType)
  );
};

/**
 * Gets a value from an entity-mapped record, falling back to a default value if not found.
 */
export const getEntityMapValue = <T>(
  values: Partial<Record<EntityType, T>>,
  entityType: EntityType,
  fallback: T,
): T => {
  return Object.prototype.hasOwnProperty.call(values, entityType)
    ? (values[entityType] as T)
    : fallback;
};

/**
 * Formats the entity type for display labels (e.g. 'school' -> 'School').
 */
export const formatEntityTypeLabel = (entityType: EntityType): string =>
  `${entityType.charAt(0).toUpperCase()}${entityType.slice(1)}`;

/**
 * Resolves the list of entity types associated with a given layer.
 * Uses activeEntityTypes when no specific entity type is defined on the layer.
 */
export const getLayerEntityTypes = (
  layer: LayerWithEntityCode,
  activeEntityTypes: EntityType[],
): EntityType[] => {
  if (layer.entity_type__code) {
    return [layer.entity_type__code.toLowerCase() as EntityType];
  }
  return activeEntityTypes;
};
