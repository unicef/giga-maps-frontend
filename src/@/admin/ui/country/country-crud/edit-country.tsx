import { useStore } from 'effector-react'
import React, { useEffect } from 'react'

import { getCountryIdFx } from '~/@/admin/effects/api-country-fx'
import { $showMessage, setToasterWarning } from '~/@/admin/models/country-model'
import { InlineToast } from '~/@/common/style/styled-component-style'
import { editAdminCountry } from '~/core/routes'
import { timeoutStore } from '~/lib/effector-kit'

import PageTitleComponent from '../../common-components/page-title-component'
import { CountryAddEditWrapper, CountryToastWrapper } from '../../styles/admin-styles'
import FormCountry from './form-country'

timeoutStore({
  clock: setToasterWarning,
  target: setToasterWarning,
  resetState: '',
  timeout: 2000
})

const EditCountry = () => {
  const { id } = useStore(editAdminCountry.params) as { id: number };
  const isPending = useStore(getCountryIdFx.pending);
  const showMessage = useStore($showMessage);

  useEffect(() => {
    if (id) {
      void getCountryIdFx({ id })
    }
  }, [id]);

  return (
    <>
      <PageTitleComponent
        title={"Edit country"}
        subTitle={""}
        recentlyView={false}
      />
      {(showMessage !== '') &&
        <CountryToastWrapper>
          <InlineToast
            role='alert'
            kind='warning-alt'
            onCloseButtonClick={() => setToasterWarning('')}
            title={showMessage}
            lowContrast
            hideCloseButton
          />
        </CountryToastWrapper>
      }
      <CountryAddEditWrapper>
        {!isPending && <FormCountry
          countryItemId={id}
          isEdit={true}
        />}
      </CountryAddEditWrapper>
    </>

  )
}

export default EditCountry