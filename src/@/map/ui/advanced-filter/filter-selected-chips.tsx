import { Tag as FilterTag } from '@carbon/react';
import { useMemo } from 'react';
import { onShowAdvancedFilter } from '~/@/sidebar/sidebar.model';
import { router } from "~/core/routes"
import { $advanceFilterList } from '../../map.model';
import { $countrySearchParams } from '~/@/country/country.model';
import { useStore } from 'effector-react';
import styled from 'styled-components';

// Styled container for responsive filter chips
const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  max-width: calc(100vw - 30rem);
  justify-content: flex-end;
  margin-right: .5rem;
  
  /* Responsive adjustments for different screen sizes */
  @media (max-width: 768px) {
    display: none;
  }
 
`;

// Style for each chip to ensure proper spacing
const ChipWrapper = styled.span`
  margin-bottom: .5rem;
  display: inline-block;
`;

const FilterSelectedChips = () => {
  const advanceFilterList = useStore($advanceFilterList);
  const { urlFieldList, searchParamsURL } = useStore($countrySearchParams);

  const selectedFilterChips = useMemo(() => {
    const selectedFields: {
      name: string;
      key: string;
    }[] = [];
    advanceFilterList?.forEach(item => {
      const itemKey = `${item.column_configuration.name}__${item.query_param_filter}`;
      const field = urlFieldList[itemKey];
      const name = item.name;
      if (field) {
        selectedFields.push({
          name,
          key: itemKey
        })
      }
    })
    return selectedFields;
  }, [advanceFilterList, urlFieldList]);

  if (!selectedFilterChips.length) return null;
  return (<>
    <ChipsContainer>
      <ChipWrapper>
        <FilterTag onClick={() => {
          router.navigate(`${window.location.pathname}`)
        }} filter type='high-contrast' renderIcon={() => null}>
          Clear All
        </FilterTag>
      </ChipWrapper>

      {selectedFilterChips.map((item, index) => (
        <ChipWrapper key={`${index}_${item.key}`}>
          <FilterTag onClick={() => {
            onShowAdvancedFilter(true);
          }} onClose={() => {
            const splitKey = item.key.split('__');
            searchParamsURL.delete(`filter__${item.key}`)
            searchParamsURL.delete(`filter__ignore_${item.key}`)
            searchParamsURL.delete(`filter__${splitKey[0]}__none_${splitKey[1]}`)
            router.navigate(`${window.location.pathname}?${searchParamsURL.toString()}`);
          }} filter type='green'>
            {item.name}
          </FilterTag>
        </ChipWrapper>
      ))}
    </ChipsContainer>
  </>)
}

export default FilterSelectedChips