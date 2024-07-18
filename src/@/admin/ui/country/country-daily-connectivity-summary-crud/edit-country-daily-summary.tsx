import { useStore } from 'effector-react'
import React, { FormEvent, useEffect } from 'react'

import { getCountryDailySummaryIdFx, updateCountryDailySummaryIdFx } from '~/@/admin/effects/api-country-fx'
import { $formDataCountryDailySummary, onChangeAdminCountryTab, onUdpateCountryDailySummaryForm } from '~/@/admin/models/country-model'
import { adminCountry, editCountryDailySummary } from '~/core/routes'

import FormCountryDailySummary from './form-country-daily-summary'

const EditCountryDailySummary = () => {

  const { id } = useStore(editCountryDailySummary.params) as { id: number };
  const formDataCountryDailySummary = useStore($formDataCountryDailySummary)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const filteredData = {
        country: formDataCountryDailySummary?.country,
        date: formDataCountryDailySummary?.date,
        connectivity_speed: formDataCountryDailySummary?.connectivity_speed,
        connectivity_latency: formDataCountryDailySummary?.connectivity_latency,
      };
      const filteredBody = Object.fromEntries(
        Object.entries(filteredData).filter(([_, value]) => value !== null)
      );
      await updateCountryDailySummaryIdFx({
        dailySummaryId: id,
        body: filteredBody,
      })
      adminCountry.navigate();
      onChangeAdminCountryTab(2)
    }
    catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (id) {
      void getCountryDailySummaryIdFx({ id })
    }
  }, [id]);


  return (
    <>
      {/* <CountryDailySummaryGate id={id} /> */}
      {
        formDataCountryDailySummary &&
        <FormCountryDailySummary
          onSubmit={onSubmit}
          onUdpateForm={onUdpateCountryDailySummaryForm}
          formData={formDataCountryDailySummary}
          isEdit={true} />
      }

    </>
  )
}

export default EditCountryDailySummary