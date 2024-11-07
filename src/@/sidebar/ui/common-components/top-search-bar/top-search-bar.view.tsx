import { ChevronDown, Earth, Search } from '@carbon/icons-react'
import { useStore } from 'effector-react';
import { useState } from 'react';

import { $isMobile } from '~/core/media-query';
import { getVoid } from '~/lib/effector-kit';
import { getInputValue } from '~/lib/event-reducers';

import { $searchInput, $showCountries, changeIsSearchFocused, changeSearchText, clearSearchText, onShowCountriesAdminList, } from './top-search-bar.model';
import { CountrySearchIcon, SearchContainer, SearchWrapper } from './top-search-bar.style';
import { useTranslation } from 'react-i18next';


const onChange = changeSearchText.prepend(getInputValue);
const onClear = clearSearchText.prepend(getVoid);

const TopSearchBar = () => {
  const searchText = useStore($searchInput);
  const showCountries = useStore($showCountries)
  const isMobile = useStore($isMobile)
  const [mobileSearch, setMobileSearch] = useState(false)
  const { t } = useTranslation();

  const onBlurSearch = () => {
    setTimeout(() => {
      changeIsSearchFocused(false)
    }, 300)
  }
  return (
    <SearchWrapper className="top-search-bar">
      <CountrySearchIcon
        align={'bottom-left'}
        label='Country List'
        className='main-search-list'
        onClick={() => {
          onShowCountriesAdminList(!showCountries)
        }}
        size="lg"
        kind="primary"
      >
        <Earth />
        <ChevronDown />
      </CountrySearchIcon>
      {isMobile && !mobileSearch ? (
        <Search
          className='search-icon'
          onClick={() => { setMobileSearch(true); }}
        />
      ) : null}
      {(isMobile && mobileSearch || !isMobile) && <SearchContainer
        size="lg"
        placeholder={t("search-country-region-school-id")}
        labelText="Search"
        closeButtonLabelText="Clear search input"
        id="main-search-bar"
        autoFocus={isMobile}
        onChange={onChange}
        onFocus={() => changeIsSearchFocused(true)}
        onBlur={onBlurSearch}
        value={searchText}
        className={"sidebar-searchbox"}
        $isMobile={isMobile}
        onClear={() => {
          onClear();
          isMobile && setMobileSearch(false);
          changeIsSearchFocused(false);
        }}
      />}
    </SearchWrapper >
  );
};

export default TopSearchBar;
