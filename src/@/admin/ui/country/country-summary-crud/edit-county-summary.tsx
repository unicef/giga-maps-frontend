import { useStore } from 'effector-react';
import React, { useEffect } from 'react'

import { getCountrySummaryIdFx } from '~/@/admin/effects/api-country-fx';
import { editCountrySummary } from '~/core/routes';

import FormCountrySummary from './form-country-summary'

const EditCountySummary = () => {

  const { id } = useStore(editCountrySummary.params) as { id: number };

  useEffect(() => {
    if (id) {
      void getCountrySummaryIdFx({ id })
    }
  }, [id]);

  return (
    <FormCountrySummary
      countrySummaryItemId={id}
      isEditMode={true} />
  )
}

export default EditCountySummary