import { BaseEntity } from './base-entity.type';

/**
 * Health facility entity type extending BaseEntity.
 * Health entities use the new generic entity API (useLegacyApi: false).
 *
 * Only define fields we KNOW will exist.
 * Additional fields from the backend are handled dynamically
 * via the entity registry's field configuration.
 */
export interface HealthFacilityType extends BaseEntity {
  entity_type: 'health';
  /** Additional entity-specific fields come from backend — accessed dynamically */
  [key: string]: unknown;
}
