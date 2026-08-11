import type { TFunction } from 'i18next';

import type { AdvanceFilterType } from '~/api/types';

type SelectedFieldValue = string | {
  none_range: boolean;
  value: string;
};

export type FilterChip = {
  chipId: string;
  itemKey: string;
  label: string;
  removeValue?: string;
};

export const hasSelectedFilterValue = (value: SelectedFieldValue | undefined) =>
  typeof value === 'object'
    ? value.none_range || Boolean(value.value)
    : Boolean(value);

const translateLabel = (label: string, t: TFunction) =>
  t(label, { defaultValue: label });

const uncapitalize = (value: string) =>
  value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;

const formatNoChoiceLabel = (fieldName: string, t: TFunction) =>
  t('filter-chip-no-field', {
    field: uncapitalize(fieldName),
    defaultValue: 'No {{field}}',
  });

const formatUnknownChoiceLabel = (item: AdvanceFilterType, t: TFunction) => {
  const column = item.column_configuration.name.toLowerCase();

  if (column.includes('area_type') || column === 'environment') {
    return t('filter-chip-unknown-area-type', {
      defaultValue: 'Unknown area type',
    });
  }

  if (column.includes('coverage_type')) {
    return t('filter-chip-unknown-coverage-type', {
      defaultValue: 'Unknown coverage type',
    });
  }

  if (column.includes('cold_chain')) {
    return t('filter-chip-unknown-cold-chain-availability', {
      defaultValue: 'Unknown cold chain availability',
    });
  }

  return t('filter-chip-unknown-field', {
    field: uncapitalize(item.name.trim()),
    defaultValue: 'Unknown {{field}}',
  });
};

const normalizeChipKey = (value: string) => value.trim().toLowerCase();

const shouldPrefixRangeWithEntity = (item: AdvanceFilterType) => {
  const column = item.column_configuration.name.toLowerCase();
  return column.includes('num_computers');
};

export const getRangeChipLabel = (
  item: AdvanceFilterType,
  minDisplay: string,
  maxDisplay: string,
  t: TFunction,
) => {
  const rangeText = `${minDisplay || t('min', { defaultValue: 'Min' })}–${maxDisplay || t('max', { defaultValue: 'Max' })}`;
  if (shouldPrefixRangeWithEntity(item) && item.entity_type === 'school') {
    return t('filter-chip-school-range', {
      name: item.name,
      range: rangeText,
      defaultValue: 'School: {{name}} ({{range}})',
    });
  }
  return t('filter-chip-range', {
    name: item.name,
    range: rangeText,
    defaultValue: '{{name}} ({{range}})',
  });
};

export const findChoiceByValue = (
  choices: { label: string; value: string }[],
  storedValue: string,
) => {
  const exact = choices.find((entry) => entry.value === storedValue);
  if (exact) return exact;

  const normalized = normalizeChipKey(storedValue);
  return choices.find((entry) => normalizeChipKey(entry.value) === normalized)
    ?? choices.find((entry) => normalizeChipKey(entry.label) === normalized);
};

export const getChoiceChipLabel = (
  item: AdvanceFilterType,
  choice: { label: string; value: string },
  t: TFunction,
): string => {
  const fieldName = item.name.trim();
  const choiceLabel = choice.label.trim();
  const lowerChoice = choiceLabel.toLowerCase();
  const lowerField = fieldName.toLowerCase();

  if (
    choiceLabel.length >= fieldName.length + 2
    || lowerChoice.includes(lowerField)
    || lowerChoice.startsWith('no ')
    || lowerChoice.startsWith('unknown ')
  ) {
    return translateLabel(choiceLabel, t);
  }

  if (lowerChoice === 'yes' || choice.value === 'true') {
    return translateLabel(fieldName, t);
  }

  if (lowerChoice === 'no' || choice.value === 'false') {
    return formatNoChoiceLabel(fieldName, t);
  }

  if (lowerChoice === 'unknown' || choice.value === 'none') {
    return formatUnknownChoiceLabel(item, t);
  }

  return translateLabel(choiceLabel, t);
};

