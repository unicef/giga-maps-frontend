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
 * Navigate to a specific non-school entity using /map/entities.
 */
export const navigateToEntity = (
  entityType: EntityType,
  entityId: number | string,
  country: string
): void => {
  router.navigate(
    `/map/entities?entity=${entityType}&entity_id=${entityId}&country=${country.toLowerCase()}`
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

/**
 * Update the ?entity= query param in the current URL without changing the path.
 * Uses history.replace to avoid extra history entries.
 */
export const updateEntityUrlParam = (entityTypes: string[]): void => {
  const url = new URL(window.location.href);
  if (entityTypes.length > 0) {
    url.searchParams.set('entity', entityTypes.join(','));
  } else {
    url.searchParams.delete('entity');
  }
  const newPath = url.pathname + url.search;
  router.history.replace(newPath);
};
