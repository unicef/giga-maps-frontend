import { useStore } from 'effector-react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { $countrySearchParams } from '~/@/country/country.model';
import { onShowAdvancedFilter } from '~/@/sidebar/sidebar.model';
import { Badge } from '~/components/ui/badge';
import { router } from '~/core/routes';

const FilterCountInfoTag = () => {
  const { selectedCount } = useStore($countrySearchParams);
  const { t } = useTranslation();

  if (selectedCount <= 0) return null;

  return (
    <div className="filter-tag-container pointer-events-none! fixed! inset-x-0! left-0! right-0! z-1! flex! justify-start! px-4! pt-8! pb-2!">
      <Badge
        className="pointer-events-auto! cursor-pointer! gap-1!"
        onClick={() => {
          onShowAdvancedFilter(true);
        }}
        variant="default"
      >
        <button
          className="inline-flex!"
          onClick={(event) => {
            event.stopPropagation();
            onShowAdvancedFilter(true);
          }}
          type="button"
        >
          {selectedCount} {t('filter-applied')}
        </button>
        <button
          aria-label={t('clear-all')}
          className="inline-flex!"
          onClick={(event) => {
            event.stopPropagation();
            router.navigate(`${window.location.pathname}`);
          }}
          type="button"
        >
          <X className="size-3!" />
        </button>
      </Badge>
    </div>
  );
};

export default FilterCountInfoTag;
