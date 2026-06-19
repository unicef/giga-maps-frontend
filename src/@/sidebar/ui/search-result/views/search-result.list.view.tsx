import { useStore } from "effector-react";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import { DEFAULT_ENTITY_REGISTRY } from "~/@/entities";

import { $searchInput, setSearchInMobile } from "../../common-components/top-search-bar/top-search-bar.model";
import { SEARCH_DATA_TYPE } from "../container/search-result.constant";
import { getSearchResultsFx } from "../container/search-result.fx";
import { $hasMoreResults, $searchPage, $searchResultCollection, loadMoreResults, onSearchItemClick } from "../container/search-result.model";
import { SearchType } from "../container/search-result.type";
import SearchResultNotFoundView from "../search-country-list/search-result-not-found-view";
import { LeftItem, Loading, NoMoreResults, SearchItem, SearchResultScroll } from "../styles/search-result-style";


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
  const isLoading = useStore(getSearchResultsFx.pending);
  const isDone = useStore(getSearchResultsFx.inFlight);
  const isListEmpty = !searchResult?.length && !isDone;
  const itemLength = searchResult?.length - 1;
  const hasMore = useStore($hasMoreResults);
  const { t } = useTranslation();
  const page = useStore($searchPage)
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current && page === 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [page])

  const fetchMoreData = () => {
    if (!isLoading && hasMore) {
      loadMoreResults();
    }
  };

  const renderLoader = () => {
    return <Loading description="Loading more..." />;
  };

  const renderItems = () => {
    return searchResult?.map((item: SearchType, index: number) => (
      <SearchItem
        onClick={(e) => {
          e.stopPropagation();
          onSearchItemClick(item);
          setSearchInMobile(false);
        }}
        key={`${item?.id}`}
        $border={itemLength !== index}
      >
        <LeftItem $fullWidth>
          <HighlightedText query={searchInput}>{t(item?.name)}</HighlightedText>
          {item.type === SEARCH_DATA_TYPE.COUNTRY && <span className="type-name">{t('country')}</span>}
          {item.type === SEARCH_DATA_TYPE.SCHOOL && <span className="type-name">
            {t(DEFAULT_ENTITY_REGISTRY[item.entityTypetag].slug)} <span className="light">{' '}{t('in')}{' '}</span>
            <span className="highlight">{item?.adminName}{' '}/{' '}{t(item.countryName)}</span>
          </span>}
          {item.type === SEARCH_DATA_TYPE.ADMIN1 && <span className="type-name">
            {t('district')} <span className="light">{' '}{t('in')}{' '}</span>
            <span className="highlight">{t(item.countryName)}</span>
          </span>}
        </LeftItem>
      </SearchItem>
    ));
  };
  console.log(searchResult);
  return (<SearchResultScroll ref={scrollRef} id="scrollableDiv" className="search-results-container">

    {isLoading && searchResult?.length === 0 && <Loading description="Loading..." />}
    {isListEmpty && <SearchResultNotFoundView />}
    {!!searchResult?.length && (
      <InfiniteScroll
        dataLength={searchResult.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={renderLoader()}
        scrollableTarget="scrollableDiv"
        endMessage={
          <NoMoreResults>
            {t('no-more-results')}
          </NoMoreResults>
        }
      >
        {renderItems()}
      </InfiniteScroll>
    )}
  </SearchResultScroll>)
}