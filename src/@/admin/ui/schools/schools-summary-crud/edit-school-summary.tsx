import { useStore } from 'effector-react';
import React, { useEffect } from 'react'

import { getSchoolSummaryIdFx } from '~/@/admin/effects/api-school-fx';
import { editSchoolSummary } from '~/core/routes';

import PageTitleComponent from '../../common-components/page-title-component';
import { FormWrapper, SchoolAddEditWrapper } from '../../styles/admin-styles';
import FormSchoolSummary from './form-school-summary'

const EditSchoolSummary = () => {
  const { id } = useStore(editSchoolSummary.params) as { id: number };
  useEffect(() => {
    if (id) {
      void getSchoolSummaryIdFx({ id })
    }
  }, [id]);
  return (
    <>
      <SchoolAddEditWrapper>
        <PageTitleComponent
          title={"School Summary Edit"}
          recentlyView={false} />
        <FormWrapper>
          <FormSchoolSummary
            schoolSummaryId={id}
            isEditMode={true} />
        </FormWrapper>
      </SchoolAddEditWrapper>


    </>
  )
}

export default EditSchoolSummary