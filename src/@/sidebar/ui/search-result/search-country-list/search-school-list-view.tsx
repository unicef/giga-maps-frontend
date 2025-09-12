import { useStore } from "effector-react";

import { EmptyList } from '~/@/common/style/styled-component-style';

import { fetchSchoolListFx } from '../container/search-result.fx';
import { $searchSchoolList, $searchSchoolListValue, setSearchExpandLevel2, setSearchSchoolListValue } from '../container/search-result.model';
import { CloseSchoolList, CloseSchoolListIcon, Loading, SchoolHeader, SchoolListContainer, SchoolSearch } from '../styles/search-result-style';
import { SearchSchool } from "./search-school-item-view";
import { useTranslation } from "react-i18next";


const SearchSchoolListPanel = () => {
  const { results: data } = useStore($searchSchoolList) ?? {};
  const isLoading = useStore(fetchSchoolListFx.pending);
  const searchValue = useStore($searchSchoolListValue);
  const isDone = useStore(fetchSchoolListFx.inFlight);
  const schoolList = data;
  const isListEmpty = !data?.length && !isDone;
  const { t } = useTranslation();
  return (
    <SchoolListContainer>
      <SchoolHeader>
        <CloseSchoolList>
          <p>{t('school-list')}</p>
          <CloseSchoolListIcon
            data-testid="close-school-list-icon"
            onClick={() => setSearchExpandLevel2("")} />
        </CloseSchoolList>
        <SchoolSearch
          value={searchValue}
          size="md"
          placeholder={t("search-schools")}
          labelText="Search"
          closeButtonLabelText={t("clear-search-input")}
          onChange={(event) => setSearchSchoolListValue(event.target.value)}
        />
      </SchoolHeader>
      {isLoading && <Loading description="Loading..." />}
      {isListEmpty && <EmptyList>{t('not-found')}</EmptyList>}
      {!isLoading && !!data?.length && schoolList?.map(school => <SearchSchool key={school.id} school={school} />)}
    </SchoolListContainer>
  )

}

export default SearchSchoolListPanel;