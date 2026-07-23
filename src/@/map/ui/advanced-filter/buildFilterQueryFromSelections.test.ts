import { EntityType } from '~/@/entities';
import type { ActiveFilterListType, AdvanceFilterType } from '~/api/types';

import {
  buildActiveEntityFilterUrl,
  buildFilterQueryFromSelections,
} from './buildFilterQueryFromSelections';

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
    expect(url.searchParams.get('entity')).toBe('school,health');
    expect(url.searchParams.get('global')).toBe('0');
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

  it('removes entity selection params in all-entities mode', () => {
    window.history.replaceState(
      {},
      '',
      '/map/country/test?entity=health&global=0',
    );

    const result = buildFilterQueryFromSelections(
      [],
      [],
      [EntityType.SCHOOL, EntityType.HEALTH],
      true,
    );

    const url = new URL(result, window.location.origin);
    expect(url.searchParams.has('entity')).toBe(false);
    expect(url.searchParams.has('global')).toBe(false);
  });

  it('removes filters belonging to inactive entities', () => {
    window.history.replaceState(
      {},
      '',
      '/map/country/test?filter__school__environment__iexact=urban&filter__health__ownership__iexact=public',
    );

    const result = buildActiveEntityFilterUrl([EntityType.SCHOOL], false);
    const url = new URL(result, window.location.origin);

    expect(url.searchParams.get('filter__school__environment__iexact')).toBe(
      'urban',
    );
    expect(
      url.searchParams.has('filter__health__ownership__iexact'),
    ).toBe(false);
    expect(url.searchParams.get('entity')).toBe('school');
  });
});
