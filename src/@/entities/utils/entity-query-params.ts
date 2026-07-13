import type { EntityType } from '../types/base-entity.type';

export const ALL_ENTITY_TYPES_CODE = 'all';
export const ENTITY_TYPE_CODE_PARAM = 'entity_type__code';

export const getEntityTypeCodeParam = (
  activeEntityTypes: EntityType[] = [],
  allEntityTypes: EntityType[] = [],
): string => {
  if (!activeEntityTypes.length) {
    return ALL_ENTITY_TYPES_CODE;
  }

  const selectedEntityTypes = allEntityTypes.length
    ? allEntityTypes.filter((entityType) =>
      activeEntityTypes.includes(entityType),
    )
    : activeEntityTypes;
  const allEntitiesSelected =
    Boolean(allEntityTypes.length) &&
    selectedEntityTypes.length === allEntityTypes.length;

  if (allEntitiesSelected) {
    return ALL_ENTITY_TYPES_CODE;
  }

  return selectedEntityTypes.join(',');
};

export const addEntityTypeCodeParam = (
  params: URLSearchParams,
  activeEntityTypes: EntityType[] = [],
  allEntityTypes: EntityType[] = [],
) => {
  params.set(
    ENTITY_TYPE_CODE_PARAM,
    getEntityTypeCodeParam(activeEntityTypes, allEntityTypes),
  );
  return params;
};
