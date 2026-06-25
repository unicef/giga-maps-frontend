import { router } from '~/core/routes';
import type { EntityType } from '~/@/entities/types/base-entity.type';

/**
 * Build a URL with `?entity=` param preserving existing query params.
 */
export const buildEntityUrl = (
  basePath: string,
  entityTypes: string[],
  extraParams?: Record<string, string>
): string => {
  const params = new URLSearchParams(extraParams);
  if (entityTypes.length > 0) {
    params.set('entity', entityTypes.join(','));
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

/**
 * Navigate to a specific entity detail view using /map/entity/.
 */
export const navigateToEntity = (
  entityType: EntityType,
  country: string,
  entityId?: number | string,
): void => {
  const params = new URLSearchParams({
    country: country.toLowerCase(),
  });

  if (entityId !== undefined && entityId !== null) {
    params.set(`${entityType}_ids`, String(entityId));
  }

  router.navigate(`/map/entity/?${params.toString()}`);
};

/**
 * Navigate to a school (legacy route preserved).
 */
export const navigateToSchool = (
  schoolId: number | string,
  country: string
): void => {
  router.navigate(
    `/map/schools?country=${country.toLowerCase()}&school_ids=${schoolId}`
  );
};
