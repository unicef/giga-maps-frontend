import { Search } from '@carbon/icons-react'
import { Button, Form, Link, Select, SelectItem, TextInput } from "@carbon/react"
import { useStore } from "effector-react";
import { FormEvent, useEffect, useState } from 'react';

import { createOrUpdateSchoolFx, getAdmin1ListFx, getAdmin2ListFx } from "~/@/admin/effects/api-school-fx";
import { $admin1Values, $admin2Values, $formSchool, onChangeAdmin1, onChangeAdmin2, onChangeAdminSchoolTab, onUdpateSchoolForm } from "~/@/admin/models/school-model";
import { $countryList } from "~/@/api-docs/models/explore-api.model";
import { adminSchools, router } from "~/core/routes";

import { BottomButtonWrapper, InputBoxWrapper, InputContainer, InputLabel, LastWeekStatusWrapper, LayerConfigButtonWrapper, RowContainer, SchoolFieldsWrapper, SchoolFormScroll, SchoolInputContainer, WeeklyStatslinkSchool } from "../../styles/admin-styles"


const FormSchools = ({ isEditMode, schoolId }: { isEditMode: boolean, schoolId?: number }) => {

  const formSchool = useStore($formSchool);
  const countryList = useStore($countryList)
  const [timezones, setTimezones] = useState([]);
  const admin1Values = useStore($admin1Values)
  const admin2Values = useStore($admin2Values)

  const updateOrCreateSchool = async () => {

    try {
      if (typeof formSchool.geopoint?.coordinates === "string") {
        const [latitude, longitude] = formSchool.geopoint.coordinates.split(',');
        formSchool.geopoint.coordinates = [parseFloat(latitude), parseFloat(longitude)];
      }

      const filteredFormData = Object.fromEntries(
        Object.entries(formSchool).filter(
          ([_, value]) => value !== null)
      );
      const body = {
        ...filteredFormData
      }
      await createOrUpdateSchoolFx({
        body,
        params: { id: schoolId },
        isEditMode
      })
      adminSchools.navigate();
      onChangeAdminSchoolTab(0)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    const allTimezones = Intl.supportedValuesOf('timeZone')
    setTimezones([allTimezones]);
  }, [])

  useEffect(() => {
    if (formSchool?.country) {
      void getAdmin1ListFx({ layerName: "adm1", countryId: formSchool?.country })
    }
  }, [formSchool?.country])

  useEffect(() => {
    if (formSchool?.country) {
      void getAdmin2ListFx({ layerName: "adm2", countryId: formSchool?.country, parentId: formSchool?.admin1 })
    }
  }, [formSchool?.admin1])


  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void updateOrCreateSchool();
  }
  return (
    <>
      <Form onSubmit={onSubmit} id='admin-school-form' autoComplete="off">
        <SchoolFormScroll>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                External id
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  id="external-id"
                  placeholder="Enter external id"
                  name='external_id'
                  value={formSchool?.external_id}
                  onChange={(e) =>
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Giga id school
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  id="giga-id"
                  required
                  placeholder="Enter giga id"
                  name='giga_id_school'
                  value={formSchool?.giga_id_school}
                  onChange={(e) =>
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                School name
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  required
                  labelText=""
                  id="school-name"
                  placeholder="Enter school name"
                  name='name'
                  value={formSchool?.name}
                  onChange={(e) =>
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Country
              </InputLabel>
              <Select
                required
                labelText=""
                id={`select-country`}
                name='country'
                value={formSchool?.country}
                onChange={(e) => {
                  onUdpateSchoolForm([e.target.name, e.target.value])
                  if (e.target.value === '') {
                    onChangeAdmin1([])
                  }
                  onChangeAdmin2([])
                }
                }
                placeholder="Select Country"
                defaultValue=""
              >
                <SelectItem value="" text="Choose country" />
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
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Admin 1
              </InputLabel>
              <Select
                labelText=""
                id={`select-admin-1`}
                name='admin1'
                value={formSchool?.admin1}
                onChange={(e) => {
                  onUdpateSchoolForm([e.target.name, e.target.value])
                  if (e.target.value === '') {
                    onChangeAdmin2([])
                  }
                }
                }
                placeholder="Enter admin 1 name"
                defaultValue=""
              >
                <SelectItem value="" text="Choose admin 1" />
                {
                  admin1Values.map((admin1Obj, index) => (
                    <SelectItem
                      key={admin1Obj?.id}
                      value={admin1Obj?.id}
                      text={admin1Obj?.name} />
                  ))
                }
              </Select>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Admin 2
              </InputLabel>
              <Select
                labelText=""
                id={`select-admin-2`}
                name='admin2'
                value={formSchool?.admin2}
                onChange={(e) => {
                  onUdpateSchoolForm([e.target.name, e.target.value])
                }
                }
                placeholder="Enter admin 2 name"
                defaultValue=""
              >
                <SelectItem value="" text="Choose admin 2" />
                {
                  admin2Values.map((admin1Obj, index) => (
                    <SelectItem
                      key={admin1Obj?.id}
                      value={admin1Obj?.id}
                      text={admin1Obj?.name} />
                  ))
                }
              </Select>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Timezone
              </InputLabel>
              <Select
                labelText=""
                required
                id={`select-Environment`}
                name='timezone'
                value={formSchool?.timezone}
                onChange={(e) => {
                  onUdpateSchoolForm([e.target.name, e.target.value])
                }
                }
                placeholder="Select timezone"
                defaultValue=""
              >
                <SelectItem value="" text="Choose timezone" />
                {
                  timezones[0]?.map((zone, index) => (
                    <SelectItem key={index} value={zone} text={zone} />
                  ))
                }
              </Select>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Geopoint
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  required
                  labelText=""
                  id="altitude"
                  placeholder="Enter geopoint"
                  name='geopoint'
                  value={formSchool?.geopoint?.coordinates}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, e.target.value, "coordinates"])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Gps confidence
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="number"
                  labelText=""
                  id="gps-confidence"
                  placeholder="Enter gps confidence"
                  name='gps_confidence'
                  value={formSchool?.gps_confidence}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, Number(e.target.value)])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Altitude
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="altitude"
                  placeholder="Enter altitude"
                  name='altitude'
                  value={formSchool?.altitude}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, Number(e.target.value)])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Address
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  id="altitude"
                  placeholder="Enter address"
                  name='address'
                  value={formSchool?.address}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Postal code
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="number"
                  min={0}
                  labelText=""
                  id="postal-code"
                  placeholder="Enter postal code"
                  name='postal_code'
                  value={formSchool?.postal_code}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, Number(e.target.value)])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Email
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  placeholder="Enter Email"
                  name='email'
                  value={formSchool?.email}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Education level
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  id="altitude"
                  placeholder="Enter Education level:"
                  name='education_level'
                  value={formSchool?.education_level}
                  onChange={(e) => {
                    console.log(e.target.value)
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Education level regional
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  placeholder="Enter Education level regional"
                  name='education_level_regional'
                  value={formSchool?.education_level_regional}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Environment
              </InputLabel>
              <Select
                labelText=""
                id={`select-Environment`}
                name='environment'
                value={formSchool?.environment}
                onChange={(e) => {
                  onUdpateSchoolForm([e.target.name, e.target.value])
                }
                }
                placeholder="Select Environment"
                defaultValue=""
              >
                <SelectItem value="" text="Select environment" />
                <SelectItem value="rural" text="Rural" />
                <SelectItem value="urban" text="Urban" />
              </Select>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                School type
              </InputLabel>
              <SchoolFieldsWrapper>
                <TextInput
                  type="text"
                  labelText=""
                  id="altitude"
                  placeholder="School type"
                  name='school_type'
                  value={formSchool?.school_type}
                  onChange={(e) => {
                    onUdpateSchoolForm([e.target.name, e.target.value])
                  }
                  }
                />
              </SchoolFieldsWrapper>
            </InputContainer>
            <InputContainer>
              <InputLabel>
                Last week status
              </InputLabel>
              <LastWeekStatusWrapper>
                <InputBoxWrapper>
                  <TextInput
                    min={0}
                    type="number"
                    labelText=""
                    id="last-week-status"
                    name='last_weekly_status'
                    placeholder='Enter last week status'
                    value={formSchool?.last_weekly_status}
                    onChange={(e) => {
                      onUdpateSchoolForm([e.target.name, e.target.value])
                    }
                    }
                  />
                </InputBoxWrapper>
                <Link href="/admin/schools/?tab=1" target="_blank">
                  <Search />
                </Link>
              </LastWeekStatusWrapper>
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <InputContainer>
              <InputLabel>
                Weekly Stats
              </InputLabel>
              <WeeklyStatslinkSchool>
                <Link href="/admin/schools/?tab=1" target="_blank">
                  Here
                </Link>
                {/* <Link onClick={() => onChangeAdminSchoolTab(1)} to={adminSchools}>Here</Link> */}
              </WeeklyStatslinkSchool>
            </InputContainer>
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
            kind="primary">
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </BottomButtonWrapper>
      </Form>
    </>
  )
}

export default FormSchools