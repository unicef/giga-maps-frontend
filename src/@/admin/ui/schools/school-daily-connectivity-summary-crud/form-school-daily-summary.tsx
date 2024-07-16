import { Button, DatePicker, DatePickerInput, Form, TextInput } from '@carbon/react'
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { FormEvent } from 'react';

import { createOrUpdateSchoolDailyFx } from '~/@/admin/effects/api-school-fx';
import { $formSchoolDaily, onChangeAdminSchoolTab, onUdpateSchoolDailyForm } from '~/@/admin/models/school-model';
import { $countryList } from "~/@/api-docs/models/explore-api.model";
import { adminSchools, router } from '~/core/routes';

import { BottomButtonWrapper, DatePickerBoxWrapper, InputBoxWrapper, InputContainer, InputLabel, RowContainer, } from '../../styles/admin-styles'

const FormSchoolDailySummary = ({ isEditMode, schoolDailyId }: { isEditMode: boolean, schoolDailyId?: number }) => {

  const formSchoolDaily = useStore($formSchoolDaily);
  const countryList = useStore($countryList)
  const updateOrCreateSchoolDaily = async () => {
    try {
      const filteredFormData = Object.fromEntries(
        Object.entries(formSchoolDaily).filter(
          ([_, value]) => value !== null && value !== "")
      );
      const body = {
        ...filteredFormData
      }
      await createOrUpdateSchoolDailyFx({
        body,
        params: { id: schoolDailyId },
        isEditMode
      })
      adminSchools.navigate();
      onChangeAdminSchoolTab(2)
    } catch (e) {
      console.error(e)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void updateOrCreateSchoolDaily();
  }
  return (
    <>
      <Form onSubmit={onSubmit} id='school-daily-form' autoComplete="off">
        <RowContainer>
          <InputContainer>
            <InputLabel>
              Connectivity speed
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="connectivity-speed"
                name='connectivity_speed'
                value={formSchoolDaily?.connectivity_speed}
                onChange={(e) =>
                  onUdpateSchoolDailyForm([e.target.name, Number(e.target.value)])
                }
                placeholder='Enter connectivity speed'
              />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Connectivity latency
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="connectivity-latency"
                name='connectivity_latency'
                placeholder='Enter connectivity latency'
                value={formSchoolDaily?.connectivity_latency}
                onChange={(e) => onUdpateSchoolDailyForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          <InputContainer>
            <InputLabel>
              School Id
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                required
                type="number"
                min={0}
                labelText=""
                id="school-id"
                name='school'
                placeholder='Enter school id'
                value={formSchoolDaily?.school}
                onChange={(e) => onUdpateSchoolDailyForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Date of join
            </InputLabel>
            <DatePickerBoxWrapper>
              <DatePicker
                datePickerType="single"
                dateFormat='d/m/Y'
                value={formSchoolDaily?.date}
                onChange={(date) => {
                  onUdpateSchoolDailyForm(['date', format(date[0], 'dd-MM-yyyy')])
                }}
              >
                <DatePickerInput
                  required
                  labelText=""
                  id="date-picker-join-date"
                  placeholder="dd/mm/yyyy"
                />
              </DatePicker>
            </DatePickerBoxWrapper>
          </InputContainer>
        </RowContainer>
        <BottomButtonWrapper>
          <Button
            kind="secondary"
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            kind="primary">
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </BottomButtonWrapper>
      </Form >
    </>
  )
}

export default FormSchoolDailySummary