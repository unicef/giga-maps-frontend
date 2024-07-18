import { Button, DatePicker, DatePickerInput, Form, Select, SelectItem, TextInput } from '@carbon/react'
import { format } from 'date-fns'
import { useStore } from 'effector-react'

import { CountryDailySummaryType } from '~/@/admin/types/country.type'
import { $countryList } from '~/@/api-docs/models/explore-api.model'
import { router } from '~/core/routes'

import { BottomButtonWrapper, DatePickerBoxWrapper, InputBoxWrapper, InputContainer, InputLabel, RowContainer, } from '../../styles/admin-styles'

const FormCountryDailySummary = ({ isEdit, formData, onUdpateForm, onSubmit }: { isEdit: boolean, formData: CountryDailySummaryType, onUdpateForm: unknown, onSubmit: unknown }) => {

  const countryList = useStore($countryList)

  return (
    <Form onSubmit={onSubmit}
      id='country-daily-summary-form'
    >
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Connectivity speed
          </InputLabel>
          <InputBoxWrapper>
            <TextInput
              type="number"
              labelText=""
              min={0}
              id="connectivity-speed"
              placeholder='Enter connectivity speed'
              name='connectivity_speed'
              value={formData?.connectivity_speed}
              onChange={(e) =>
                onUdpateForm([e.target.name, Number(e.target.value)])
              }
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
              labelText=""
              id="connectivity-latency"
              name='connectivity_latency'
              placeholder='Enter connectivity latency'
              value={formData?.connectivity_latency}
              onChange={(e) => onUdpateForm([e.target.name, Number(e.target.value)])}
            />
          </InputBoxWrapper>
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Country
          </InputLabel>
          <Select
            required
            labelText=""
            id={`select-country`}
            name='country'
            value={formData?.country}
            onChange={(e) => {
              onUdpateForm([e.target.name, Number(e.target.value)])
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
        </InputContainer>
        <InputContainer>
          <InputLabel>
            Date of Join
          </InputLabel>
          <DatePickerBoxWrapper>
            <DatePicker
              datePickerType="single"
              dateFormat='d/m/Y'
              value={formData?.date}
              onChange={(date) => {
                onUdpateForm(['date', format(date[0], 'dd-MM-yyyy')])
              }}
            >
              <DatePickerInput
                labelText=""
                id="date-picker-join-date"
                required
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
          data-testid="submit-country-daily-summary"
          type='submit'
          kind="primary">
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </BottomButtonWrapper>
    </Form>
  )
}

export default FormCountryDailySummary