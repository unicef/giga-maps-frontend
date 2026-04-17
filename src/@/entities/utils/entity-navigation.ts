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
 * Navigate to a specific entity detail view using /map/view.
 */
export const navigateToEntity = (
  entityType: EntityType,
  country: string
): void => {
  router.navigate(
    `/map/view?entity=${entityType}&country=${country.toLowerCase()}`
  );
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
