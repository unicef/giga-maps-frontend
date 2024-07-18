import { useStore } from 'effector-react'

import { createCountryDailySummaryFx } from '~/@/admin/effects/api-country-fx'
import { $formDataCountryDailySummary, onChangeAdminCountryTab, onUdpateCountryDailySummaryForm } from '~/@/admin/models/country-model'
import { adminCountry } from '~/core/routes'

import FormCountryDailySummary from './form-country-daily-summary'

const AddCountryDailySummary = () => {

  const formDataCountryDailySummary = useStore($formDataCountryDailySummary)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const filteredBody = Object.fromEntries(
        Object.entries(formDataCountryDailySummary).filter(([_, value]) => value !== null)
      );
      await createCountryDailySummaryFx({
        body: { ...filteredBody },
      })
      adminCountry.navigate();
      onChangeAdminCountryTab(2)
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <FormCountryDailySummary
      onSubmit={onSubmit}
      onUdpateForm={onUdpateCountryDailySummaryForm}
      formData={formDataCountryDailySummary}
      isEdit={false} />
  )
}

export default AddCountryDailySummary