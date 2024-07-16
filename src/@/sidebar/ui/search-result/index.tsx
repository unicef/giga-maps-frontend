
import { useStore } from 'effector-react';
import FooterTourContact from '../common-components/footer-tour-contact.view';
import { $hasSearchInput, $isSearchFocused, $showCountries, changeIsSearchFocused, onShowCountriesAdminList } from '../common-components/top-search-bar/top-search-bar.model';
import { SearchCountryList } from './search-country-list';
import SearchSchoolPanel from './search-country-list/search-school-panel-view';
import { SearchListWrapper, SearchResultScroll, SearchResultWrapper } from './styles/search-result-style';
import SearchResultList from './views/search-result.list.view';

export default function SearchResult() {
  const isSearchFocus = useStore($isSearchFocused);
  const showCountries = useStore($showCountries);
  const hasSearchInput = useStore($hasSearchInput);
  return (
    <>
      {showCountries && <SearchListWrapper>
        <SearchResultScroll className="search-container">
          <SearchCountryList />
        </SearchResultScroll>
        < FooterTourContact message="Not the results you expected?" />
        <SearchSchoolPanel />
      </SearchListWrapper>}
      {isSearchFocus && hasSearchInput &&
        <SearchResultWrapper>
          <SearchResultScroll>
            <SearchResultList />
          </SearchResultScroll>
          <FooterTourContact message="Not the results you expected?" />
        </SearchResultWrapper>
      }
    </>
  );
};
