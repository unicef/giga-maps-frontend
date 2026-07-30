import { describe, expect, it } from 'vitest';

import type { AdvanceFilterType } from '~/api/types';
import { EntityType } from '~/@/entities/types/entity-types';

import {
  buildFilterChips,
  buildFilterChipsByEntity,
  getChoiceChipLabel,
  getVisibleChipCountForRows,
  widthsFitInRows,
} from './filter-chip-utils';

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
    }, (key) => key);

    expect(chips).toEqual([{
      chipId: itemKey,
      itemKey,
      label: 'No computer lab',
    }]);
  });

  it('maps yes/no boolean choices to field-based labels from the design', () => {
    const item = createFilter({ type: 'BOOLEAN' });
    const itemKey = 'school__computer_lab__iexact';

    expect(getChoiceChipLabel(item, { label: 'Yes', value: 'true' }, (key) => key)).toBe('Computer lab');
    expect(getChoiceChipLabel(item, { label: 'No', value: 'false' }, (key) => key)).toBe('No computer lab');
    expect(getChoiceChipLabel(
      createFilter({ name: 'Education level' }),
      { label: 'Unknown', value: 'none' },
      (key) => key,
    )).toBe('Unknown education level');
  });

  it('keeps descriptive multiselect option labels unchanged', () => {
    expect(getChoiceChipLabel(
      createFilter({ name: 'Connectivity type', type: 'DROPDOWN_MULTISELECT' }),
      { label: 'Unknown education level', value: 'unknown' },
      (key) => key,
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
    }, (key) => key);

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
    }, (key) => key);

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
    }, (key) => key);

    expect(chips).toEqual([{
      chipId: itemKey,
      itemKey,
      label: 'School: Number of computers (1–266)',
    }]);
  });

  it('maps unknown school area type to Unknown area type', () => {
    expect(getChoiceChipLabel(
      createFilter({ name: 'School area type' }),
      { label: 'Unknown', value: 'none' },
      (key) => key,
    )).toBe('Unknown area type');
  });

  it('maps unknown health facility choices to design labels', () => {
    expect(getChoiceChipLabel(
      createFilter({ name: 'Cold chain' }),
      { label: 'Unknown', value: 'none' },
      (key) => key,
    )).toBe('Unknown cold chain');

    expect(getChoiceChipLabel(
      createFilter({ name: 'Cold chain available' }),
      { label: 'Unknown', value: 'none' },
      (key) => key,
    )).toBe('Unknown cold chain availability');

    expect(getChoiceChipLabel(
      createFilter({ name: 'Power backup system' }),
      { label: 'Unknown', value: 'none' },
      (key) => key,
    )).toBe('Unknown power backup system');

    expect(getChoiceChipLabel(
      createFilter({ name: 'Water availability' }),
      { label: 'Unknown', value: 'none' },
      (key) => key,
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
    }, (key) => key);

    expect(chips).toEqual([{
      chipId: itemKey,
      itemKey,
      label: 'Number of doctors (1–266)',
    }]);
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
      (key) => key,
    );

    expect(chipsByEntity[EntityType.SCHOOL]).toHaveLength(1);
    expect(chipsByEntity[EntityType.SCHOOL][0].label).toBe('2G');
  });
});

describe('getVisibleChipCountForRows', () => {
  it('returns all chips when they fit in two rows without a toggle', () => {
    // 3 chips of 100px in a 220px container → row1: 2, row2: 1
    expect(widthsFitInRows([100, 100, 100], 220, 8, 2)).toBe(true);
    expect(getVisibleChipCountForRows({
      chipWidths: [100, 100, 100],
      containerWidth: 220,
      toggleWidth: 90,
    })).toBe(3);
  });

  it('reserves space for Show all on the second row when chips overflow', () => {
    // 6 × 100px chips in 220px → would need 3 rows; keep as many as fit with toggle
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
    // A chip wider than the container still occupies one row; toggle wraps to row 2.
    expect(getVisibleChipCountForRows({
      chipWidths: [300, 300, 300],
      containerWidth: 120,
      toggleWidth: 90,
    })).toBe(1);
  });
});
