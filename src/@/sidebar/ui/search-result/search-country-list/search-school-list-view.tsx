import { combine, createEvent, restore, sample } from 'effector';
import { useStore } from "effector-react";

import { EmptyList } from '~/@/common/style/styled-component-style';

import { fetchSchoolListFx } from '../container/search-result.fx';
import { $searchSchoolList, $searchSchoolListValue, setSearchExpandLevel2, setSearchSchoolListValue } from '../container/search-result.model';
import { CloseSchoolList, CloseSchoolListIcon, Loading, SchoolCheckbox, SchoolHeader, SchoolListContainer, SchoolSearch } from '../styles/search-result-style';
import { SearchSchool } from "./search-school-item-view";


const SearchSchoolListPanel = () => {
  const { results: data } = useStore($searchSchoolList) || {};
  const isLoading = useStore(fetchSchoolListFx.pending);
  const searchValue = useStore($searchSchoolListValue);
  const isDone = useStore(fetchSchoolListFx.inFlight);
  const schoolList = data;
  const isListEmpty = !data?.length && !isDone;
  return (
    <SchoolListContainer>
      <SchoolHeader>
        <CloseSchoolList>
          <p>School List</p>
          <CloseSchoolListIcon
            data-testid="close-school-list-icon"
            onClick={() => setSearchExpandLevel2("")} />
        </CloseSchoolList>
        <SchoolSearch
          value={searchValue}
          size="md"
          placeholder="Search schools"
          labelText="Search"
          closeButtonLabelText="Clear search input"
          onChange={(event) => setSearchSchoolListValue(event.target.value)}
        />
      </SchoolHeader>
      {isLoading && <Loading description="Loading..." />}
      {isListEmpty && <EmptyList>Not found found</EmptyList>}
      {!isLoading && !!data?.length && schoolList?.map(school => <SearchSchool key={school.id} school={school} />)}
    </SchoolListContainer>
  )

}

export default SearchSchoolListPanel;