export const dedupeFilterChips = (chips: FilterChip[]): FilterChip[] => {
  const seen = new Set<string>();
  return chips.filter((chip) => {
    const key = `${chip.itemKey}__${normalizeChipKey(chip.removeValue ?? chip.label)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const buildFilterChips = (
  item: AdvanceFilterType,
  selectedFields: Record<string, SelectedFieldValue>,
  t: TFunction,
): FilterChip[] => {
  const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
  const value = selectedFields[itemKey];
  const extraValue = selectedFields[`ignore_${itemKey}`];

  if (!hasSelectedFilterValue(value)) return [];

  const choices = item.options?.choices ?? [];

  if (item.type === 'DROPDOWN_MULTISELECT') {
    const groupChoices = item.options?.group_choices;
    const storedValues = String(value ?? '').split('|').filter(Boolean);
    const storedLabels = String(extraValue ?? '').split('|').filter(Boolean);

    if (groupChoices) {
      return dedupeFilterChips(storedLabels.map((label, index) => {
        const choice = choices.find((entry) => entry.label === label)
          ?? findChoiceByValue(choices, storedValues[index] ?? label);
        const removeValue = choice?.value ?? storedValues[index] ?? label;
        const choiceLabel = choice?.label ?? label;

        return {
          chipId: `${itemKey}__${normalizeChipKey(removeValue)}`,
          itemKey,
          label: getChoiceChipLabel(item, { label: choiceLabel, value: removeValue }, t),
          removeValue,
        };
      }));
    }

    return dedupeFilterChips(storedValues.map((storedValue) => {
      const choice = findChoiceByValue(choices, storedValue);
      const label = choice?.label ?? storedValue;
      const removeValue = choice?.value ?? storedValue;

      return {
        chipId: `${itemKey}__${normalizeChipKey(removeValue)}`,
        itemKey,
        label: getChoiceChipLabel(item, { label, value: removeValue }, t),
        removeValue,
      };
    }));
  }

  if (item.type === 'RANGE' && typeof value === 'object') {
    const [min, max] = String(value.value ?? '').split(',');
    const minDisplay = min && min !== 'null' ? min : '';
    const maxDisplay = max && max !== 'null' ? max : '';

    if (value.none_range && !minDisplay && !maxDisplay) {
      return [{
        chipId: `${itemKey}__none`,
        itemKey,
        label: `${item.name}: ${translateLabel('show-null-values', t)}`,
      }];
    }

    if (minDisplay || maxDisplay) {
      return [{
        chipId: itemKey,
        itemKey,
        label: getRangeChipLabel(item, minDisplay, maxDisplay, t),
      }];
    }

    return [];
  }

  if (item.type === 'DROPDOWN' || item.type === 'BOOLEAN') {
    const storedValue = String(value);
    const choice = findChoiceByValue(choices, storedValue) ?? {
      label: storedValue,
      value: storedValue,
    };

    return [{
      chipId: itemKey,
      itemKey,
      label: getChoiceChipLabel(item, choice, t),
    }];
  }

  return [{
    chipId: itemKey,
    itemKey,
    label: `${item.name}: ${String(value)}`,
  }];
};

export const buildFilterChipsByEntity = (
  advanceFilterList: AdvanceFilterType[],
  activeEntityTypes: string[],
  selectedFields: Record<string, SelectedFieldValue>,
  t: TFunction,
) => {
  const chipsByEntity = {} as Record<string, FilterChip[]>;
  const processedItemKeys = new Set<string>();

  activeEntityTypes.forEach((entityType) => {
    chipsByEntity[entityType] = [];
  });

  advanceFilterList.forEach((item) => {
    if (!activeEntityTypes.includes(item.entity_type)) return;

    const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
    if (processedItemKeys.has(itemKey)) return;
    processedItemKeys.add(itemKey);

    const chips = buildFilterChips(item, selectedFields, t);
    if (!chipsByEntity[item.entity_type]) {
      chipsByEntity[item.entity_type] = [];
    }
    chipsByEntity[item.entity_type].push(...chips);
  });

  Object.keys(chipsByEntity).forEach((entityType) => {
    chipsByEntity[entityType] = dedupeFilterChips(chipsByEntity[entityType]);
  });

  return chipsByEntity;
};

export const widthsFitInRows = (
  widths: number[],
  containerWidth: number,
  gap: number,
  maxRows: number,
): boolean => {
  if (widths.length === 0) return true;
  if (containerWidth <= 0) return true;

  let row = 0;
  let used = 0;

  for (const width of widths) {
    if (used === 0) {
      used = width;
      continue;
    }

    if (used + gap + width <= containerWidth) {
      used += gap + width;
      continue;
    }

    row += 1;
    if (row >= maxRows) return false;
    used = width;
  }

  return true;
};

export const getVisibleChipCountForRows = ({
  chipWidths,
  containerWidth,
  toggleWidth,
  gap = 8,
  maxRows = 2,
}: {
  chipWidths: number[];
  containerWidth: number;
  toggleWidth: number;
  gap?: number;
  maxRows?: number;
}): number => {
  if (chipWidths.length === 0) return 0;

  if (widthsFitInRows(chipWidths, containerWidth, gap, maxRows)) {
    return chipWidths.length;
  }

  for (let count = chipWidths.length - 1; count >= 0; count -= 1) {
    const widths = [...chipWidths.slice(0, count), toggleWidth];
    if (widthsFitInRows(widths, containerWidth, gap, maxRows)) {
      return count;
    }
  }

  return 0;
};
