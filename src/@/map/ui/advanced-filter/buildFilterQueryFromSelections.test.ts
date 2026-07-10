import { EntityType } from '~/@/entities';
import type { ActiveFilterListType, AdvanceFilterType } from '~/api/types';

import { buildFilterQueryFromSelections } from './buildFilterQueryFromSelections';

const createFilter = (
  id: number,
  entityType: EntityType,
  name: string,
): AdvanceFilterType =>
  ({
    id,
    entity_type: entityType,
    type: 'INPUT',
    column_configuration: { name },
    query_param_filter: 'iexact',
  }) as AdvanceFilterType;

const createSelection = (
  advanceFilterId: number,
  value: string,
): ActiveFilterListType =>
  ({
    advance_filter_id: advanceFilterId,
    default_filter_values: { values: value },
  }) as ActiveFilterListType;

describe('buildFilterQueryFromSelections', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/map/country/test?language=en');
  });

  it('adds default filters for every active entity type', () => {
    const result = buildFilterQueryFromSelections(
      [createSelection(1, 'urban'), createSelection(2, 'public')],
      [
        createFilter(1, EntityType.SCHOOL, 'environment'),
        createFilter(2, EntityType.HEALTH, 'ownership'),
      ],
      [EntityType.SCHOOL, EntityType.HEALTH],
    );

    const url = new URL(result, window.location.origin);
    expect(url.searchParams.get('filter__school__environment__iexact')).toBe(
      'urban',
    );
    expect(url.searchParams.get('filter__health__ownership__iexact')).toBe(
      'public',
    );
    expect(url.searchParams.get('language')).toBe('en');
  });

  it('does not add defaults for inactive entity types', () => {
    const result = buildFilterQueryFromSelections(
      [createSelection(1, 'urban'), createSelection(2, 'public')],
      [
        createFilter(1, EntityType.SCHOOL, 'environment'),
        createFilter(2, EntityType.HEALTH, 'ownership'),
      ],
      [EntityType.HEALTH],
    );

    const url = new URL(result, window.location.origin);
    expect(
      url.searchParams.has('filter__school__environment__iexact'),
    ).toBe(false);
    expect(url.searchParams.get('filter__health__ownership__iexact')).toBe(
      'public',
    );
  });
});
