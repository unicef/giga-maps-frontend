
import { useStore } from 'effector-react';
import { useEffect, useRef } from 'react';

import { Scroll } from '~/@/scroll';

import { $schoolListCurrentPage, $searchAdminLevel2 } from '../container/search-result.model';
import { SchoolListWrapper } from '../styles/search-result-style';
import { SearchButtonGroup } from './search-button-group';
import SearchSchoolList from './search-school-list-view';

export default function SearchSchoolPanel() {
  const isExpanded = useStore($searchAdminLevel2);
  const scrollRef = useRef<Scroll & { scrollTop: number }>();
  const currentPage = useStore($schoolListCurrentPage);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentPage])

  if (!isExpanded) return null;
  return (
    <SchoolListWrapper className="school-list-wrapper">
      <Scroll ref={scrollRef}>
        <SearchSchoolList />
      </Scroll>
      <SearchButtonGroup />
    </SchoolListWrapper>
  );
};
