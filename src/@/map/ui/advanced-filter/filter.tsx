import { Tuning } from '@carbon/icons-react'
import { Button, IconButton, Tag as FilterTag } from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { $country, $countrySearchParams, $countrySearchString } from '~/@/country/country.model';
import { $showAdvancedFilter, $sidebarHeight, onShowAdvancedFilter, onShowLegend } from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes, router } from '~/core/routes';

import { $advanceFilterList } from '../../map.model';
import { FilterButtonWrapper, FilterTagContainer, FilterWrapper, Tag } from './filter-button.style';
import FilterPopup from './filter-popup';
import FilterSelectedChips from './filter-selected-chips';

const FilterButton = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isOpen = useStore($showAdvancedFilter)
  const country = useStore($country);
  const routes = useStore($mapRoutes);
  const isMobile = useStore($isMobile);
  const countrySearchString = useStore($countrySearchString);
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
    <>
      <FilterWrapper className="filter-wrapper-popup" $isMobile={isOpen ? false : true} $zIndex={isOpen ? 0 : 1} $bottom={sidebarHeight}>

        <FilterPopup caret={false} open={isOpen} setOpen={onShowAdvancedFilter} align={isMobile ? "left" : "left"}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* <FilterSelectedChips /> */}
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
                  <span className="h-5! px-2.5! py-0.5! bg-connectivity-green-200! rounded-md! inline-flex! justify-center! items-center! gap-1! ml-1!">
                    <div className="h-4! flex justify-center! items-center! gap-2.5!">
                      <div className="justify-start! text-grey-900! text-xs! font-normal! leading-4!">
                        {selectedCount}
                      </div>
                    </div>
                  </span>
                )}
              </Button>
            </FilterButtonWrapper>
          </div>
        </FilterPopup>
      </FilterWrapper>
      {isOpen && <ClickAnywhere
        classList={['filter-wrapper-popup', 'filter-tag-container']}
        trigger={isOpen}
        outsideClick={() => {
          onShowAdvancedFilter(false)
        }}
      />}
    </>
  )
}

export default FilterButton