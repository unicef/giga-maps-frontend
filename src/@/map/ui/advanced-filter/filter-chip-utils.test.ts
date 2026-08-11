import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';

import type { AdvanceFilterType } from '~/api/types';
import { EntityType } from '~/@/entities/types/entity-types';

import {
  buildFilterChips,
  buildFilterChipsByEntity,
  getChoiceChipLabel,
  getVisibleChipCountForRows,
  widthsFitInRows,
} from './filter-chip-utils';

const t = ((key: string, options?: Record<string, unknown>) => {
  let value = String(options?.defaultValue ?? key);
  if (!options) return value;

  Object.entries(options).forEach(([optionKey, optionValue]) => {
    if (optionKey === 'defaultValue') return;
    value = value.replace(`{{${optionKey}}}`, String(optionValue));
  });
  return value;
}) as TFunction;

const createFilter = (
  overrides: Partial<AdvanceFilterType> = {},
): AdvanceFilterType => ({
  id: 1,
  name: 'Computer lab',
  type: 'DROPDOWN',
  description: '',
  entity_type: EntityType.SCHOOL,
  column_configuration: {
    name: 'computer_lab',
    label: 'Computer lab',
    type: 'string',
    table_name: 'school',
    table_alias: 'school',
    table_label: 'School',
  },
  options: {
    choices: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  query_param_filter: 'iexact',
  ...overrides,
});

describe('buildFilterChips', () => {
  it('uses selected option labels for single dropdown filters', () => {
    const item = createFilter();
    const itemKey = 'school__computer_lab__iexact';

    const chips = buildFilterChips(item, {
      [itemKey]: 'no',
    }, t);

    expect(chips).toEqual([{
      chipId: itemKey,
      itemKey,
      label: 'No computer lab',
    }]);
  });

  it('maps yes/no boolean choices to field-based labels from the design', () => {
    const item = createFilter({ type: 'BOOLEAN' });

    expect(getChoiceChipLabel(item, { label: 'Yes', value: 'true' }, t)).toBe('Computer lab');
    expect(getChoiceChipLabel(item, { label: 'No', value: 'false' }, t)).toBe('No computer lab');
    expect(getChoiceChipLabel(
      createFilter({ name: 'Education level' }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown education level');
  });

  it('keeps descriptive multiselect option labels unchanged', () => {
    expect(getChoiceChipLabel(
      createFilter({ name: 'Connectivity type', type: 'DROPDOWN_MULTISELECT' }),
      { label: 'Unknown education level', value: 'unknown' },
      t,
    )).toBe('Unknown education level');
  });

  it('creates one chip per selected multiselect value', () => {
    const item = createFilter({
      name: 'Connectivity type',
      type: 'DROPDOWN_MULTISELECT',
      column_configuration: {
        name: 'connectivity_type',
        label: 'Connectivity type',
        type: 'string',
        table_name: 'school',
        table_alias: 'school',
        table_label: 'School',
      },
      options: {
        choices: [
          { label: 'Fiber', value: 'fiber' },
          { label: '2G', value: '2g' },
        ],
      },
    });
    const itemKey = 'school__connectivity_type__iexact';

    const chips = buildFilterChips(item, {
      [itemKey]: 'fiber|2g',
    }, t);

    expect(chips).toEqual([
      {
        chipId: `${itemKey}__fiber`,
        itemKey,
        label: 'Fiber',
        removeValue: 'fiber',
      },
      {
        chipId: `${itemKey}__2g`,
        itemKey,
        label: '2G',
        removeValue: '2g',
      },
    ]);
  });

  it('dedupes case-variant coverage values like 2G and 2g', () => {
    const item = createFilter({
      name: 'Coverage type',
      type: 'DROPDOWN_MULTISELECT',
      column_configuration: {
        name: 'coverage_type',
        label: 'Coverage type',
        type: 'string',
        table_name: 'school',
        table_alias: 'school',
        table_label: 'School',
      },
      options: {
        choices: [
          { label: '2G', value: '2g' },
        ],
      },
      query_param_filter: 'in',
    });
    const itemKey = 'school__coverage_type__in';

    const chips = buildFilterChips(item, {
      [itemKey]: '2G|2g',
    }, t);

    expect(chips).toHaveLength(1);
    expect(chips[0].label).toBe('2G');
  });

  it('formats school number-of-computers ranges with School prefix', () => {
    const item = createFilter({
      name: 'Number of computers',
      type: 'RANGE',
      column_configuration: {
        name: 'num_computers',
        label: 'Number of computers',
        type: 'int',
        table_name: 'school',
        table_alias: 'school',
        table_label: 'School',
      },
      query_param_filter: 'range',
    });
    const itemKey = 'school__num_computers__range';

    const chips = buildFilterChips(item, {
      [itemKey]: { none_range: false, value: '1,266' },
    }, t);

    expect(chips).toEqual([{
      chipId: itemKey,
      itemKey,
      label: 'School: Number of computers (1–266)',
    }]);
  });

  it('maps unknown school area type to Unknown area type', () => {
    expect(getChoiceChipLabel(
      createFilter({
        name: 'School area type',
        column_configuration: {
          name: 'area_type',
          label: 'School area type',
          type: 'string',
          table_name: 'school',
          table_alias: 'school',
          table_label: 'School',
        },
      }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown area type');
  });

  it('maps unknown health facility choices to design labels', () => {
    expect(getChoiceChipLabel(
      createFilter({ name: 'Cold chain' }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown cold chain');

    expect(getChoiceChipLabel(
      createFilter({
        name: 'Cold chain available',
        column_configuration: {
          name: 'cold_chain_available',
          label: 'Cold chain available',
          type: 'string',
          table_name: 'health',
          table_alias: 'health',
          table_label: 'Health',
        },
      }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown cold chain availability');

    expect(getChoiceChipLabel(
      createFilter({ name: 'Power backup system' }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown power backup system');

    expect(getChoiceChipLabel(
      createFilter({ name: 'Water availability' }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown water availability');
  });

  it('formats health range chips without School prefix', () => {
    const item = createFilter({
      name: 'Number of doctors',
      type: 'RANGE',
      entity_type: EntityType.HEALTH,
      column_configuration: {
        name: 'num_doctors',
        label: 'Number of doctors',
        type: 'int',
        table_name: 'health',
        table_alias: 'health',
        table_label: 'Health',
      },
      query_param_filter: 'range',
    });
    const itemKey = 'health__num_doctors__range';

    const chips = buildFilterChips(item, {
      [itemKey]: { none_range: false, value: '1,266' },
    }, t);

    expect(chips).toEqual([{
      chipId: itemKey,
      itemKey,
      label: 'Number of doctors (1–266)',
    }]);
  });

  it('formats open-ended range chips with Min or Max', () => {
    const item = createFilter({
      name: 'Catchment Population',
      type: 'RANGE',
      entity_type: EntityType.HEALTH,
      column_configuration: {
        name: 'catchment_population',
        label: 'Catchment Population',
        type: 'int',
        table_name: 'health',
        table_alias: 'health',
        table_label: 'Health',
      },
      query_param_filter: 'range',
    });
    const itemKey = 'health__catchment_population__range';

    expect(buildFilterChips(item, {
      [itemKey]: { none_range: false, value: '10,null' },
    }, t)[0]?.label).toBe('Catchment Population (10–Max)');

    expect(buildFilterChips(item, {
      [itemKey]: { none_range: false, value: 'null,299' },
    }, t)[0]?.label).toBe('Catchment Population (Min–299)');
  });

  it('emits chips once when two filters share the same column key', () => {
    const sharedColumn = {
      name: 'coverage_type',
      label: 'Coverage type',
      type: 'string',
      table_name: 'school',
      table_alias: 'school',
      table_label: 'School',
    };
    const first = createFilter({
      id: 1,
      name: 'Coverage Type',
      type: 'DROPDOWN_MULTISELECT',
      column_configuration: sharedColumn,
      options: { choices: [{ label: '2G', value: '2g' }] },
      query_param_filter: 'in',
    });
    const second = createFilter({
      id: 2,
      name: 'coverage type fil',
      type: 'DROPDOWN_MULTISELECT',
      column_configuration: sharedColumn,
      options: { choices: [{ label: '2g', value: '2g' }] },
      query_param_filter: 'in',
    });
    const itemKey = 'school__coverage_type__in';

    const chipsByEntity = buildFilterChipsByEntity(
      [first, second],
      [EntityType.SCHOOL],
      { [itemKey]: '2g' },
      t,
    );

    expect(chipsByEntity[EntityType.SCHOOL]).toHaveLength(1);
    expect(chipsByEntity[EntityType.SCHOOL][0].label).toBe('2G');
  });

  it('keeps separate chips when different filters share the same option value', () => {
    const coverage = createFilter({
      id: 1,
      name: 'Coverage type',
      type: 'DROPDOWN_MULTISELECT',
      column_configuration: {
        name: 'coverage_type',
        label: 'Coverage type',
        type: 'string',
        table_name: 'school',
        table_alias: 'school',
        table_label: 'School',
      },
      options: { choices: [{ label: '4G', value: '4g' }] },
      query_param_filter: 'in',
    });
    const connectivity = createFilter({
      id: 2,
      name: 'Connectivity type',
      type: 'DROPDOWN_MULTISELECT',
      column_configuration: {
        name: 'connectivity_type',
        label: 'Connectivity type',
        type: 'string',
        table_name: 'school',
        table_alias: 'school',
        table_label: 'School',
      },
      options: { choices: [{ label: '4G', value: '4g' }] },
      query_param_filter: 'in',
    });

    const chipsByEntity = buildFilterChipsByEntity(
      [coverage, connectivity],
      [EntityType.SCHOOL],
      {
        school__coverage_type__in: '4g',
        school__connectivity_type__in: '4g',
      },
      t,
    );

    expect(chipsByEntity[EntityType.SCHOOL]).toHaveLength(2);
    expect(chipsByEntity[EntityType.SCHOOL].map((chip) => chip.itemKey)).toEqual([
      'school__coverage_type__in',
      'school__connectivity_type__in',
    ]);
    expect(chipsByEntity[EntityType.SCHOOL].every((chip) => chip.label === '4G')).toBe(true);
  });

  it('interpolates translated field names into no/unknown chip keys', () => {
    expect(getChoiceChipLabel(
      createFilter({ name: 'laboratorio de informática' }),
      { label: 'No', value: 'false' },
      t,
    )).toBe('No laboratorio de informática');

    expect(getChoiceChipLabel(
      createFilter({ name: 'nivel educativo' }),
      { label: 'Unknown', value: 'none' },
      t,
    )).toBe('Unknown nivel educativo');
  });
});

describe('getVisibleChipCountForRows', () => {
  it('returns all chips when they fit in two rows without a toggle', () => {
    expect(widthsFitInRows([100, 100, 100], 220, 8, 2)).toBe(true);
    expect(getVisibleChipCountForRows({
      chipWidths: [100, 100, 100],
      containerWidth: 220,
      toggleWidth: 90,
    })).toBe(3);
  });

  it('reserves space for Show all on the second row when chips overflow', () => {
    const visible = getVisibleChipCountForRows({
      chipWidths: [100, 100, 100, 100, 100, 100],
      containerWidth: 220,
      toggleWidth: 90,
    });

    expect(visible).toBeLessThan(6);
    expect(widthsFitInRows(
      [100, 100, 100, 100, 100, 100].slice(0, visible).concat(90),
      220,
      8,
      2,
    )).toBe(true);
    expect(widthsFitInRows(
      [100, 100, 100, 100, 100, 100].slice(0, visible + 1).concat(90),
      220,
      8,
      2,
    )).toBe(false);
  });

  it('keeps one oversized chip with Show all on the second row', () => {
    expect(getVisibleChipCountForRows({
      chipWidths: [300, 300, 300],
      containerWidth: 120,
      toggleWidth: 90,
    })).toBe(1);
  });
});
