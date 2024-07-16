import { useStore } from 'effector-react'
import React, { useEffect } from 'react'

import { getSchoolDailyIdFx } from '~/@/admin/effects/api-school-fx'
import { editSchoolDailySummary } from '~/core/routes'

import PageTitleComponent from '../../common-components/page-title-component'
import { FormWrapper, SchoolAddEditWrapper } from '../../styles/admin-styles'
import FormSchoolDailySummary from './form-school-daily-summary'

const EditSchoolDailySummary = () => {

  const { id } = useStore(editSchoolDailySummary.params) as { id: number };
  useEffect(() => {
    if (id) {
      void getSchoolDailyIdFx({ id })
    }
  }, [id]);
  return (
    <SchoolAddEditWrapper>
      <PageTitleComponent
        title={"School Daily Edit"}
        recentlyView={false} />
      {/* <SchoolGate id={id} /> */}
      <FormWrapper>
        <FormSchoolDailySummary
          schoolDailyId={id}
          isEditMode={true}
        />
      </FormWrapper>
    </SchoolAddEditWrapper>

  )
}

export default EditSchoolDailySummary