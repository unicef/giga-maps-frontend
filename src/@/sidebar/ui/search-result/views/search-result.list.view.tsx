import { useStore } from "effector-react";
import { PropsWithChildren, useMemo } from "react";

import { $searchInput, setSearchInMobile } from "../../common-components/top-search-bar/top-search-bar.model";
import { SEARCH_DATA_TYPE } from "../container/search-result.constant";
import { getSearchResultsFx } from "../container/search-result.fx";
import { $searchResultCollection, onSearchItemClick } from "../container/search-result.model";
import { SearchType } from "../container/search-result.type";
import SearchResultNotFoundView from "../search-country-list/search-result-not-found-view";
import { LeftItem, Loading, SearchItem } from "../styles/search-result-style";
import { useTranslation } from "react-i18next";


function HighlightedText({ query, children }: PropsWithChildren<{ query: string }>) {
  const string = children as string;
  const highlightedString = useMemo(() => {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'gi');
    return string.replace(regex, match => `<b>${match}</b>`);
  }, [query, string]);

  return (
    <span dangerouslySetInnerHTML={{ __html: highlightedString }} />
  );
}


export default function SearchResultList() {
  const searchResult = useStore($searchResultCollection) as SearchType[];
  const searchInput = useStore($searchInput);
  const isLoading = useStore(getSearchResultsFx.pending)
  const isDone = useStore(getSearchResultsFx.inFlight);
  const isListEmpty = !searchResult?.length && !isDone;
  const itemLength = searchResult?.length - 1;
  const { t } = useTranslation();
  return (<>
    {isLoading && <Loading description="Loading..." />}
    {isListEmpty && <SearchResultNotFoundView />}
    {!isLoading && !!searchResult?.length &&
      searchResult?.map((item: SearchType, index: number) => (
        <SearchItem onClick={() => {
          onSearchItemClick(item)
          setSearchInMobile(false)
        }} key={`${item?.id}`} $border={itemLength !== index}>
          <LeftItem $fullWidth>
            <HighlightedText query={searchInput}>{t(item?.name)}</HighlightedText>
            {item.type === SEARCH_DATA_TYPE.COUNTRY && <span className="type-name">{t('country')}</span>}
            {item.type === SEARCH_DATA_TYPE.SCHOOL && <span className="type-name">
              {t('school')} <span className="light">{' '}{t('in')}{' '}</span>
              <span className="highlight">{item?.adminName}{' '}/{' '}{t(item.countryName)}</span>
            </span>}
            {item.type === SEARCH_DATA_TYPE.ADMIN1 && <span className="type-name">
              {t('district')} <span className="light">{' '}{t('in')}{' '}</span>
              <span className="highlight">{t(item.countryName)}</span>
            </span>}
          </LeftItem>
        </SearchItem>)
      )}
  </>)
}