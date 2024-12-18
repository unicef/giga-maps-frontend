import { useStore } from 'effector-react';

import { $dowloadApiModalContainerStyle, $modalBodyStyle, $modalFooterStyle, $modalHeadingStyle, ModalDescription, SelectCountry, SucccessMessageContainer, TopLogoContainer } from "~/@/api-docs/ui/components/modals/modals.style";
import { Modal, ModalBody, ModalHeader } from "~/@/common/modal/modal.style";

import { $inValidateCacheResponse } from '../../models/admin-model';
import { ActionableNotification, Button, Form, ModalFooter, RadioButton, RadioButtonGroup } from '@carbon/react';
import useForm from '~/lib/hooks/useForm';
import { CountryListType } from '~/@/api-docs/types/country-list.type';
import { Div, Text } from '~/@/common/style/styled-component-style';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { $dataLayerListResponce } from '../../models/giga-layer.model';
import { useEffect, useState } from 'react';
import { getDataLayerListFx } from '../../effects/giga-layer-fx';
import { DataLayer } from '../../types/giga-layer.type';
import { getInvalidateCacheFx } from '../../effects/admin-main-fx';
import { onCreateNotification } from '~/@/common/Toast/toast.model';

interface FormValues {
  [key: string]: string; // Generic type for form field values
}

enum FormTypeFields {
  all = 'all',
  country = 'country',
  layer = 'layer'
}
const defaultFields = {
  country: '',
  layer: '',
}

const validationRules = {
  all: {},
  country: {
    id: [{
      required: true,
      message: "Country is required"
    }],
  },
  layer: {
    id: [{
      required: true,
      message: "Layer is required"
    }],
  }
}


function InvalidatCacheModal({ open, setOpen }: { readonly open: boolean; readonly setOpen: any }) {
  const [type, setType] = useState<FormTypeFields>(FormTypeFields.country);
  const { values, errors, isError, touched, reset, handleChange, handleSubmit, handleBlur } = useForm(defaultFields, validationRules[type]);
  const inValidateCacheResponse = useStore($inValidateCacheResponse);
  const countryList = useStore($countryList);
  const dataList = useStore($dataLayerListResponce);
  const isLayerType = type === 'layer'
  const isPending = useStore(getInvalidateCacheFx.pending);

  useEffect(() => {
    if (isLayerType && !getDataLayerListFx.pending.getState()) {
      getDataLayerListFx({ page: 1, pageSize: 100 })
    }
  }, [isLayerType, getDataLayerListFx, dataList]);

  useEffect(() => {
    setType(FormTypeFields.country);
  }, [open]);

  useEffect(() => {
    reset();
  }, [open, type]);

  useEffect(() => {
    if (inValidateCacheResponse?.message) {
      onCreateNotification({
        subtitle: inValidateCacheResponse?.message,
        title: 'Cache cleared.',
        kind: 'success',
      })
      setOpen(false);
    }
  }, [inValidateCacheResponse])

  const onFormSubmit = async (data: FormValues) => {
    getInvalidateCacheFx({
      key: type,
      ...(data.id ? { id: data.id } : {}),
    })
  }
  return (
    <Modal
      open={open}
      preventCloseOnClickOutside
      $containerStyle={$dowloadApiModalContainerStyle}
    >
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <ModalHeader closeModal={() => {
          setOpen(false);
        }} $headingStyle={$modalHeadingStyle} title="Clear Cache" />
        <ModalBody $style={$modalBodyStyle} style={{ paddingBottom: '1.2rem' }}>
          <ModalDescription style={{ marginBottom: '1rem' }}> Please select the type of cache you want to clear </ModalDescription>

          <RadioButtonGroup
            name="type"
            valueSelected={type}
            onChange={(selection) => setType(selection as FormTypeFields)}
            defaultSelected="all">
            <RadioButton id="radio-button-1" value={FormTypeFields.all} labelText="All" />
            <RadioButton id="radio-button-2" value={FormTypeFields.country} labelText="Country" />
            <RadioButton id="radio-button-3" value={FormTypeFields.layer} labelText="Layer" />
          </RadioButtonGroup>
          {type === FormTypeFields.all && <Div $margin='1.3rem 0'>
            <ActionableNotification
              kind="warning-alt"
              hideCloseButton
              inline
              title="Are you sure you want to clear all the cache?"
              subtitle="It will impact the performance of the application for all the users for 5-10 minutes."
            />
          </Div>}
          {type === FormTypeFields.country && <>
            <SelectCountry
              id={'country'}
              titleText={'Select Country *'}
              placeholder={'Select Country'}
              items={countryList}
              itemToString={(item: CountryListType | null) => item?.name ?? ''}
              itemToElement={(item: CountryListType) => item.name}
              onChange={(data: { selectedItem: CountryListType | null }) => {
                if (data.selectedItem) {
                  handleChange({
                    target: {
                      name: 'id',
                      value: data.selectedItem.id
                    }
                  })
                }
              }}
            />
            <Div $margin='1rem 0'>
              <Text $color="#9E9E9E"> It will clear all cache related to this country.</Text>
            </Div>
          </>}
          {type === FormTypeFields.layer && <>
            <SelectCountry
              id={'layer'}
              titleText={'Select Layer *'}
              placeholder={'Select Layer'}
              items={dataList}
              itemToString={(item: DataLayer | null) => item?.name ?? ''}
              itemToElement={(item: DataLayer) => `${item.name} (${item.code})`}
              onChange={(data: { selectedItem: DataLayer | null }) => {
                if (data.selectedItem) {
                  handleChange({
                    target: {
                      name: 'id',
                      value: data.selectedItem.id
                    }
                  })
                }
              }}
            />
            <Div $margin='1rem 0'>
              <Text $color="#9E9E9E"> It will clear all cache related to this layer.</Text>
            </Div>
          </>}
        </ModalBody>
        <ModalFooter $style={$modalFooterStyle}>
          <Button
            kind="secondary"
            onClick={() => {
              setOpen(false);
            }}>
            Cancel
          </Button>
          <Button
            disabled={isPending || isError}

            kind="primary"
            type="submit">
            Clear
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default InvalidatCacheModal