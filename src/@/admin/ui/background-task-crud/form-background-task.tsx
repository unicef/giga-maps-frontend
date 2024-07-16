import { Button, DatePicker, DatePickerInput, Form, Select, SelectItem, TextArea, TextInput } from '@carbon/react'
import { useStore } from 'effector-react';

import { router } from '~/core/routes';

import { $formBackgroundTask } from '../../models/background-task-model';
import { BackgroundTaskInputBoxWrapper, BackgroundTasktTextAreaContainer, BottomButtonWrapper, InputContainer, InputLabel, RowContainer, TextAreaContainer } from '../styles/admin-styles'

const BackgroundTaskForm = () => {

  const formBackgroundTask = useStore($formBackgroundTask);

  return (
    <>
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
              {formBackgroundTask?.log}
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
    </>
  )
}

export default BackgroundTaskForm