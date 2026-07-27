import { EntityType } from '~/@/entities';
import { getEntityTypeCodeParam } from '~/@/entities/utils/entity-query-params';

import {
  deleteAdvancedFiltersForEntities,
  deleteAllAdvancedFilters,
  getEntityTypesNeedingDefaultFilters,
  parseAdvancedFilters,
  selectAdvancedFiltersForEntities,
} from './advanced-filter.model';

describe('advanced filter entity state', () => {
  const search =
    'filter__school__environment__iexact=urban' +
    '&filter__health__ownership__iexact=public' +
    '&filter__ignore_health__ownership__iexact=Public';

  it('stores every URL filter by entity and selects only active API params', () => {
    const filtersByEntity = parseAdvancedFilters(search);

    expect(Object.keys(filtersByEntity[EntityType.SCHOOL])).toEqual([
      'school__environment__iexact',
    ]);
    expect(Object.keys(filtersByEntity[EntityType.HEALTH])).toEqual([
      'health__ownership__iexact',
      'ignore_health__ownership__iexact',
    ]);

    const healthFilters = selectAdvancedFiltersForEntities(filtersByEntity, [
      EntityType.HEALTH,
    ]);
    expect(healthFilters.searchParams).toBe('health__ownership__iexact=public');
    expect(healthFilters.selectedCount).toBe(1);
    expect(healthFilters.urlFieldList).not.toHaveProperty(
      'school__environment__iexact',
    );

    const allFilters = selectAdvancedFiltersForEntities(filtersByEntity, [
      EntityType.SCHOOL,
      EntityType.HEALTH,
    ]);
    expect(allFilters.selectedCount).toBe(2);
    expect(allFilters.searchParams).toContain(
      'school__environment__iexact=urban',
    );
    expect(allFilters.searchParams).toContain(
      'health__ownership__iexact=public',
    );
    expect(allFilters.searchParams).not.toContain('ignore_');
  });

  it('keeps the API entity scope aligned with School, Health, and All Facilities', () => {
    const allEntityTypes = [EntityType.SCHOOL, EntityType.HEALTH];

    expect(
      getEntityTypeCodeParam([EntityType.SCHOOL], allEntityTypes),
    ).toBe(EntityType.SCHOOL);
    expect(
      getEntityTypeCodeParam([EntityType.HEALTH], allEntityTypes),
    ).toBe(EntityType.HEALTH);
    expect(getEntityTypeCodeParam(allEntityTypes, allEntityTypes)).toBe('all');
  });

  it('normalizes none-range and legacy grouped-choice URL keys for the UI', () => {
    const filtersByEntity = parseAdvancedFilters(
      'filter__school__teachers__none__range=1%2C5' +
        '&filter__health__ignore_ownership__iexact=Public',
    );

    expect(filtersByEntity.school.school__teachers__range).toMatchObject({
      apiKey: 'school__teachers__none_range',
      filter: 'none_range',
      value: '1,5',
    });
    expect(
      filtersByEntity.health.ignore_health__ownership__iexact,
    ).toMatchObject({
      entity: 'health',
      isIgnore: true,
      key: 'ignore_health__ownership__iexact',
    });
  });

  it('clears only active entity params and retains inactive entity params', () => {
    const params = new URLSearchParams(search);

    deleteAdvancedFiltersForEntities(params, [EntityType.HEALTH]);

    expect(params.get('filter__school__environment__iexact')).toBe('urban');
    expect(params.has('filter__health__ownership__iexact')).toBe(false);
    expect(params.has('filter__ignore_health__ownership__iexact')).toBe(false);
  });

  it('clears all entity filters when the country changes', () => {
    const params = new URLSearchParams(`${search}&language=en`);

    deleteAllAdvancedFilters(params);

    expect(params.toString()).toBe('language=en');
  });

  it('applies defaults only to missing, non-reset active entities', () => {
    const filtersByEntity = parseAdvancedFilters(search);

    expect(
      getEntityTypesNeedingDefaultFilters(
        filtersByEntity,
        [EntityType.SCHOOL, EntityType.HEALTH],
        [],
      ),
    ).toEqual([]);

    expect(
      getEntityTypesNeedingDefaultFilters(
        parseAdvancedFilters('filter__health__ownership__iexact=public'),
        [EntityType.SCHOOL, EntityType.HEALTH],
        [],
      ),
    ).toEqual([EntityType.SCHOOL]);

    expect(
      getEntityTypesNeedingDefaultFilters(
        {},
        [EntityType.HEALTH],
        [EntityType.HEALTH],
      ),
    ).toEqual([]);
  });
});
