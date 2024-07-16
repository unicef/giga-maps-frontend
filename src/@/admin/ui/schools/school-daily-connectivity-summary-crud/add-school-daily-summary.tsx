import React from 'react'

import PageTitleComponent from '../../common-components/page-title-component'
import { FormWrapper, SchoolAddEditWrapper } from '../../styles/admin-styles'
import FormSchoolDailySummary from './form-school-daily-summary'

const AddSchoolDailySummary = () => {
  return (
    <SchoolAddEditWrapper>
      <PageTitleComponent
        title={"School Daily Add"}
        recentlyView={false} />
      <FormWrapper>
        <FormSchoolDailySummary isEditMode={false} />
      </FormWrapper>
    </SchoolAddEditWrapper>
  )
}

export default AddSchoolDailySummary