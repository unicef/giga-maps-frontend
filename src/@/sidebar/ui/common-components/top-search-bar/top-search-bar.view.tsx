import { ChevronDown, ChevronUp, Earth } from '@carbon/icons-react'
import { useStore } from 'effector-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { $isMobile } from '~/core/media-query';
import { getVoid } from '~/lib/effector-kit';
import { getInputValue } from '~/lib/event-reducers';

import { $searchInput, $showCountries, changeIsSearchFocused, changeSearchText, clearSearchText, onShowCountriesAdminList } from './top-search-bar.model';
import { CountrySearchIcon, SearchContainer, SearchWrapper } from './top-search-bar.style';


const onChange = changeSearchText.prepend(getInputValue);
const onClear = clearSearchText.prepend(getVoid);

const TopSearchBar = () => {
  const searchText = useStore($searchInput);
  const showCountries = useStore($showCountries)
  const isMobile = useStore($isMobile)
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const onBlurSearch = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the newly focused element is inside our search results
    const relatedTarget = e.relatedTarget as HTMLElement;
    const searchResults = document.querySelector('.search-results-container');

    // If the related target is not inside search results and not the search input itself
    if (searchResults && !searchResults.contains(relatedTarget) &&
      searchContainerRef.current && !searchContainerRef.current.contains(relatedTarget)) {
      setTimeout(() => changeIsSearchFocused(false), 0);
    }
  }
  return (
    <SearchWrapper className="top-search-bar" ref={searchContainerRef}>
      <CountrySearchIcon
        align={'bottom-left'}
        label={t('country-list')}
        className='main-search-list'
        onClick={() => {
          onShowCountriesAdminList(!showCountries)
        }}
        size="lg"
        kind="primary"
      >
        <Earth />
        {showCountries ? <ChevronUp /> : <ChevronDown />}
      </CountrySearchIcon>
      <SearchContainer
        size="lg"
        placeholder={t("search-country-region-school-id")}
        labelText="Search"
        closeButtonLabelText={t("clear-search-input")}
        id="main-search-bar"
        autoFocus={isMobile}
        onChange={onChange}
        onFocus={() => {
          changeIsSearchFocused(true);
        }}
        onBlur={onBlurSearch}
        value={searchText}
        className={"sidebar-searchbox"}
        $isMobile={isMobile}
        onClear={() => {
          onClear();
        }}
      />
    </SearchWrapper >
  );
};

export default TopSearchBar;
