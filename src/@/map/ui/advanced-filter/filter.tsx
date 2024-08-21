import { Tuning } from '@carbon/icons-react'
import { IconButton, Tag as FilterTag, Button } from '@carbon/react';
import { useStore } from 'effector-react';
import { useTheme } from 'styled-components';

import { $showAdvancedFilter, $sidebarHeight, onShowAdvancedFilter, onShowLegend } from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';

import { useEffect, useMemo } from 'react';
import { FilterButtonWrapper, FilterTagContainer, FilterWrapper, Tag } from './filter-button.style';
import FilterPopup from './filter-popup';
import { $mapRoutes, router } from '~/core/routes';
import { $country, $countrySearchParams, $countrySearchString } from '~/@/country/country.model';
import { $advanceFilterList } from '../../map.model';
import { $isMobile } from '~/core/media-query';

const FilterButton = () => {
  const theme = useTheme();
  const isOpen = useStore($showAdvancedFilter)
  const country = useStore($country);
  const routes = useStore($mapRoutes);
  const isMobile = useStore($isMobile);
  const countrySearchString = useStore($countrySearchString);
  const { selectedCount } = useStore($countrySearchParams);
  const advanceFilterList = useStore($advanceFilterList);
  const showFilter = () => {
    onShowAdvancedFilter(!isOpen);
  };
  useEffect(() => {
    if (isOpen) {
      onShowLegend(false);
    }
  }, [isOpen]);
  const isDisabled = useMemo(() => {
    if (routes.schools || !country?.id || !advanceFilterList?.length) {
      return true;
    }
    return false;
  }, [advanceFilterList, country?.id, routes.schools]);

  const sidebarHeight = useStore($sidebarHeight)
  if (isDisabled) return null;
  return (
    <>
      {selectedCount > 0 && <FilterTagContainer className="filter-tag-container">
        <FilterTag onClick={() => {
          onShowAdvancedFilter(true);
        }} onClose={() => router.navigate(`${window.location.pathname}`)} filter type='red'>
          {selectedCount} filter applied
        </FilterTag>
      </FilterTagContainer>}
      <FilterWrapper className="filter-wrapper-popup" $zIndex={isOpen ? 0 : 1} $bottom={sidebarHeight}>
        <FilterPopup caret={false} open={isOpen} setOpen={onShowAdvancedFilter} align={isMobile ? "left" : "left"}>
          <FilterButtonWrapper $iconColor={theme.white}>
            <Button
              align="left"
              onClick={showFilter}
              disabled={isDisabled}
              size="sm"
              label="Filter"
              tooltipText='Filters'
            >
              <Tuning fill={theme.white} />
              <span>Filters</span>
            </Button>
            {!!countrySearchString && <Tag />}
          </FilterButtonWrapper>
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