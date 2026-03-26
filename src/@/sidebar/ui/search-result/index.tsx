
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
      {isSearchFocus && hasSearchInput && (
        <ClickAnywhere
          classList={['top-search-bar', 'search-results-container', 'search-container', 'main-search-list', 'sidebar-searchbox']}
          outsideClick={() => {
            changeIsSearchFocused(false);
          }}
          trigger={isSearchFocus && hasSearchInput}
        />
      )}
      {isSearchFocus && hasSearchInput &&
        <SearchResultWrapper>
          <SearchResultList />
          <FooterTourContact message={t("not-the-results-you-expected")} />
        </SearchResultWrapper>
      }
    </>
  );
};
