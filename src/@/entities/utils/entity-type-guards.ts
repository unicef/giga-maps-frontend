import { BaseEntity, EntityType } from '../types/base-entity.type';
import type { SchoolEntityType } from '../types/school-entity.type';
import type { HealthFacilityType } from '../types/health-entity.type';
import type { AnyEntityType } from '../types/entity-types';
import { isValidEntityType } from '../types/entity-types';

/**
 * Runtime type guards for entity type checking.
 * Uses the `entity_type` discriminator field for safe narrowing.
 */

/**
 * Check if an object conforms to the BaseEntity interface.
 */
export const isBaseEntity = (data: unknown): data is BaseEntity => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.entity_type === 'string' &&
    isValidEntityType(obj.entity_type as string)
  );
};

/**
 * Check if an entity is a School entity.
 */
export const isSchoolEntity = (entity: BaseEntity): entity is SchoolEntityType => {
  return entity.entity_type === EntityType.SCHOOL;
};

/**
 * Check if an entity is a Health Facility entity.
 */
export const isHealthEntity = (entity: BaseEntity): entity is HealthFacilityType => {
  return entity.entity_type === EntityType.HEALTH;
};

/**
 * Narrow an entity to a specific type.
 * Returns the entity cast to the specific type, or null if types don't match.
 */
export const narrowEntityType = <T extends AnyEntityType>(
  entity: BaseEntity,
  entityType: EntityType
): T | null => {
  if (entity.entity_type === entityType) {
    return entity as unknown as T;
  }
  return null;
};
