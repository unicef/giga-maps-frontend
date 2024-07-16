import { Button, DatePicker, DatePickerInput, Form } from '@carbon/react';
import { format } from 'date-fns';
import { sample } from 'effector';
import { useStore } from 'effector-react';
import { FormEvent, useState } from 'react';

import { requestForExtensionFx } from '~/@/api-docs/effects/api-keys-fx';
import { $requestExtensionPopup, onRequestExtensionPopup } from '~/@/api-docs/models';
import { $apiKeysData } from '~/@/api-docs/models/api-keys.model';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/@/common/modal';

import { $dowloadApiModalContainerStyle, $modalBodyStyle, $modalFooterStyle, $modalHeadingStyle, ExtensionDateWrapper, ModalDescription } from './modals.style';

const $selectedApi = sample({
  clock: $requestExtensionPopup,
  source: $apiKeysData,
  fn: (apiKeyData, apiId) => {
    return apiKeyData?.find(item => item.id === apiId) || null;
  }
})

const RequestExtensionModal = () => {
  const requestExtensionPopup = useStore($requestExtensionPopup);
  const selectedApi = useStore($selectedApi);
  const [extensionDate, setExtensionDate] = useState('');
  const onSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    void requestForExtensionFx({
      id: selectedApi?.id,
      body: {
        extension_valid_to: extensionDate
      }
    })
    onRequestExtensionPopup(null)
    setExtensionDate('')
  }
  return (
    <>
      <Modal
        open={requestExtensionPopup}
        onClose={() => {
          onRequestExtensionPopup(null);
        }}
        preventCloseOnClickOutside
        $containerStyle={$dowloadApiModalContainerStyle}
      >
        <Form onSubmit={onSubmit}>
          <ModalHeader $headingStyle={$modalHeadingStyle} title="Extension Request" closeModal={() => {
            onRequestExtensionPopup(null);
          }} />
          <ModalBody $style={$modalBodyStyle}>
            <ModalDescription>Please submit your API key extension request by selecting your desired date, and await email confirmation upon approval.</ModalDescription>
            <ExtensionDateWrapper>
              <DatePicker value={extensionDate} onChange={(date) => setExtensionDate(format(date[0], 'dd-MM-yyyy'))} minDate={selectedApi?.valid_to || ''} dateFormat="d/m/Y" datePickerType="single">
                <DatePickerInput required autoComplete="off" id="date-picker-extension-date" labelText="Extension Date" placeholder="dd/mm/yyyy" />
              </DatePicker>
            </ExtensionDateWrapper>
          </ModalBody>
          <ModalFooter $style={$modalFooterStyle} >
            <Button
              kind="secondary"
              onClick={() => {
                onRequestExtensionPopup(null);
                setExtensionDate('')
              }}>
              Cancel
            </Button>
            <Button
              type="submit"
              kind="primary"
            >
              Request For Extension
            </Button>
          </ModalFooter>
        </Form>
      </Modal >
    </>
  )
}

export default RequestExtensionModal