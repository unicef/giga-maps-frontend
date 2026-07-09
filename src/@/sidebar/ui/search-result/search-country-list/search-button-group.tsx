import { Close } from '@carbon/icons-react';
import { useStore } from "effector-react";
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { $isMobile } from '~/core/media-query';

import { setSearchInMobile } from '../../common-components/top-search-bar/top-search-bar.model';
import { SCHOOL_LIST_PAGE_SIZE } from '../container/search-result.constant';
import { fetchSchoolListFx } from '../container/search-result.fx';
import { $schoolListCurrentPage, $searchAdminLevel2, $searchSchoolIds, $searchSchoolList, onSchoolListCurrentPage, resetSchoolSelection, triggerSearchApply } from '../container/search-result.model';
import { ApplyButton, ButtonGroup, CloseButton, FooterWrapper, SchoolCount, SchoolListPagination, SelectedColumn, SeletedText } from "../styles/search-result-style";

const CloseIcon = styled(Close)`
  fill: #222;
`

export const SearchButtonGroup = () => {
  const isExpanded = useStore($searchAdminLevel2);
  const { count = 0 } = useStore($searchSchoolList) ?? {};
  const currentPage = useStore($schoolListCurrentPage);
  const isLoading = useStore(fetchSchoolListFx.pending);
  const { size } = useStore<Set<string>>($searchSchoolIds);
  const isMobile = useStore($isMobile);
  const { t } = useTranslation();
  if (!isExpanded) return null;

  return <FooterWrapper $isMobile={isMobile} >
    <ButtonGroup $hide={!size} >
      <SelectedColumn>
        <SeletedText>{t('school-s-selected')}</SeletedText>
        <SchoolCount>
          {size}&nbsp;
          <CloseButton data-testid="selected-school-close-button"
            onClick={() => resetSchoolSelection()}>
            <CloseIcon />
          </CloseButton>
        </SchoolCount>
      </SelectedColumn>
      <ApplyButton kind="primary"
        data-testid="selected-school-apply-button"
        onClick={() => {
          setSearchInMobile(false)
          triggerSearchApply()
        }}>{t('apply')}</ApplyButton>
    </ButtonGroup>
    <SchoolListPagination
      style={isMobile ? { position: 'absolute' } : {}}
      disabled={isLoading}
      totalItems={count}
      pageSizes={[SCHOOL_LIST_PAGE_SIZE]}
      page={currentPage + 1}
      className={isMobile ? 'absolute!' : ''}
      hideSteppers
      pageRangeText={(_current: number, _count: number) => t('of-page', { count: _count })}
      size="sm"
      onChange={({ page }: { page: number }) => onSchoolListCurrentPage(page - 1)}
    />
  </FooterWrapper>
}