import { useStore } from 'effector-react'
import React, { useEffect } from 'react'

import { backgroundTaskView } from '~/core/routes'

import { getBackgroundTaskIdFx } from '../../effects/background-task-fx'
import PageTitleComponent from '../common-components/page-title-component'
import { FormWrapper, SchoolAddEditWrapper } from '../styles/admin-styles'
import BackgroundTaskForm from './form-background-task'

const BackgroundTaskView = () => {
  const { id } = useStore(backgroundTaskView.params) as { id: number };
  useEffect(() => {
    if (id) {
      void getBackgroundTaskIdFx({ id })
    }
  }, [id]);

  return (
    <SchoolAddEditWrapper>
      <PageTitleComponent
        title={"View Background Task"}
        recentlyView={false} />
      <FormWrapper>
        <BackgroundTaskForm
        />
      </FormWrapper>
    </SchoolAddEditWrapper>
  )
}

export default BackgroundTaskView