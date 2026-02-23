/**
 * Entity System — Public API
 *
 * Import from '~/@/entities' to access entity types, configuration, and utilities.
 */

// Types
export type { EntityType, BaseEntity, EntityStatistics, EntityInfoType } from './types/base-entity.type';
export type { AnyEntityType } from './types/entity-types';
export type { SchoolEntityType, SchoolStatistics } from './types/school-entity.type';
export type { HealthFacilityType } from './types/health-entity.type';
export { ENTITY_TYPES, isValidEntityType } from './types/entity-types';

// Config
export type { EntityConfig, EntityFieldConfig, MarkerType } from './config/entity-config.types';
export { DEFAULT_ENTITY_REGISTRY } from './config/entity-registry';

// Utils
export {
  getEntityConfig,
  isLegacyEntity,
  getEntityApiEndpoint,
  getEntityMarkerType,
  getPopupFields,
  getSidebarFields,
  getNewEntityTypes,
  getLegacyEntityTypes,
} from './utils/entity-resolver';

export {
  isBaseEntity,
  isSchoolEntity,
  isHealthEntity,
  narrowEntityType,
} from './utils/entity-type-guards';

// Models (Effector stores)
export {
  // Registry store
  $entityRegistry,
  updateEntityRegistry,
  mergeEntityRegistryFromApi,
  $registeredEntityTypes,
  $entityConfigMap,
  // Active entity types
  $activeEntityTypes,
  changeActiveEntityTypes,
  toggleEntityType,
  // Selected entity type
  $selectedEntityType,
  changeSelectedEntityType,
  $selectedEntityConfig,
  // Popup data
  $entityPopupData,
  setEntityPopupData,
  // Loading
  $entityLoading,
  setEntityLoading,
  // Computed
  $isSchoolActive,
  $isHealthActive,
  $isMultiEntityView,
  $activeEntityConfigs,
} from './models/entity.model';
export type { EntityPopupData } from './models/entity.model';
