import { useStore } from 'effector-react';
import { SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { $country, $countrySearchParams } from '~/@/country/country.model';
import { $showAdvancedFilter, onShowAdvancedFilter } from '~/@/sidebar/sidebar.model';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';
import { $mapRoutes } from '~/core/routes';

import { $advanceFilterList } from '../../map.model';
import FilterPopup from './filter-popup';

const FilterButton = () => {
  const { t } = useTranslation();
  const isOpen = useStore($showAdvancedFilter);
  const country = useStore($country);
  const routes = useStore($mapRoutes);
  const advanceFilterList = useStore($advanceFilterList);
  const { selectedCount } = useStore($countrySearchParams);

  const isDisabled = useMemo(() => {
    if (
      routes.schools ||
      routes.entity ||
      routes.entityView ||
      !country?.id ||
      !advanceFilterList?.length
    ) {
      return true;
    }
    return false;
  }, [
    advanceFilterList,
    country?.id,
    routes.schools,
    routes.entity,
    routes.entityView,
  ]);

  if (isDisabled) return null;

  return (
    <div className="filter-wrapper-popup relative! z-99! my-2! mr-2! flex! flex-col! items-center!">
      <FilterPopup open={isOpen} setOpen={onShowAdvancedFilter}>
        <Button
          aria-label={t('filters')}
          className={cn(
            "font-['Open_Sans',sans-serif]! h-8! gap-1.5! rounded-md! px-2.5! text-sm!",
            isOpen
              ? 'bg-primary! text-primary-foreground! hover:bg-primary/90!'
              : 'bg-secondary! text-secondary-foreground! hover:bg-secondary/80!',
          )}
          disabled={isDisabled}
          onClick={() => {
            onShowAdvancedFilter(!isOpen);
          }}
          onKeyDown={(event) => {
            if (
              isOpen &&
              (event.key === 'Enter' || event.key === ' ')
            ) {
              event.preventDefault();
            }
          }}
          size="sm"
          type="button"
          variant={isOpen ? 'default' : 'secondary'}
        >
          <SlidersHorizontal className="size-4!" />
          <span>{t('filters')}</span>
          {selectedCount > 0 && (
            <span
              className={cn(
                'ml-0.5! inline-flex! h-5! min-w-5! items-center! justify-center! rounded-full! px-1.5! text-xs! font-normal! leading-none!',
                isOpen
                  ? 'bg-primary-foreground! text-primary!'
                  : 'bg-primary! text-primary-foreground!',
              )}
            >
              {selectedCount}
            </span>
          )}
        </Button>
      </FilterPopup>
    </div>
  );
};

export default FilterButton;
