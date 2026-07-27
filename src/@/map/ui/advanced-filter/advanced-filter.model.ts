import { createEvent, createStore } from 'effector';

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
      selectedCount += 1;
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

export const suppressDefaultAdvancedFilters = createEvent<string[]>();
export const clearDefaultAdvancedFilterSuppression = createEvent();

export const $defaultAdvancedFilterSuppressedEntityTypes = createStore<
  string[]
>([])
  .on(suppressDefaultAdvancedFilters, (current, entityTypes) => [
    ...new Set([...current, ...entityTypes]),
  ])
  .reset(clearDefaultAdvancedFilterSuppression);
