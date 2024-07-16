import { Close } from '@carbon/icons-react'
import { IconButton } from '@carbon/react';
import { useStore } from "effector-react";

import { setSearchInMobile } from '../../common-components/top-search-bar/top-search-bar.model';
import { $searchHistoryData, onSearchItemClick, removeSearchHistory } from "../container/search-result.model";
import { LeftItem, RecentlyViewedIcon, RightItem, SearchHistoryStyle, SearchHistoryWrapper, SearchItem, SearchTopHead } from "../styles/search-result-style";

export default function SearchHistory() {
  const searchHistoryData = useStore($searchHistoryData);

  if (!searchHistoryData || !searchHistoryData.length) return null;
  const itemLength = searchHistoryData?.length - 1;
  return (<>
    <SearchTopHead>Recent</SearchTopHead >
    {searchHistoryData?.map((item, index) => (<SearchHistoryWrapper key={item.id}>
      <SearchItem $history={SearchHistoryStyle} onClick={(e) => {
        e.stopPropagation();
        onSearchItemClick(item)
        setSearchInMobile(false)
      }
      } $border={itemLength !== index}>
        <LeftItem as="div" $recent>
          <span>
            <RecentlyViewedIcon size={18} />
          </span>
          <LeftItem>
            {item.name}
          </LeftItem>
        </LeftItem>
        <RightItem>
          <IconButton
            onClick={(e: Event) => {
              e.stopPropagation();
              removeSearchHistory(item.id)
            }}
            label='Delete'
            className="sidebar-history-remove"
            size="md"
            kind="ghost"
          >
            <Close size="18" aria-label="share" />
          </IconButton>
        </RightItem>
      </SearchItem>
    </SearchHistoryWrapper>)
    )}
  </>)
}