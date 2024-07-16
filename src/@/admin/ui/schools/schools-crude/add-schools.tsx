import React from 'react'

import PageTitleComponent from '../../common-components/page-title-component'
import { FormWrapper, SchoolAddEditWrapper } from '../../styles/admin-styles'
import FormSchools from './form-schools'

const AddSchools = () => {
  return (
    <SchoolAddEditWrapper>
      <PageTitleComponent
        recentlyView={false}
        title={"School Add"} />
      <FormWrapper>
        <FormSchools isEditMode={false} />
      </FormWrapper>
    </SchoolAddEditWrapper>

  )
}

export default AddSchools