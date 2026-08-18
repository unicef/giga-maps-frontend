import { useStore } from 'effector-react';
import type { TFunction } from 'i18next';
import { ChevronDown, X } from 'lucide-react';
import {
  Fragment,
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { $countrySearchParams } from '~/@/country/country.model';
import { $activeEntityTypes, $entityRegistry } from '~/@/entities';
import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import { EntityType } from '~/@/entities/types/entity-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { router } from '~/core/routes';
import { cn } from '~/lib/cn';

import { $advanceFilterList } from '../../map.model';
import {
  deleteAdvancedFiltersForEntities,
  suppressDefaultAdvancedFilters,
} from './advanced-filter.model';
import CollapsibleFilterChips from './collapsible-filter-chips';
import {
  buildFilterChipsByEntity,
  dedupeAdvanceFiltersByColumnKey,
  getAdvanceFilterItemKey,
  type FilterChip,
} from './filter-chip-utils';
import MultiSelectDropdown from './multi-select-dropdown';
import RangeTextInput from './range-text-input';
import SingleDropdown from './single-dropdown';
import TextField from './text-input';

export const components = {
  DROPDOWN: SingleDropdown,
  DROPDOWN_MULTISELECT: MultiSelectDropdown,
  RANGE: RangeTextInput,
  INPUT: TextField,
  BOOLEAN: SingleDropdown,
} as Record<string, React.ComponentType<any>>;

type SelectedFieldValue =
  | string
  | {
      none_range: boolean;
      value: string;
    };

const navigateWithSearchParams = (params: URLSearchParams) => {
  const search = params.toString();
  router.navigate(
    search ? `${window.location.pathname}?${search}` : window.location.pathname,
  );
};

const getEntityFilterGroupLabel = (
  entityType: EntityType,
  entityRegistry: Record<string, EntityConfig>,
  t: TFunction,
) => {
  const config = entityRegistry[entityType];
  if (!config) return entityType;

  return t(config.slug, {
    count: 2,
    defaultValue: config.displayName,
  });
};

const FilterPopupContent = ({
  setOpen,
}: PropsWithChildren<{ setOpen: (open: boolean) => void }>) => {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  const activeEntityTypes = useStore($activeEntityTypes);
  const entityRegistry = useStore($entityRegistry);
  const advanceFilterList = useStore($advanceFilterList);
  const uniqueAdvanceFilterList = useMemo(
    () => dedupeAdvanceFiltersByColumnKey(advanceFilterList ?? []),
    [advanceFilterList],
  );
  const { urlFieldList } = useStore($countrySearchParams);
  const [openItems, setOpenItems] = useState<EntityType[]>([]);
  const [expandedChipGroups, setExpandedChipGroups] = useState<
    Partial<Record<EntityType, boolean>>
  >({});
  const [selectedFields, setSelectedFields] = useState<
    Record<string, SelectedFieldValue>
  >({});

  const onChange = (
    key: string,
    value: string,
    multiKeyValues?: Record<string, string>,
  ) => {
    setSelectedFields((current) => ({
      ...current,
      [key]: value,
      ...multiKeyValues,
    }));
  };

  useEffect(() => {
    const nextSelectedFields = {} as Record<string, SelectedFieldValue>;
    const activeEntityTypeSet = new Set<string>(activeEntityTypes);
    uniqueAdvanceFilterList.forEach((item) => {
      if (!activeEntityTypeSet.has(item.entity_type)) return;

      const itemKey = getAdvanceFilterItemKey(item);
      const field = urlFieldList[itemKey];
      const extraItemKey = `ignore_${itemKey}`;
      const extraField = urlFieldList[extraItemKey];
      if (field) {
        const isRange = field.filter.includes('range');
        const isNone = field.filter.includes('none');
        nextSelectedFields[itemKey] = isRange
          ? {
              none_range: isNone,
              value: field.value,
            }
          : field.value;
      } else {
        nextSelectedFields[itemKey] = '';
      }
      if (extraField) {
        nextSelectedFields[extraItemKey] = extraField.value;
      }
    });
    setSelectedFields(nextSelectedFields);
    setIsReady(true);
  }, [activeEntityTypes, uniqueAdvanceFilterList, urlFieldList]);

  const onApply = (e: MouseEvent) => {
    e.preventDefault();
    const prefix = 'filter__';
    const params = new URLSearchParams(window.location.search);
    deleteAdvancedFiltersForEntities(params, activeEntityTypes);

    for (const [key, value] of Object.entries(selectedFields)) {
      if (value) {
        if (typeof value === 'object') {
          const { none_range: noneRange, value: rangeValue } = value;
          if (noneRange) {
            params.set(
              `${prefix}${key.replace('__range', '__none_range')}`,
              String(rangeValue) || 'null,null',
            );
          } else if (rangeValue) {
            params.set(`${prefix}${key}`, String(rangeValue));
          }
        } else {
          params.set(`${prefix}${key}`, String(value));
        }
      }
    }
    suppressDefaultAdvancedFilters(activeEntityTypes);
    navigateWithSearchParams(params);
    setOpen(false);
  };

  const onReset = (e: MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    deleteAdvancedFiltersForEntities(params, activeEntityTypes);

    setSelectedFields((prev) => {
      const next = { ...prev };
      uniqueAdvanceFilterList
        .filter((item) =>
          activeEntityTypes.includes(item.entity_type as EntityType),
        )
        .forEach((item) => {
          const itemKey = getAdvanceFilterItemKey(item);
          next[itemKey] = '';
          next[`ignore_${itemKey}`] = '';
        });
      return next;
    });

    suppressDefaultAdvancedFilters(activeEntityTypes);
    navigateWithSearchParams(params);
  };

  const entitiesWithFilters = useMemo(() => {
    return activeEntityTypes
      .filter((el) =>
        uniqueAdvanceFilterList.some((item) => item.entity_type === el),
      )
      .sort((a, b) => (a < b ? 1 : -1));
  }, [activeEntityTypes, uniqueAdvanceFilterList]);

  const selectedFilterChipsByEntity = useMemo(() => {
    return buildFilterChipsByEntity(
      uniqueAdvanceFilterList,
      activeEntityTypes,
      selectedFields,
      t,
    ) as Record<EntityType, FilterChip[]>;
  }, [activeEntityTypes, uniqueAdvanceFilterList, selectedFields, t]);

  const entityWiseSelectedFilterCount = useMemo(() => {
    return activeEntityTypes.reduce(
      (acc, elEntity) => {
        acc[elEntity] = (selectedFilterChipsByEntity[elEntity] ?? []).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [activeEntityTypes, selectedFilterChipsByEntity]);

  const clearSingleBadge = (chip: FilterChip, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFields((prev) => {
      const next = { ...prev };
      const ignoreKey = `ignore_${chip.itemKey}`;

      if (chip.removeValue !== undefined) {
        const removeKey = chip.removeValue.trim().toLowerCase();
        const currentValues = String(prev[chip.itemKey] ?? '')
          .split('|')
          .filter(Boolean);
        const nextValues = currentValues.filter(
          (value) => value.trim().toLowerCase() !== removeKey,
        );
        next[chip.itemKey] = nextValues.join('|');

        if (prev[ignoreKey]) {
          const filterItem = uniqueAdvanceFilterList.find(
            (item) => getAdvanceFilterItemKey(item) === chip.itemKey,
          );
          const choiceLabel = filterItem?.options?.choices?.find(
            (choice) =>
              choice.value.trim().toLowerCase() === removeKey ||
              choice.label.trim().toLowerCase() === removeKey,
          )?.label;

          const currentLabels = String(prev[ignoreKey])
            .split('|')
            .filter(Boolean);
          next[ignoreKey] = currentLabels
            .filter(
              (label) =>
                label !== choiceLabel &&
                label.trim().toLowerCase() !== removeKey,
            )
            .join('|');
        }
      } else {
        next[chip.itemKey] = '';
        next[ignoreKey] = '';
      }

      return next;
    });
  };

  const clearEntityBadges = (entityType: EntityType, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFields((prev) => {
      const next = { ...prev };
      uniqueAdvanceFilterList
        .filter((item) => item.entity_type === entityType)
        .forEach((item) => {
          const itemKey = getAdvanceFilterItemKey(item);
          next[itemKey] = '';
          next[`ignore_${itemKey}`] = '';
        });
      return next;
    });
  };

  const [hasInitializedOpenItems, setHasInitializedOpenItems] = useState(false);
  useEffect(() => {
    if (entitiesWithFilters.length > 0 && !hasInitializedOpenItems) {
      setOpenItems([...entitiesWithFilters]);
      setHasInitializedOpenItems(true);
    }
  }, [entitiesWithFilters, hasInitializedOpenItems]);

  if (!isReady) return null;

  return (
    <div className="flex! h-full! min-h-0! w-full! flex-1! flex-col! overflow-hidden! bg-background!">
      <div className="flex! shrink-0! items-center! justify-between! px-4! py-4!">
        <h3
          className={cn(
            "font-['Open_Sans',sans-serif]! text-base! leading-6! font-normal! text-filter-text!",
          )}
        >
          {t('filters')}
        </h3>
        <Button
          aria-label={t('close', { defaultValue: 'Close' })}
          className="size-8! text-filter-text!"
          data-testid="filter-close"
          onClick={() => {
            setOpen(false);
          }}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X className="size-4!" />
        </Button>
      </div>

      <form
        aria-label="filter-form"
        className="flex! min-h-0! flex-1! flex-col! overflow-hidden!"
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;

          const target = event.target;
          if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement
          ) {
            event.preventDefault();
          }
        }}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {entitiesWithFilters.some(
          (el) => (entityWiseSelectedFilterCount[el] ?? 0) > 0,
        ) && (
          <div className="flex! shrink-0! flex-col! gap-4! px-4! pb-3!">
            {entitiesWithFilters.map((el) => {
              const selectedCount = entityWiseSelectedFilterCount[el] ?? 0;
              const chips = selectedFilterChipsByEntity[el] ?? [];
              if (selectedCount === 0) return null;

              const isExpanded = expandedChipGroups[el] ?? false;

              return (
                <div
                  key={`active-filters-${el}`}
                  className="flex! flex-col! gap-2!"
                >
                  <div className="flex! w-full! items-center! gap-2!">
                    <span className="text-sm! leading-5! text-filter-text!">
                      {getEntityFilterGroupLabel(el, entityRegistry, t)} (
                      {selectedCount})
                    </span>
                    <button
                      type="button"
                      className="cursor-pointer! text-xs! font-normal! text-primary! hover:underline!"
                      onClick={(e) => clearEntityBadges(el, e)}
                    >
                      {t('clear')}
                    </button>
                  </div>
                  <CollapsibleFilterChips
                    chips={chips}
                    selectedCount={selectedCount}
                    isExpanded={isExpanded}
                    onClearChip={clearSingleBadge}
                    onToggleExpanded={(expanded) => {
                      setExpandedChipGroups((current) => ({
                        ...current,
                        [el]: expanded,
                      }));
                    }}
                  />
                </div>
              );
            })}
            <Separator />
          </div>
        )}

        <ScrollArea className="min-h-0! flex-1! px-0! pb-8!">
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={(eventAccordion: string[]) => {
              setOpenItems(eventAccordion as EntityType[]);
            }}
            className="flex! flex-col! gap-3!"
          >
            {entitiesWithFilters.map((el, index) => {
              return (
                <Fragment key={`accordion-item-${el}`}>
                  <AccordionItem value={el}>
                    <AccordionTrigger
                      className={cn(
                        "font-['Open_Sans',sans-serif]! px-4! py-3! text-base! leading-6! font-normal! text-filter-text!",
                        'data-[state=open]:pt-3! data-[state=open]:pb-3!',
                      )}
                    >
                      <span className="whitespace-nowrap!">
                        {getEntityFilterGroupLabel(el, entityRegistry, t)}
                      </span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          'transition-transform! duration-200!',
                          openItems.includes(el) && 'rotate-180!',
                        )}
                      />
                    </AccordionTrigger>
                    <AccordionContent>
                      {uniqueAdvanceFilterList
                        .filter(
                          (elAdvanceFilter) =>
                            elAdvanceFilter.entity_type === el,
                        )
                        .map((item) => {
                          const Component = components[
                            item.type
                          ] as React.JSXElementConstructor<any>;
                          if (!Component) return null;
                          const itemKey = getAdvanceFilterItemKey(item);
                          const extraItemKey = `ignore_${itemKey}`;
                          const extraValue = selectedFields[extraItemKey];
                          return (
                            <Component
                              key={itemKey}
                              {...item}
                              itemKey={itemKey}
                              value={selectedFields[itemKey]}
                              extraValue={extraValue}
                              onChange={onChange}
                            />
                          );
                        })}
                    </AccordionContent>
                  </AccordionItem>
                  {index < entitiesWithFilters.length - 1 && (
                    <Separator className="my-2!" />
                  )}
                </Fragment>
              );
            })}
          </Accordion>
        </ScrollArea>

        <div className="flex! shrink-0! gap-3! px-4! pb-4!">
          <Button
            className="h-10! flex-1! rounded-full! bg-secondary! font-['Open_Sans',sans-serif]! text-sm! font-medium! text-secondary-foreground! hover:bg-secondary/80!"
            onClick={(event) => {
              void onReset(event);
            }}
            type="button"
            variant="secondary"
          >
            {t('clear-all')}
          </Button>
          <Button
            className="h-10! flex-1! rounded-full! bg-primary! font-['Open_Sans',sans-serif]! text-sm! font-medium! text-primary-foreground! hover:bg-primary/90!"
            onClick={(event) => {
              void onApply(event);
            }}
            type="button"
          >
            {t('apply')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FilterPopupContent;
