
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import ClickAnywhere from '../common-components/click-anywhere';
import FooterTourContact from '../common-components/footer-tour-contact.view';
import {
  $hasSearchInput,
  $isSearchFocused,
  changeIsSearchFocused,
} from '../common-components/top-search-bar/top-search-bar.model';
import { SearchResultWrapper } from './styles/search-result-style';
import SearchResultList from './views/search-result.list.view';

export default function SearchResult() {
  const isSearchFocus = useStore($isSearchFocused);
  const hasSearchInput = useStore($hasSearchInput);
  const { t } = useTranslation();
  return (
    <>
      {isSearchFocus && hasSearchInput &&
        <SearchResultWrapper className='search-results-container'>
          <SearchResultList />
          <FooterTourContact message={t("search-input-not-the-results-you-expected")} />
        </SearchResultWrapper>
      }
    </>
  );
};
