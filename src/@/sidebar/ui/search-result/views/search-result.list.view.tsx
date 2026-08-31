import { useStore } from 'effector-react';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Scroll } from '~/@/scroll';

import {
  $searchInput,
  setSearchInMobile,
} from '../../common-components/top-search-bar/top-search-bar.model';
import { SEARCH_DATA_TYPE } from '../container/search-result.constant';
import { getSearchResultsFx } from '../container/search-result.fx';
import {
  $hasMoreResults,
  $searchPage,
  $searchResultCollection,
  loadMoreResults,
  onSearchItemClick,
} from '../container/search-result.model';
import { SearchType } from '../container/search-result.type';
import SearchResultNotFoundView from '../search-country-list/search-result-not-found-view';

function HighlightedText({
  query,
  children,
}: PropsWithChildren<{ query: string }>) {
  const string = children as string;
  const highlightedString = useMemo(() => {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'gi');
    return string.replace(regex, (match) => `<b>${match}</b>`);
  }, [query, string]);

  return <span dangerouslySetInnerHTML={{ __html: highlightedString }} />;
}

export default function SearchResultList() {
  const searchResult = useStore($searchResultCollection) as SearchType[];
  const searchInput = useStore($searchInput);
  const isLoading = useStore(getSearchResultsFx.pending);
  const isDone = useStore(getSearchResultsFx.inFlight);
  const isListEmpty = !searchResult?.length && !isDone;
  const hasMore = useStore($hasMoreResults);
  const { t } = useTranslation();
  const page = useStore($searchPage);
  const scrollRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (scrollRef.current && page === 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [page]);

  const fetchMoreData = () => {
    if (!isLoading && hasMore) {
      loadMoreResults();
    }
  };

  const renderLoader = () => {
    return (
      <p className="p-4! text-sm! text-muted-foreground!">{t('loading')}</p>
    );
  };

  const renderItems = () => {
    return searchResult?.map((item: SearchType) => (
      <button
        className="flex! w-full! cursor-pointer! flex-col! justify-center! border-b! border-border! px-4! py-3! text-left! transition-colors! hover:bg-surface-elevated!"
        onClick={(e) => {
          e.stopPropagation();
          onSearchItemClick(item);
          setSearchInMobile(false);
        }}
        key={`${item?.id}`}
        type="button"
      >
        <span className="w-full! text-sm! text-foreground!">
          <HighlightedText query={searchInput}>{t(item?.name)}</HighlightedText>
        </span>
        <span className="w-full! text-xs! text-on-surface-muted!">
          {item.type === SEARCH_DATA_TYPE.COUNTRY && t('country')}
          {item.type === SEARCH_DATA_TYPE.SCHOOL && (
            <>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
              {t(`${item.entityTypetag}-entity-label`, {
                count: 1,
              })}{' '}
              {t('in')}{' '}
              <span className="text-primary!">
                {item?.adminName} / {t(item.countryName)}
              </span>
            </>
          )}
          {item.type === SEARCH_DATA_TYPE.ADMIN1 && (
            <>
              {t('district')} {t('in')}{' '}
              <span className="text-primary!">{t(item.countryName)}</span>
            </>
          )}
        </span>
      </button>
    ));
  };
  return (
    // Kept on perfect-scrollbar (not shadcn's ScrollArea) because InfiniteScroll
    // resolves `scrollableTarget` by id once, on mount.
    <Scroll
      className="max-h-[calc(80vh-4.5rem)]!"
      containerRef={(element) => {
        scrollRef.current = element;
      }}
      id="scrollableDiv"
    >
      {isLoading && searchResult?.length === 0 && (
        <p className="p-4! text-sm! text-muted-foreground!">{t('loading')}</p>
      )}
      {isListEmpty && <SearchResultNotFoundView />}
      {!!searchResult?.length && (
        <InfiniteScroll
          dataLength={searchResult.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={renderLoader()}
          scrollableTarget="scrollableDiv"
          endMessage={
            <p className="my-6! text-center! text-xs! text-on-surface-subtle!">
              {t('no-more-results')}
            </p>
          }
        >
          {renderItems()}
        </InfiniteScroll>
      )}
    </Scroll>
  );
}
