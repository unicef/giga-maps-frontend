import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import FooterTourContact from '../common-components/footer-tour-contact.view';
import {
  $hasSearchInput,
  $isSearchFocused,
} from '../common-components/top-search-bar/top-search-bar.model';
import SearchResultList from './views/search-result.list.view';

export default function SearchResult() {
  const isSearchFocus = useStore($isSearchFocused);
  const hasSearchInput = useStore($hasSearchInput);
  const { t } = useTranslation();

  if (!isSearchFocus || !hasSearchInput) return null;

  return (
    // The class is a hook for the blur handler in top-search-bar.view.tsx,
    // which keeps the panel open while the pointer is inside it.
    <div className="search-results-container absolute! top-[calc(100%+0.125rem)]! right-3.5! left-3.5! z-[13]! flex! max-h-[80vh]! flex-col! overflow-hidden! rounded-md! bg-surface-panel! shadow-md!">
      <SearchResultList />
      <FooterTourContact
        message={t('search-input-not-the-results-you-expected')}
        showTour={false}
      />
    </div>
  );
}
