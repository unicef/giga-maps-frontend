import { Button, DatePicker, DatePickerInput, Form, Select, SelectItem, TextInput } from '@carbon/react'
import { format } from 'date-fns'
import { useStore } from 'effector-react'
import { FormEvent } from 'react'

import { createCountrySummaryFx } from '~/@/admin/effects/api-country-fx'
import { $formDataCountrySummary, onChangeAdminCountryTab, onUdpateCountrySummaryForm } from '~/@/admin/models/country-model'
import { $countryList } from '~/@/api-docs/models/explore-api.model'
import { adminCountry, router } from '~/core/routes'

import { BottomButtonWrapper, CountrySummaryFormScroll, DailyCountryInput, DatePickerBoxWrapper, InputBoxWrapper, InputLabel, RowContainer } from '../../styles/admin-styles'

const FormCountrySummary = ({ isEditMode, countrySummaryItemId }: { isEditMode: boolean, countrySummaryItemId?: number }) => {

  const formDataCountrySummary = useStore($formDataCountrySummary);
  const countryList = useStore($countryList)
  const updateOrCreateCountrySummary = async () => {
    try {
      const filteredFormData = Object.fromEntries(
        Object.entries(formDataCountrySummary).filter(
          ([_, value]) => value !== null && value !== "")
      );
      const body = {
        ...filteredFormData
      }
      await createCountrySummaryFx({
        body,
        params: { id: countrySummaryItemId },
        isEditMode
      })
      adminCountry.navigate();
      onChangeAdminCountryTab(1)
    } catch (e) {
      console.error(e)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void updateOrCreateCountrySummary();
  }

  return (
    <Form aria-label="country-summary-form" id='country-summary-form' onSubmit={onSubmit} autoComplete="off">
      <CountrySummaryFormScroll>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Connectivity speed
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type='number'
                min={0}
                labelText=""
                id="connectivity-speed"
                name='connectivity_speed'
                value={formDataCountrySummary?.connectivity_speed}
                onChange={(e) =>
                  onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])
                }
                placeholder='Enter connectivity speed'
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Connectivity latency
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type='number'
                step="any"
                min={0}
                labelText=""
                id="connectivity-latency"
                name='connectivity_latency'
                placeholder='Enter connectivity latency'
                value={formDataCountrySummary?.connectivity_latency}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, parseFloat(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Country
            </InputLabel>
            <Select
              required
              labelText=""
              id={`select-country`}
              name='country'
              value={formDataCountrySummary?.country}
              onChange={(e) => {
                onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])
              }
              }
              placeholder="Select Country"
              defaultValue=""
            >
              <SelectItem value="" text="choose country" />
              {
                countryList.map((countryObj, index) => (
                  <SelectItem
                    key={countryObj.id}
                    value={countryObj.id}
                    text={countryObj.name} />
                ))
              }
            </Select>
          </DailyCountryInput>
        </RowContainer>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Date of Join
            </InputLabel>
            <DatePickerBoxWrapper>
              <DatePicker
                datePickerType="single"
                dateFormat='d/m/Y'
                value={formDataCountrySummary?.date}
                onChange={(date) => {
                  onUdpateCountrySummaryForm(['date', format(date[0], 'dd-MM-yyyy')])
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
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              School Total
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type='number'
                min={0}
                labelText=""
                id="num-school"
                placeholder='Enter school number'
                name='schools_total'
                value={formDataCountrySummary?.schools_total}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              School Connected
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type='number'
                min={0}
                labelText=""
                id="num-connected-school"
                placeholder='Enter connected school'
                name='schools_connected'
                value={formDataCountrySummary?.schools_connected}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
        </RowContainer>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Schools connectivity good
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="num-Schools-connectivity-good"
                placeholder='Enter schools connectivity good'
                name='schools_connectivity_good'
                value={formDataCountrySummary?.schools_connectivity_good}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Schools connectivity moderate
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                placeholder='Enter schools connectivity moderate'
                id="num-schools-connectivity-moderate"
                name='schools_connectivity_moderate'
                value={formDataCountrySummary?.schools_connectivity_moderate}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Schools connectivity no
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="num-schools-connectivity-no"
                placeholder='Enter schools connectivity no'
                name='schools_connectivity_no'
                value={formDataCountrySummary?.schools_connectivity_no}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
        </RowContainer>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Schools connectivity unknown
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="num-schools-connectivity-unknown"
                placeholder='Enter schools connectivity unknown'
                name='schools_connectivity_unknown'
                value={formDataCountrySummary?.schools_connectivity_unknown}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Schools coverage good
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="num-schools-coverage-good"
                placeholder='Enter schools coverage good'
                name='schools_coverage_good'
                value={formDataCountrySummary?.schools_coverage_good}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Schools coverage moderate
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="num-schools-coverage-moderate"
                placeholder='Enter schools coverage moderate'
                name='schools_coverage_moderate'
                value={formDataCountrySummary?.schools_coverage_moderate}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
        </RowContainer>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Schools coverage no
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                placeholder='Enter schools coverage no'
                id="num-schools-coverage-no"
                name='schools_coverage_no'
                value={formDataCountrySummary?.schools_coverage_no}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Schools coverage unknown
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={0}
                labelText=""
                id="num-schools-coverage-unknown"
                placeholder='Enter schools coverage unknown'
                name='schools_coverage_unknown'
                value={formDataCountrySummary?.schools_coverage_unknown}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Avg distance school
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                labelText=""
                id="num-avg-distance-school"
                placeholder='Enter avg distance school'
                name='avg_distance_school'
                value={formDataCountrySummary?.avg_distance_school}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, parseFloat(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
        </RowContainer>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Schools with data percentage
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                labelText=""
                id="num-schools-with-data-percentage:"
                placeholder='Enter schools with data percentage'
                name='schools_with_data_percentage'
                value={formDataCountrySummary?.schools_with_data_percentage}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, parseFloat(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Year
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="number"
                min={2000}
                labelText=""
                id="countr-year"
                placeholder='Enter year'
                name='year'
                value={formDataCountrySummary?.year}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Week
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type='number'
                min={0}
                labelText=""
                placeholder='Enter week'
                id="country-week"
                name='week'
                value={formDataCountrySummary?.week}
                onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              />
            </InputBoxWrapper>
          </DailyCountryInput>
        </RowContainer>
        <RowContainer>
          <DailyCountryInput>
            <InputLabel>
              Integration status
            </InputLabel>
            <Select
              labelText=""
              id="integration-status"
              placeholder='Enter integration status'
              name='integration_status'
              value={formDataCountrySummary?.integration_status}
              onChange={(e) => onUdpateCountrySummaryForm([e.target.name, Number(e.target.value)])}
              defaultValue="4"
            >
              <SelectItem value="4" text="Default Country Status" />
              <SelectItem value="0" text="Country Joined GigaMaps" />
              <SelectItem value="5" text="School OSM locations mapped" />
              <SelectItem value="1" text="School locations mapped" />
              <SelectItem value="2" text="Static connectivity mapped" />
              <SelectItem value="3" text="Real time connectivity mapped" />
            </Select>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Connectivity availability
            </InputLabel>
            <Select
              labelText=""
              id={`connectivity-availability`}
              placeholder="Select connectivity availability"
              name='connectivity_availability'
              value={formDataCountrySummary?.connectivity_availability}
              onChange={(e) => onUdpateCountrySummaryForm([e.target.name, e.target.value])}
              defaultValue="no_connectivity"
            >
              <SelectItem value="no_connectivity" text="No data" />
              <SelectItem value="connectivity" text="Using availability information" />
              <SelectItem value="realtime_speed" text="Using actual realtime speeds" />
              <SelectItem value="static_speed" text="Using actual static speeds" />
            </Select>
          </DailyCountryInput>
          <DailyCountryInput>
            <InputLabel>
              Coverage availability
            </InputLabel>
            <Select
              labelText=""
              id={`coverage-availability-select-country`}
              placeholder="Select Coverage availability"
              name='coverage_availability'
              value={formDataCountrySummary?.coverage_availability}
              onChange={(e) => onUdpateCountrySummaryForm([e.target.name, e.target.value])}
              defaultValue="no_coverage"
            >
              <SelectItem value="no_coverage" text="No data" />
              <SelectItem value="coverage_availability" text="Using availability information" />
              <SelectItem value="coverage_type" text="Using actual coverage type" />
            </Select>
          </DailyCountryInput>
        </RowContainer>
      </CountrySummaryFormScroll>
      <BottomButtonWrapper>
        <Button
          kind="secondary"
          onClick={() => {
            router.navigate('/admin/country/?tab=1');
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
    </Form>
  )
}

export default FormCountrySummary