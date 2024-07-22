import { useStore } from 'effector-react'
import React from 'react'

import { $showMessage, setToasterWarning } from '~/@/admin/models/country-model'
import { InlineToast } from '~/@/common/style/styled-component-style'
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
const AddCountry = () => {
  const showMessage = useStore($showMessage);
  return (<>
    <PageTitleComponent
      title={"Add country"}
      subTitle={""}
      recentlyView={false}
    />
    {showMessage &&
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
      <FormCountry
        isEdit={false} />
    </CountryAddEditWrapper>
  </>)
}

export default AddCountry