
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { fetchCountriesWithDistrictFx } from '../container/search-result.fx';
import { $searchCountryList } from '../container/search-result.model';
import { SearchTopHead } from '../styles/search-result-style';
import { SearchCountry } from './search-country-view';
import SearchResultLoading from './search-result-loading.view';

export const SearchCountryList = () => {
  const searchCountryList = useStore($searchCountryList);
  const isLoading = useStore(fetchCountriesWithDistrictFx.pending);
  useEffect(() => {
    if (!searchCountryList?.length) {
      void fetchCountriesWithDistrictFx(null);
    }
  }, [searchCountryList]);

  if (isLoading) return <SearchResultLoading />;
  return (<>
    {/* <SearchHistory /> */}
    <SearchTopHead as="p">Select country, region, school(s)</SearchTopHead>
    {searchCountryList.map((countryData) => <SearchCountry key={countryData.country_id} countryData={countryData} />)}
  </>);
};
