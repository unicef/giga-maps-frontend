import { useStore } from "effector-react";
import { Tag as FilterTag } from '@carbon/react';
import { $countrySearchParams } from "~/@/country/country.model";
import { onShowAdvancedFilter } from "~/@/sidebar/sidebar.model";
import { router } from "~/core/routes"
import { FilterTagContainer } from "./filter-button.style";
import { useTranslation } from "react-i18next";

const FilterCountInfoTag = () => {
  const { selectedCount } = useStore($countrySearchParams);
  const { t } = useTranslation();

  return (<>
    {selectedCount > 0 && <FilterTagContainer className="filter-tag-container">
      <FilterTag size="md" onClick={() => {
        onShowAdvancedFilter(true);
      }} onClose={() => router.navigate(`${window.location.pathname}`)} filter type='high-contrast'>
        {selectedCount} {t('filter-applied')}
      </FilterTag>
    </FilterTagContainer>}
  </>)
}

export default FilterCountInfoTag;
