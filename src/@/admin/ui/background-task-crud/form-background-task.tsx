import React from 'react';
import { Button, Form } from '@carbon/react'
import { useStore } from 'effector-react';

import { router } from '~/core/routes';

import { $formBackgroundTask } from '../../models/background-task-model';
import { BackgroundTaskInputBoxWrapper, BackgroundTasktTextAreaContainer, BottomButtonWrapper, InputContainer, InputLabel, RowContainer } from '../styles/admin-styles'

const BackgroundTaskForm = () => {

  const formBackgroundTask = useStore($formBackgroundTask);

  const formatLog = (log: string | undefined) => {
    if (!log) return null
    return log.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Form>
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Task id
          </InputLabel>
          <BackgroundTaskInputBoxWrapper>
            <p>
              {formBackgroundTask?.task_id}
            </p>
          </BackgroundTaskInputBoxWrapper>
        </InputContainer>
        <InputContainer>
          <InputLabel>
            Status
          </InputLabel>
          <BackgroundTaskInputBoxWrapper>
            <p>
              {formBackgroundTask?.status}
            </p>
          </BackgroundTaskInputBoxWrapper>
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Unique Name
          </InputLabel>
          <BackgroundTaskInputBoxWrapper>
            <p>
              {formBackgroundTask?.name}
            </p>
          </BackgroundTaskInputBoxWrapper>
        </InputContainer>
        <InputContainer>
          <InputLabel>
            Description
          </InputLabel>
          <BackgroundTaskInputBoxWrapper>
            <p>
              {formBackgroundTask?.description}
            </p>
          </BackgroundTaskInputBoxWrapper>
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Created at
          </InputLabel>
          <BackgroundTaskInputBoxWrapper>
            <p>
              {formBackgroundTask?.created_at}
            </p>
          </BackgroundTaskInputBoxWrapper>
        </InputContainer>
        <InputContainer>
          <InputLabel>
            Completed at
          </InputLabel>
          <BackgroundTaskInputBoxWrapper>
            <p>
              {formBackgroundTask?.completed_at}
            </p>
          </BackgroundTaskInputBoxWrapper>
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <BackgroundTasktTextAreaContainer>
          <InputLabel>
            Log
          </InputLabel>
          <p>
            {formatLog(formBackgroundTask?.log)}
          </p>
        </BackgroundTasktTextAreaContainer>
      </RowContainer>
      <BottomButtonWrapper>
        <Button
          kind="secondary"
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </BottomButtonWrapper>
    </Form>
  )
}

export default BackgroundTaskForm