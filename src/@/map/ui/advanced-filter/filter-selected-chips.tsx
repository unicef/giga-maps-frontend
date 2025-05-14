import { Tag as FilterTag } from '@carbon/react';
import { useMemo } from 'react';
import { onShowAdvancedFilter } from '~/@/sidebar/sidebar.model';
import { router } from "~/core/routes"
import { $advanceFilterList } from '../../map.model';
import { $countrySearchParams } from '~/@/country/country.model';
import { useStore } from 'effector-react';


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
  return (
    <>
      <FilterTag onClick={() => {
        router.navigate(`${window.location.pathname}`)
      }} filter type='high-contrast' renderIcon={() => null}>
        Clear All
      </FilterTag>
      {selectedFilterChips.map((item, index) => (<>
        <FilterTag key={`${index}_${item.key}`} onClick={() => {
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
      </>))}
    </>
  )
}

export default FilterSelectedChips