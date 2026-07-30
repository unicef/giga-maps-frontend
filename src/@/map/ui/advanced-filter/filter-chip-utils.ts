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

const formatNoChoiceLabel = (fieldName: string) =>
  `No ${fieldName.charAt(0).toLowerCase()}${fieldName.slice(1)}`;

const formatUnknownChoiceLabel = (fieldName: string) => {
  const lowerField = fieldName.toLowerCase();
  // Spec: "School area type" + Unknown → "Unknown area type"
  if (lowerField.endsWith('area type')) {
    return 'Unknown area type';
  }
  // Spec: "Coverage type" + Unknown → "Unknown coverage type"
  if (lowerField.endsWith('coverage type')) {
    return 'Unknown coverage type';
  }
  // Spec: "Cold chain available" + Unknown → "Unknown cold chain availability"
  if (lowerField === 'cold chain available') {
    return 'Unknown cold chain availability';
  }
  return `Unknown ${fieldName.charAt(0).toLowerCase()}${fieldName.slice(1)}`;
};

const normalizeChipKey = (value: string) => value.trim().toLowerCase();

const shouldPrefixRangeWithEntity = (item: AdvanceFilterType) => {
  const column = item.column_configuration.name.toLowerCase();
  const fieldName = item.name.trim().toLowerCase();
  return column.includes('num_computers') || fieldName.includes('number of computers');
};

export const getRangeChipLabel = (
  item: AdvanceFilterType,
  minDisplay: string,
  maxDisplay: string,
) => {
  const rangeText = `${minDisplay || '…'}–${maxDisplay || '…'}`;
  if (shouldPrefixRangeWithEntity(item) && item.entity_type === 'school') {
    return `School: ${item.name} (${rangeText})`;
  }
  return `${item.name} (${rangeText})`;
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
    return translateLabel(formatNoChoiceLabel(fieldName), t);
  }

  if (lowerChoice === 'unknown' || choice.value === 'none') {
    return translateLabel(formatUnknownChoiceLabel(fieldName), t);
  }

  return translateLabel(choiceLabel, t);
};

export const dedupeFilterChips = (chips: FilterChip[]): FilterChip[] => {
  const seen = new Set<string>();
  return chips.filter((chip) => {
    const key = normalizeChipKey(chip.removeValue ?? chip.label);
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
        label: getRangeChipLabel(item, minDisplay, maxDisplay),
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
    // Two published filters can share the same column/query key (e.g. coverage_type).
    // Only emit chips once per shared selection key.
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

/** Whether a sequence of item widths fits in `maxRows` of a flex-wrap row. */
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

/**
 * How many chips can stay visible in a collapsed flex-wrap layout limited to
 * `maxRows`, while still leaving room for a trailing toggle (e.g. "Show all").
 */
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
