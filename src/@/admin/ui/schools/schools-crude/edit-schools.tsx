import { useStore } from 'effector-react'
import React, { useEffect } from 'react'

import { getSchoolIdFx } from '~/@/admin/effects/api-school-fx'
import { SchoolGate } from '~/@/admin/models/school-model'
import { Scroll } from '~/@/scroll'
import { editAdminSchools } from '~/core/routes'

import PageTitleComponent from '../../common-components/page-title-component'
import { FormWrapper, SchoolAddEditWrapper } from '../../styles/admin-styles'
import FormSchools from './form-schools'

const EditSchools = () => {
  const { id } = useStore(editAdminSchools.params) as { id: number };
  useEffect(() => {
    if (id) {
      void getSchoolIdFx({ id })
    }
  }, [id]);
  return (
    <SchoolAddEditWrapper>
      <PageTitleComponent
        title={"School Edit"}
        recentlyView={false} />
      {/* <SchoolGate id={id} /> */}
      <FormWrapper>
        <FormSchools
          schoolId={id}
          isEditMode={true}
        />
      </FormWrapper>
    </SchoolAddEditWrapper>
  )
}

export default EditSchools