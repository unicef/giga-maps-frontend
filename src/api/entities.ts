import { createRequestFx } from '~/lib/request-fx';
import type { Controller } from '~/lib/request-fx/types';
import { request } from './request-setup';
import { $entityRegistry, mergeEntityRegistryFromApi } from '~/@/entities/models/entity.model';
import type { BaseEntity } from '~/@/entities/types/base-entity.type';
import type { EntityConfig } from '~/@/entities/config/entity-config.types';

/**
 * Generic entity API service.
 *
 * These functions are used ONLY for new entity types (health, postoffice, etc.)
 * where useLegacyApi is false in the entity registry.
 *
 * Schools do NOT use these functions — they continue using
 * fetchSchoolPopupDataFx and other functions in project-connect.ts.
 */

/**
 * Fetch entity popup/detail data for a single entity.
 * Reads API endpoint from the $entityRegistry store.
 */
export const fetchEntityPopupDataFx = createRequestFx(
  async (
    { entityType, entityId }: { entityType: string; entityId: number },
    controller?: Controller
  ): Promise<BaseEntity> => {
    const registry = $entityRegistry.getState();
    const config = registry[entityType];
    if (!config || !config.apiEndpoint) {
      throw new Error(`No API endpoint configured for entity type: ${entityType}`);
    }
    return request({
      url: `${config.apiEndpoint}${entityId}/`,
      signal: controller?.getSignal(),
    });
  }
);

/**
 * Fetch a list of entities for a given type with query parameters.
 */
export const fetchEntityListFx = createRequestFx(
  async (
    { entityType, query }: { entityType: string; query: string },
    controller?: Controller
  ): Promise<BaseEntity[]> => {
    const registry = $entityRegistry.getState();
    const config = registry[entityType];
    if (!config || !config.apiEndpoint) {
      throw new Error(`No API endpoint configured for entity type: ${entityType}`);
    }
    return request({
      url: `${config.apiEndpoint}${query}`,
      signal: controller?.getSignal(),
    });
  }
);

/**
 * Fetch statistics for an entity type (country-level, global, etc.).
 */
export const fetchEntityStatsFx = createRequestFx(
  async (
    { entityType, query }: { entityType: string; query: string },
    controller?: Controller
  ): Promise<Record<string, unknown>> => {
    const registry = $entityRegistry.getState();
    const config = registry[entityType];
    if (!config || !config.apiEndpoint) {
      throw new Error(`No API endpoint configured for entity type: ${entityType}`);
    }
    return request({
      url: `${config.apiEndpoint}statistics/${query}`,
      signal: controller?.getSignal(),
    });
  }
);

/**
 * Fetch entity registry configuration from API.
 * On success, merges response into the $entityRegistry store.
 * On failure (API not ready), defaults remain — no error thrown.
 */
export const fetchEntityRegistryFx = createRequestFx(
  async (_, controller?: Controller): Promise<Partial<Record<string, Partial<EntityConfig>>>> => {
    try {
      const response = await request({
        url: 'api/entities/registry/',
        signal: controller?.getSignal(),
      }) as Partial<Record<string, Partial<EntityConfig>>>;
      // Merge API config into the Effector store
      mergeEntityRegistryFromApi(response);
      return response;
    } catch {
      // API not available yet — defaults remain in store
      console.info('[Entity Registry] API not available, using default configuration.');
      return {};
    }
  }
);
