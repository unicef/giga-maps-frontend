import React from 'react'

import PageTitleComponent from '../../common-components/page-title-component'
import { FormWrapper, SchoolAddEditWrapper } from '../../styles/admin-styles'
import FormSchoolSummary from './form-school-summary'

const AddSchoolSummary = () => {
  return (
    <SchoolAddEditWrapper>
      <PageTitleComponent
        title={"School Summary Add"}
        recentlyView={false} />
      <FormWrapper>
        <FormSchoolSummary isEditMode={false} />
      </FormWrapper>
    </SchoolAddEditWrapper>
  )
}

export default AddSchoolSummary