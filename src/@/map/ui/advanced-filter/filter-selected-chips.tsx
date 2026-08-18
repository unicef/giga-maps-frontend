import { useStore } from 'effector-react';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { $countrySearchParams } from '~/@/country/country.model';
import { onShowAdvancedFilter } from '~/@/sidebar/sidebar.model';
import { Badge } from '~/components/ui/badge';
import { router } from '~/core/routes';

import { $advanceFilterList } from '../../map.model';

const FilterSelectedChips = () => {
  const { t } = useTranslation();
  const advanceFilterList = useStore($advanceFilterList);
  const { urlFieldList, searchParamsURL } = useStore($countrySearchParams);

  const selectedFilterChips = useMemo(() => {
    const selectedFields: {
      name: string;
      key: string;
    }[] = [];
    advanceFilterList?.forEach((item) => {
      const itemKey = `${item.entity_type}__${item.column_configuration.name}__${item.query_param_filter}`;
      const field = urlFieldList[itemKey];
      const name = item.name;
      if (field) {
        selectedFields.push({
          name,
          key: itemKey,
        });
      }
    });
    return selectedFields;
  }, [advanceFilterList, urlFieldList]);

  const removeFiltersParamsFromUrl = () => {
    if (typeof window === 'undefined') return;

    const url = new URL(
      window.location.origin +
        location.pathname +
        location.search +
        location.hash,
    );

    const keysToRemove = Array.from(url.searchParams.keys()).filter((k) =>
      k.startsWith('filter__'),
    );
    if (keysToRemove.length === 0) return;

    keysToRemove.forEach((k) => url.searchParams.delete(k));
    router.navigate(`${url.toString()}`);
  };

  if (!selectedFilterChips.length) return null;

  return (
    <div className="mr-2! flex! max-w-[calc(100vw-30rem)]! flex-wrap! justify-end! gap-1! max-md:hidden!">
      <Badge
        className="mb-2! cursor-pointer!"
        onClick={removeFiltersParamsFromUrl}
        variant="default"
      >
        {t('clear-all')}
      </Badge>

      {selectedFilterChips.map((item, index) => (
        <Badge
          className="mb-2! cursor-pointer! gap-1!"
          key={`${index}_${item.key}`}
          onClick={() => {
            onShowAdvancedFilter(true);
          }}
          variant="secondary"
        >
          <span>{item.name}</span>
          <button
            aria-label={t('clear')}
            className="inline-flex!"
            onClick={(event) => {
              event.stopPropagation();
              const splitKey = item.key.split('__');
              searchParamsURL.delete(`filter__${item.key}`);
              searchParamsURL.delete(`filter__ignore_${item.key}`);
              searchParamsURL.delete(
                `filter__${splitKey[0]}__none_${splitKey[1]}`,
              );
              router.navigate(
                `${window.location.pathname}?${searchParamsURL.toString()}`,
              );
            }}
            type="button"
          >
            <X className="size-3!" />
          </button>
        </Badge>
      ))}
    </div>
  );
};

export default FilterSelectedChips;
