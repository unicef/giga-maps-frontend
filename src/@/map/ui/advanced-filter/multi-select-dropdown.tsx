import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AdvanceFilterType } from '~/api/types';
import { cn } from '~/lib/cn';

import {
  filterOptionLabelClassName,
  filterOptionMultiClassName,
  filterSelectTriggerClassName,
} from './filter-control-styles';
import { FilterFieldLabel } from './filter-field-label';

type Choice = { label: string; value: string };

const MultiSelectDropdown = ({
  name,
  description,
  column_configuration: parameter,
  options: { placeholder, choices, group_choices: groupChoices } = {},
  itemKey,
  value,
  extraValue,
  onChange,
}: AdvanceFilterType & {
  value: string;
  extraValue: string;
  itemKey: string;
  onChange: (
    key: string,
    value: string,
    multiKeyValues?: Record<string, string>,
  ) => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Choice[]>(() => [...(choices ?? [])], [choices]);
  const selectedItems = useMemo(() => {
    const values = groupChoices
      ? extraValue?.split('|') || []
      : value?.split('|') || [];
    return (
      items?.filter((item) =>
        values.includes(groupChoices ? item.label : item.value),
      ) ?? []
    );
  }, [extraValue, groupChoices, items, value]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const triggerLabel =
    selectedItems.length > 0
      ? selectedItems.length === 1
        ? selectedItems[0].label
        : `${selectedItems.length} ${t('selected', { defaultValue: 'selected' })}`
      : (placeholder ?? `${t('select')} ${name}`);

  const toggleItem = (item: Choice) => {
    const isSelected = selectedItems.some((selected) =>
      groupChoices
        ? selected.label === item.label
        : selected.value === item.value,
    );
    const nextSelected = isSelected
      ? selectedItems.filter((selected) =>
          groupChoices
            ? selected.label !== item.label
            : selected.value !== item.value,
        )
      : [...selectedItems, item];

    onChange(
      itemKey,
      nextSelected.map((selected) => selected.value).join('|'),
      groupChoices
        ? {
            [`ignore_${itemKey}`]: nextSelected
              .map((selected) => selected.label)
              .join('|'),
          }
        : undefined,
    );
  };

  return (
    <div className="flex! flex-col! gap-2! px-4! py-2!" ref={rootRef}>
      <FilterFieldLabel
        description={description}
        htmlFor={`multi-select-dropdown-${parameter.name}`}
        name={name}
      />
      <div className="relative!">
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            filterSelectTriggerClassName,
            selectedItems.length === 0 && 'text-filter-muted!',
          )}
          id={`multi-select-dropdown-${parameter.name}`}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="truncate!">{triggerLabel}</span>
          <ChevronDown className="size-4! shrink-0! text-filter-muted!" />
        </button>
        {open && (
          <ul
            className="absolute! z-20! mt-1! max-h-60! w-full! overflow-auto! rounded-lg! border! border-border! bg-background! p-0! shadow-md!"
            role="listbox"
          >
            {items.map((item) => {
              const isSelected = selectedItems.some((selected) =>
                groupChoices
                  ? selected.label === item.label
                  : selected.value === item.value,
              );
              return (
                <li key={`${item.value}-${item.label}`}>
                  <label
                    className={cn(
                      filterOptionMultiClassName,
                      isSelected ? 'bg-filter-field!' : 'hover:bg-filter-field/70!',
                    )}
                  >
                    <input
                      checked={isSelected}
                      className="size-4! shrink-0! accent-primary!"
                      onChange={() => toggleItem(item)}
                      type="checkbox"
                    />
                    <span className={filterOptionLabelClassName}>
                      {item.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
