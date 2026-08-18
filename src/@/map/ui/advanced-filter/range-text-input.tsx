import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AdvanceFilterType } from '~/api/types';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/cn';
import { evaluateExpression } from '~/lib/utils';

import { filterControlClassName } from './filter-control-styles';
import { FilterFieldLabel } from './filter-field-label';

const RangeTextInput = ({
  name,
  description,
  options,
  value: rangeValue,
  column_configuration: parameter,
  itemKey,
  onChange,
}: AdvanceFilterType & {
  value: { none_range: boolean; value: string };
  itemKey: string;
  onChange: (
    key: string,
    value: {
      none_range: boolean;
      value: string;
    },
  ) => void;
}) => {
  const { t } = useTranslation();
  const { downcast_aggr_str, upcast_aggr_str } = parameter?.options ?? {};
  const minPlaceholder =
    options?.active_range?.min_place_holder ?? options?.minPlaceholder;
  const maxPlaceholder =
    options?.active_range?.max_place_holder ?? options?.maxPlaceholder;
  const noneFilter = options?.include_none_filter;
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const { value, none_range: isNoneRange } = rangeValue || {};

  const displayMinPlaceholder = minPlaceholder?.startsWith('Min')
    ? `${t('min', { defaultValue: 'Min' })}${minPlaceholder.split('Min')[1]}`
    : (minPlaceholder ?? `${t('min', { defaultValue: 'Min' })} (0)`);
  const displayMaxPlaceholder = maxPlaceholder?.startsWith('Max')
    ? `${t('max', { defaultValue: 'Max' })}${maxPlaceholder.split('Max')[1]}`
    : (maxPlaceholder ?? t('max', { defaultValue: 'Max' }));

  useEffect(() => {
    const [min, max] = value?.split(',') || '';
    setMinValue(Number(evaluateExpression(downcast_aggr_str, min)) || null);
    setMaxValue(Number(evaluateExpression(downcast_aggr_str, max)) || null);
  }, [downcast_aggr_str, value]);

  return (
    <div className="flex! flex-col! gap-2! px-4! py-2!">
      <FilterFieldLabel description={description} name={name} />
      <div className="flex! gap-4!">
        <Input
          aria-label={`${name} min`}
          className={filterControlClassName}
          id={`${parameter.name}-min-input`}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            if (!next && !maxValue) {
              onChange(itemKey, {
                none_range: isNoneRange,
                value: '',
              });
            } else {
              const min = evaluateExpression(upcast_aggr_str, e.target.value);
              const max = evaluateExpression(upcast_aggr_str, maxValue);
              onChange(itemKey, {
                none_range: isNoneRange,
                value: `${min ? min : null},${max ? max : null}`,
              });
            }
          }}
          placeholder={displayMinPlaceholder}
          type="number"
          value={minValue ?? ''}
        />
        <Input
          aria-label={`${name} max`}
          className={filterControlClassName}
          id={`${parameter.name}-max-input`}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            if (!next && !minValue) {
              onChange(itemKey, {
                none_range: isNoneRange,
                value: '',
              });
            } else {
              const min = evaluateExpression(upcast_aggr_str, minValue);
              const max = evaluateExpression(upcast_aggr_str, e.target.value);
              onChange(itemKey, {
                none_range: isNoneRange,
                value: `${min ? min : null},${max ? max : null}`,
              });
            }
          }}
          placeholder={displayMaxPlaceholder}
          type="number"
          value={maxValue ?? ''}
        />
      </div>
      {noneFilter && (
        <label
          className="flex! cursor-pointer! items-center! gap-2! pt-1! text-xs! text-filter-muted!"
          htmlFor={`checkbox-${itemKey}`}
        >
          <input
            checked={isNoneRange}
            className={cn('size-4! accent-primary!')}
            id={`checkbox-${itemKey}`}
            onChange={() => {
              const currentNoneRange = !isNoneRange;
              let nextValue = '';
              if ([minValue, maxValue].filter(Boolean).length) {
                nextValue = `${evaluateExpression(upcast_aggr_str, minValue) ?? null},${evaluateExpression(upcast_aggr_str, maxValue) ?? null}`;
              }
              onChange(itemKey, {
                none_range: currentNoneRange,
                value: nextValue,
              });
            }}
            type="checkbox"
          />
          <span>{t('show-null-values', { defaultValue: 'Show null values' })}</span>
        </label>
      )}
    </div>
  );
};

export default RangeTextInput;
