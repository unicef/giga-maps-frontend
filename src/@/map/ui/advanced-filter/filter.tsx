import { useStore } from 'effector-react';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { $country, $countrySearchParams } from '~/@/country/country.model';
import {
  $showAdvancedFilter,
  onShowAdvancedFilter,
} from '~/@/sidebar/sidebar.model';
import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { $mapRoutes } from '~/core/routes';
import { cn } from '~/lib/cn';

import { $isAdvancedFilterUnavailable } from './country-filter-readiness.model';
import FilterPopup from './filter-popup';

const FilterButton = () => {
  const { t } = useTranslation();
  const isOpen = useStore($showAdvancedFilter);
  const country = useStore($country);
  const routes = useStore($mapRoutes);
  const isUnavailable = useStore($isAdvancedFilterUnavailable);
  const { selectedCount } = useStore($countrySearchParams);

  const isHidden =
    routes.schools || routes.entity || routes.entityView || !country?.id;

  if (isHidden) return null;

  // A native `disabled` button swallows pointer events, so the tooltip would
  // never open on the state it is meant to explain.
  const button = (
    <Button
      aria-disabled={isUnavailable || undefined}
      aria-label={t('filters')}
      className={cn(
        "font-['Open_Sans',sans-serif]! h-8! gap-1.5! rounded-md! px-2.5! text-sm!",
        isOpen
          ? 'bg-primary! text-primary-foreground! hover:bg-primary/90!'
          : 'bg-secondary! text-secondary-foreground! hover:bg-secondary/80!',
        isUnavailable &&
          'cursor-not-allowed! opacity-50! text-muted-foreground! hover:bg-secondary!',
      )}
      onClick={() => {
        if (isUnavailable) return;
        onShowAdvancedFilter(!isOpen);
      }}
      onKeyDown={(event) => {
        if (isOpen && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
        }
      }}
      size="sm"
      type="button"
      variant={isOpen ? 'default' : 'secondary'}
    >
      <SlidersHorizontal className="size-4!" />
      <span>{t('filters')}</span>
      {!isUnavailable && selectedCount > 0 && (
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
  );

  return (
    <div className="filter-wrapper-popup relative! z-99! my-2! mr-2! flex! flex-col! items-center!">
      <FilterPopup open={isOpen} setOpen={onShowAdvancedFilter}>
        {isUnavailable ? (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent align="center" side="bottom" sideOffset={4}>
              {t('no-filters-available')}
            </TooltipContent>
          </Tooltip>
        ) : (
          button
        )}
      </FilterPopup>
    </div>
  );
};

export default FilterButton;
