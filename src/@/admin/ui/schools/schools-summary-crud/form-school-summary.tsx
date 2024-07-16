import { Button, Checkbox, DatePicker, DatePickerInput, Form, Select, SelectItem, TextArea, TextInput } from '@carbon/react'
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { FormEvent } from 'react';

import { createOrUpdateSchoolSummaryFx } from '~/@/admin/effects/api-school-fx';
import { $formSchoolSummary, onChangeAdminSchoolTab, onUdpateSchoolSummaryForm } from '~/@/admin/models/school-model';
import { $countryList } from "~/@/api-docs/models/explore-api.model";
import { adminSchools, router } from '~/core/routes';

import { AmenitiesContainer, BottomButtonWrapper, Checkboxwrapper, DailyCountryInput, DatePickerBoxWrapper, InputBoxWrapper, InputContainer, InputLabel, RowContainer, SchoolFormScroll, TextAreaContainer } from '../../styles/admin-styles'

const FormSchoolSummary = ({ isEditMode, schoolSummaryId }: { isEditMode: boolean, schoolSummaryId?: number }) => {

  const formDataSchoolSummary = useStore($formSchoolSummary);
  const countryList = useStore($countryList)
  const updateOrCreateSchoolSummary = async () => {
    try {
      const filteredFormData = Object.fromEntries(
        Object.entries(formDataSchoolSummary).filter(
          ([_, value]) => value !== null && value !== "")
      );
      const body = {
        ...filteredFormData
      }
      await createOrUpdateSchoolSummaryFx({
        body,
        params: { id: schoolSummaryId },
        isEditMode
      })
      adminSchools.navigate();
      onChangeAdminSchoolTab(1)
    } catch (e) {
      console.error(e)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void updateOrCreateSchoolSummary();
  }
  return (
    <>
      <Form onSubmit={onSubmit} id='admin-school-summary-form' autoComplete="off">
        <SchoolFormScroll>
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
                  value={formDataSchoolSummary?.connectivity_speed}
                  onChange={(e) =>
                    onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])
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
                  value={formDataSchoolSummary?.connectivity_latency}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
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
                  value={formDataSchoolSummary?.school}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
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
                  value={formDataSchoolSummary?.date}
                  onChange={(date) => {
                    onUdpateSchoolSummaryForm(['date', format(date[0], 'dd-MM-yyyy')])
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
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Number of students
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="num-student"
                  name='num_students'
                  placeholder='Enter number of student'
                  value={formDataSchoolSummary?.num_students}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Number of teachers
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="num-teacher"
                  name='num_teachers'
                  placeholder='Enter number of teachers'
                  value={formDataSchoolSummary?.num_teachers}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <DailyCountryInput>
              <InputLabel>
                Number pf classrooms
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="num-classroom"
                  name='num_classroom'
                  placeholder='Enter number of classroom'
                  value={formDataSchoolSummary?.num_classroom}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </DailyCountryInput>
            <DailyCountryInput>
              <InputLabel>
                Number of latrines
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="num-classroom"
                  name='num_latrines'
                  placeholder='Enter number of Latrines'
                  value={formDataSchoolSummary?.num_latrines}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </DailyCountryInput>
            <DailyCountryInput>
              <InputLabel>
                Number of computers
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="num-classroom"
                  name='num_computers'
                  placeholder='Enter number of Computers'
                  value={formDataSchoolSummary?.num_computers}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </DailyCountryInput>
          </RowContainer>
          <AmenitiesContainer>
            <InputLabel>
              Amenities
            </InputLabel>
            <div className='amenities-checkbox'>
              <Checkbox
                checked={formDataSchoolSummary?.running_water}
                onChange={(_e, { checked }) => onUdpateSchoolSummaryForm(["running_water", checked])}
                labelText={`Running water`}
                id="checkbox-label-1"
              />
              <Checkbox
                checked={formDataSchoolSummary?.electricity_availability}
                onChange={(_e, { checked }) => onUdpateSchoolSummaryForm(["electricity_availability", checked])}
                labelText={`Electricity availability`}
                id="checkbox-label-2" />
              <Checkbox
                checked={formDataSchoolSummary?.computer_lab}
                onChange={(_e, { checked }) => onUdpateSchoolSummaryForm(["computer_lab", checked])}
                labelText={`Computer lab`}
                id="checkbox-label-3" />
            </div>
          </AmenitiesContainer>
          <RowContainer>
            <DailyCountryInput>
              <InputLabel>
                Connectivity
              </InputLabel>
              <Select
                labelText=""
                name='connectivity'
                value={formDataSchoolSummary?.connectivity}
                id={`connectivity-select`}
                onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, e.target.value])}
                placeholder="Select Connectivity">
                <SelectItem value="Unknown" text="Unknown" />
                <SelectItem value="true" text="Yes" />
                <SelectItem value="false" text="No" />
              </Select>
            </DailyCountryInput>
            <DailyCountryInput>
              <InputLabel>
                Type of internet connection
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  type="text"
                  name='connectivity_type'
                  id="connectivity_type"
                  placeholder='Enter internet connection type'
                  value={formDataSchoolSummary?.connectivity_type}
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, e.target.value])}
                />
              </InputBoxWrapper>
            </DailyCountryInput>
            <DailyCountryInput>
              <InputLabel>
                Coverage availability
              </InputLabel>
              <Select
                labelText=""
                name='coverage_availability'
                id={`coverage-availability-select`}
                value={formDataSchoolSummary?.coverage_availability}
                placeholder="Select Coverage availability"
                onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, e.target.value])}
              >
                <SelectItem value="Unknown" text="Unknown" />
                <SelectItem value="true" text="Yes" />
                <SelectItem value="false" text="No" />
              </Select>
            </DailyCountryInput>
          </RowContainer>
          <RowContainer>
            <DailyCountryInput>
              <InputLabel>
                Coverage type
              </InputLabel>
              <Select
                labelText=""
                id={`coverage-type-select`}
                name='coverage_type'
                value={formDataSchoolSummary?.coverage_type}
                onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, e.target.value])}
                placeholder="Select Coverage Type">
                <SelectItem value="unknown" text="Unknown" />
                <SelectItem value="2g" text="2G" />
                <SelectItem value="3g" text="3G" />
                <SelectItem value="4g" text="4G" />
              </Select>
            </DailyCountryInput>
            <DailyCountryInput>
              <InputLabel>
                Year
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  min={0}
                  type="number"
                  labelText=""
                  id="year"
                  name='year'
                  value={formDataSchoolSummary?.year}
                  placeholder='Enter year'
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </DailyCountryInput>
            <DailyCountryInput>
              <InputLabel>
                Week
              </InputLabel>
              <InputBoxWrapper>
                <TextInput
                  min={0}
                  type="number"
                  labelText=""
                  id="week"
                  value={formDataSchoolSummary?.week}
                  placeholder='Enter week'
                  onChange={(e) => onUdpateSchoolSummaryForm([e.target.name, Number(e.target.value)])}
                />
              </InputBoxWrapper>
            </DailyCountryInput>
          </RowContainer>
        </SchoolFormScroll>
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
            kind="primary"
          >
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </BottomButtonWrapper>
      </Form >
    </>
  )
}

export default FormSchoolSummary