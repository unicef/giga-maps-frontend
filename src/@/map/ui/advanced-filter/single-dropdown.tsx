import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AdvanceFilterType } from '~/api/types';
import { cn } from '~/lib/cn';

import { filterOptionClassName, filterSelectTriggerClassName } from './filter-control-styles';
import { FilterFieldLabel } from './filter-field-label';

type Choice = { label: string; value: string };

const SingleDropdown = ({
  name,
  column_configuration: parameter,
  options,
  itemKey,
  value,
  onChange,
  description,
}: AdvanceFilterType & {
  value: string;
  itemKey: string;
  onChange: (key: string, value: string) => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Choice[]>(
    () => [{ label: t('all') as string, value: '' }, ...(options?.choices ?? [])],
    [options?.choices, t],
  );
  const selectedItem = useMemo(
    () => items.find((item) => item.value === value) ?? items[0],
    [items, value],
  );

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

  return (
    <div className="flex! flex-col! gap-2! px-4! py-2!" ref={rootRef}>
      <FilterFieldLabel
        description={description}
        htmlFor={`dropdown-${parameter.name}`}
        name={name}
      />
      <div className="relative!">
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          className={filterSelectTriggerClassName}
          id={`dropdown-${parameter.name}`}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="truncate!">{selectedItem?.label}</span>
          <ChevronDown className="size-4! shrink-0! text-filter-muted!" />
        </button>
        {open && (
          <ul
            className="absolute! z-20! mt-1! max-h-60! w-full! overflow-auto! rounded-lg! border! border-border! bg-background! p-0! shadow-md!"
            role="listbox"
          >
            {items.map((item) => {
              const isSelected = item.value === selectedItem?.value;
              return (
                <li key={`${item.value}-${item.label}`}>
                  <button
                    aria-selected={isSelected}
                    className={cn(
                      filterOptionClassName,
                      isSelected ? 'bg-filter-field!' : 'hover:bg-filter-field/70!',
                    )}
                    onClick={() => {
                      onChange(itemKey, item.value);
                      setOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <span className="truncate!">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SingleDropdown;
