/**
 * Entity type enum and union types for runtime and compile-time entity identification.
 */
import type { SchoolEntityType } from './school-entity.type';
import type { HealthFacilityType } from './health-entity.type';
import type { BaseEntity, EntityType } from './base-entity.type';

/**
 * Discriminated union of all concrete entity types.
 * Use this when you need to handle entity-specific logic.
 */
export type AnyEntityType = SchoolEntityType | HealthFacilityType;

/**
 * Array of all supported entity type strings.
 * Used for iteration and validation.
 */
export const ENTITY_TYPES: EntityType[] = ['school', 'health'];

/**
 * Check if a string is a valid entity type.
 */
export const isValidEntityType = (type: string): type is EntityType => {
  return ENTITY_TYPES.includes(type as EntityType);
};

// Re-export for convenience
export type { EntityType, BaseEntity };
export type { SchoolEntityType } from './school-entity.type';
export type { SchoolStatistics } from './school-entity.type';
export type { HealthFacilityType } from './health-entity.type';
export type { EntityStatistics, EntityInfoType } from './base-entity.type';
