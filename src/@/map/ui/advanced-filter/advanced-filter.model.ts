import { createEvent, createStore } from 'effector';

import type { ActiveFilterListType, AdvanceFilterType } from '~/api/types';

export const ADVANCED_FILTER_PREFIX = 'filter__';

export type AdvancedFilterUrlField = {
  apiKey: string;
  entity: string;
  field: string;
  filter: string;
  isIgnore: boolean;
  key: string;
  urlKey: string;
  value: string;
};

export type AdvancedFiltersByEntity = Record<
  string,
  Record<string, AdvancedFilterUrlField>
>;

type ParsedAdvancedFilterKey = Omit<AdvancedFilterUrlField, 'value'>;

const IGNORE_PREFIX = 'ignore_';
const NONE_FILTER_PREFIX = 'none_';

export function parseAdvancedFilterKey(
  urlKey: string,
): ParsedAdvancedFilterKey | null {
  if (!urlKey.startsWith(ADVANCED_FILTER_PREFIX)) return null;

  const [rawEntity, rawField, ...rawFilterParts] = urlKey
    .slice(ADVANCED_FILTER_PREFIX.length)
    .split('__');

  if (!rawEntity || !rawField || rawFilterParts.length === 0) return null;

  const entityHasIgnorePrefix = rawEntity.startsWith(IGNORE_PREFIX);
  const fieldHasIgnorePrefix = rawField.startsWith(IGNORE_PREFIX);
  const isIgnore = entityHasIgnorePrefix || fieldHasIgnorePrefix;
  const entity = entityHasIgnorePrefix
    ? rawEntity.slice(IGNORE_PREFIX.length)
    : rawEntity;
  const field = fieldHasIgnorePrefix
    ? rawField.slice(IGNORE_PREFIX.length)
    : rawField;
  const filter = rawFilterParts.join('_');
  const uiFilter = filter.startsWith(NONE_FILTER_PREFIX)
    ? filter.slice(NONE_FILTER_PREFIX.length)
    : filter;
  const key = `${isIgnore ? IGNORE_PREFIX : ''}${entity}__${field}__${uiFilter}`;

  return {
    apiKey: `${entity}__${field}__${filter}`,
    entity,
    field,
    filter,
    isIgnore,
    key,
    urlKey,
  };
}

export function parseAdvancedFilters(
  search: string | URLSearchParams,
): AdvancedFiltersByEntity {
  const params =
    typeof search === 'string' ? new URLSearchParams(search) : search;
  const filtersByEntity: AdvancedFiltersByEntity = {};

  for (const [urlKey, value] of params) {
    const parsedKey = parseAdvancedFilterKey(urlKey);
    if (!parsedKey) continue;

    filtersByEntity[parsedKey.entity] ??= {};
    filtersByEntity[parsedKey.entity][parsedKey.key] = {
      ...parsedKey,
      value,
    };
  }

  return filtersByEntity;
}

export function selectAdvancedFiltersForEntities(
  filtersByEntity: AdvancedFiltersByEntity,
  entityTypes: string[],
) {
  const filterSearchParams = new URLSearchParams();
  const urlFieldList: Record<string, AdvancedFilterUrlField> = {};
  let selectedCount = 0;

  entityTypes.forEach((entityType) => {
    Object.values(filtersByEntity[entityType] ?? {}).forEach((field) => {
      urlFieldList[field.key] = field;
      if (field.isIgnore) return;

      filterSearchParams.set(field.apiKey, field.value);
      // Count each multiselect choice (pipe-delimited) as its own selection,
      // matching chip counts in the Filters panel — not one per filter field.
      const choiceCount = String(field.value ?? '')
        .split('|')
        .filter(Boolean).length;
      selectedCount += Math.max(choiceCount, 1);
    });
  });

  return {
    searchParams: filterSearchParams.toString(),
    selectedCount,
    urlFieldList,
  };
}

export function deleteAdvancedFiltersForEntities(
  params: URLSearchParams,
  entityTypes: string[],
) {
  const entityTypeSet = new Set(entityTypes);

  for (const key of Array.from(params.keys())) {
    const parsedKey = parseAdvancedFilterKey(key);
    if (parsedKey && entityTypeSet.has(parsedKey.entity)) {
      params.delete(key);
    }
  }
}

export function deleteAllAdvancedFilters(params: URLSearchParams) {
  for (const key of Array.from(params.keys())) {
    if (parseAdvancedFilterKey(key)) {
      params.delete(key);
    }
  }
}

export function getEntityTypesNeedingDefaultFilters(
  filtersByEntity: AdvancedFiltersByEntity,
  activeEntityTypes: string[],
  suppressedEntityTypes: string[],
) {
  const suppressedEntityTypeSet = new Set(suppressedEntityTypes);

  return activeEntityTypes.filter((entityType) => {
    if (suppressedEntityTypeSet.has(entityType)) return false;

    return !Object.values(filtersByEntity[entityType] ?? {}).some(
      (field) => !field.isIgnore,
    );
  });
}

const hasDefaultFilterValue = (
  selection: ActiveFilterListType,
  filter: AdvanceFilterType,
) => {
  const raw = selection.default_filter_values?.values;
  if (raw == null) return false;

  if (filter.type === 'RANGE') {
    return (
      typeof raw === 'object' &&
      !Array.isArray(raw) &&
      Object.prototype.hasOwnProperty.call(raw, 'min')
    );
  }

  if (Array.isArray(raw)) {
    return raw.some((value) => String(value).trim().length > 0);
  }
  if (typeof raw === 'string') return raw.trim().length > 0;

  return true;
};

export function getEntityTypesNeedingCountryDefaultFilters(
  selections: ActiveFilterListType[],
  filters: AdvanceFilterType[],
  filtersByEntity: AdvancedFiltersByEntity,
  activeEntityTypes: string[],
  suppressedEntityTypes: string[],
) {
  const missingEntityTypes = getEntityTypesNeedingDefaultFilters(
    filtersByEntity,
    activeEntityTypes,
    suppressedEntityTypes,
  );
  const missingEntityTypeSet = new Set(missingEntityTypes);
  const filtersById = new Map(filters.map((filter) => [filter.id, filter]));
  const entitiesWithDefaults = new Set<string>();

  selections.forEach((selection) => {
    const filter = filtersById.get(selection.advance_filter_id);
    if (
      filter &&
      missingEntityTypeSet.has(filter.entity_type) &&
      hasDefaultFilterValue(selection, filter)
    ) {
      entitiesWithDefaults.add(filter.entity_type);
    }
  });

  return missingEntityTypes.filter((entityType) =>
    entitiesWithDefaults.has(entityType),
  );
}

export const suppressDefaultAdvancedFilters = createEvent<string[]>();
export const clearDefaultAdvancedFilterSuppression = createEvent();

export const $defaultAdvancedFilterSuppressedEntityTypes = createStore<
  string[]
>([])
  .on(suppressDefaultAdvancedFilters, (current, entityTypes) => [
    ...new Set([...current, ...entityTypes]),
  ])
  .reset(clearDefaultAdvancedFilterSuppression);
