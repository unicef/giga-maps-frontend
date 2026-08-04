import { Tuning } from '@carbon/icons-react'
import { Button } from '@carbon/react';
import { useStore } from 'effector-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { $country, $countrySearchParams } from '~/@/country/country.model';
import { $showAdvancedFilter, $sidebarHeight, onShowAdvancedFilter } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes } from '~/core/routes';

import { $advanceFilterList } from '../../map.model';
import { FilterButtonWrapper, FilterWrapper } from './filter-button.style';
import FilterPopup from './filter-popup';

const FilterButton = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isOpen = useStore($showAdvancedFilter)
  const country = useStore($country);
  const routes = useStore($mapRoutes);
  const isMobile = useStore($isMobile);
  const advanceFilterList = useStore($advanceFilterList);
  const { selectedCount } = useStore($countrySearchParams);
  const showFilter = () => {
    onShowAdvancedFilter(!isOpen);
  };
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
  }, [advanceFilterList, country?.id, routes.schools, routes.entity, routes.entityView]);

  const sidebarHeight = useStore($sidebarHeight)
  if (isDisabled) return null;
  return (
    <FilterWrapper className="filter-wrapper-popup" $isMobile={isOpen ? false : true} $zIndex={isOpen ? 0 : 1} $bottom={sidebarHeight}>
      <FilterPopup caret={false} open={isOpen} setOpen={onShowAdvancedFilter} align={isMobile ? "left" : "left"}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <FilterButtonWrapper $iconColor={theme.white}>
            <Button
              align="left"
              onClick={showFilter}
              disabled={isDisabled}
              size="sm"
              label={t('filters')}
              tooltipText={t('filters')}
            >
              <Tuning fill={theme.white} />
              <span>{t('filters')}</span>
              {selectedCount > 0 && (
                <span className="ml-1! inline-flex! h-5! min-w-5! items-center! justify-center! rounded-full! bg-primary! px-1.5! text-xs! font-normal! leading-none! text-primary-foreground!">
                  {selectedCount}
                </span>
              )}
            </Button>
          </FilterButtonWrapper>
        </div>
      </FilterPopup>
    </FilterWrapper>
  )
}

export default FilterButton
