
import { useStore } from 'effector-react';
import FooterTourContact from '../common-components/footer-tour-contact.view';
import { $hasSearchInput, $isSearchFocused, $showCountries } from '../common-components/top-search-bar/top-search-bar.model';
import { SearchCountryList } from './search-country-list';
import SearchSchoolPanel from './search-country-list/search-school-panel-view';
import { SearchListWrapper, SearchResultScroll, SearchResultWrapper } from './styles/search-result-style';
import SearchResultList from './views/search-result.list.view';
import { useTranslation } from 'react-i18next';

export default function SearchResult() {
  const isSearchFocus = useStore($isSearchFocused);
  const showCountries = useStore($showCountries);
  const hasSearchInput = useStore($hasSearchInput);
  const { t } = useTranslation();
  return (
    <>
      {showCountries && <SearchListWrapper>
        <SearchResultScroll className="search-container">
          <SearchCountryList />
        </SearchResultScroll>
        < FooterTourContact message={t("not-the-results-you-expected")} />
        < SearchSchoolPanel />
      </SearchListWrapper>}
      {isSearchFocus && hasSearchInput &&
        <SearchResultWrapper>
          <SearchResultScroll>
            <SearchResultList />
          </SearchResultScroll>
          <FooterTourContact message={t("not-the-results-you-expected")} />
        </SearchResultWrapper>
      }
    </>
  );
};
