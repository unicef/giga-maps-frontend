import { Button, Form, Link, TextInput } from '@carbon/react';
import { createEvent, restore } from 'effector';
import { useStore } from 'effector-react';
import { FormEvent, useEffect, useState } from 'react';

import { validateApiKeyFx } from '~/@/api-docs/effects/api-keys-fx';
import { onRequestApiKey } from '~/@/api-docs/models/api-keys.model';
import { $currentSelectedApiData, setCurrentApiKey } from '~/@/api-docs/models/explore-api.model';
import { $documentApiPopup, $downloadApiPopup, onDocumentAPIPopup, onDownloadAPIPopup, onDownloadDataPopup, onRequestAPIPopup } from '~/@/api-docs/models/popup.model';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/@/common/modal';
import { apiInfo } from '~/core/routes';
import { $dowloadApiModalContainerStyle, $modalBodyStyle, $modalFooterStyle, $modalHeadingStyle, DontHaveAccountContainer, ModalDescription, TextInputWrapper } from './modals.style';
import { Div, Text } from '~/@/common/style/styled-component-style';


const setInvalidKey = createEvent<boolean>();
const $invalidKey = restore(setInvalidKey, false);
$invalidKey.reset($downloadApiPopup, $documentApiPopup);

const DownloadApiKeyModal = () => {
  const showDownload = useStore($downloadApiPopup);
  const showDocument = useStore($documentApiPopup);
  const exploreApiData = useStore($currentSelectedApiData);
  const isPublic = exploreApiData?.category === 'public';
  const [apiInput, setApiInput] = useState('');
  const invalidKey = useStore($invalidKey);

  useEffect(() => {
    setApiInput('');
  }, [showDownload, showDocument]);

  const validateApiKey = async () => {
    try {
      await validateApiKeyFx({ api_id: exploreApiData?.id, api_key: apiInput });
      return true;
    } catch (e) {
      return false;
    }
  }

  const onSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    setCurrentApiKey(apiInput);
    if (!apiInput || !(await validateApiKey())) {
      return setInvalidKey(true);
    };
    if (!showDocument) {
      onDownloadDataPopup(true);
    } else {
      apiInfo.navigate({ apiKey: exploreApiData?.id })
    }
    setCurrentApiKey(apiInput);
    onDownloadAPIPopup(false);
    onDocumentAPIPopup(false);
  }

  return (
    <Modal
      open={showDownload || showDocument}
      preventCloseOnClickOutside
      $containerStyle={$dowloadApiModalContainerStyle}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader closeModal={() => {
          onDownloadAPIPopup(false);
          onDocumentAPIPopup(false);
        }} $headingStyle={$modalHeadingStyle} title="Enter API Key" />
        <ModalBody $style={$modalBodyStyle}>
          <ModalDescription>Enter API key to {showDownload ? 'download' : 'view documentation for'} {exploreApiData?.name} {showDownload ? 'data' : 'API'}</ModalDescription>
          <TextInputWrapper>
            <div className='explore-api-text'>api_key</div>
            <div className='explore-text-input'>
              <TextInput value={apiInput} required onChange={(e) => setApiInput(e.target.value)} id="text-input-explore-api" type="text" labelText="" placeholder='Enter the api_key value' invalid={invalidKey} invalidText={'Please enter valid api key'} />
            </div>
          </TextInputWrapper>
          <DontHaveAccountContainer>
            <p>Don’t have one? </p>
            <Button
              onClick={() => {
                if (isPublic && exploreApiData?.code !== "DAILY_CHECK_APP") {
                  onRequestApiKey(exploreApiData?.id)
                } else {
                  onRequestAPIPopup(true);
                  onDownloadAPIPopup(false)
                  onDocumentAPIPopup(false);
                }
              }}
              kind="ghost">
              Request API Key
            </Button>
          </DontHaveAccountContainer>
          {exploreApiData?.code === "DAILY_CHECK_APP" && <Div>
            <Text $size={0.7}>License: The dataset accessed through this API is made available under the <Link rel="noreferrer" style={{ fontSize: '0.7rem', display: 'inline' }} target="_blank" href="https://opendatacommons.org/licenses/odbl/1-0/">Open Data Commons Open Database License (ODbL)</Link>. You are free to copy, distribute, transmit and adapt our data, as long as you credit Giga and its contributors. If you alter or build upon our data, you may distribute the result only under the same licence. The full legal code explains your rights and responsibilities.
            </Text>
          </Div>}
          {exploreApiData?.code === "SCHOOL" && <Div>
            <Text $size={0.7}>License: The dataset accessed through this API is made available under the <Link rel="noreferrer" style={{ fontSize: '0.7rem', display: 'inline' }} target="_blank" href="https://opendatacommons.org/licenses/odbl/1-0/">Open Data Commons Open Database License (ODbL)</Link>. You are free to copy, distribute, transmit and adapt our data, as long as you credit Giga and its contributors. Portions of this dataset include data from OpenStreetMap, available under the ODbL. If you alter or build upon our data, you may distribute the result only under the same licence. The full legal code explains your rights and responsibilities.
            </Text>
          </Div>}

        </ModalBody>
        <ModalFooter $style={$modalFooterStyle}>
          <Button
            kind="secondary"
            onClick={() => {
              onDownloadAPIPopup(false)
              onDocumentAPIPopup(false);
            }}>
            Cancel
          </Button>
          <Button
            kind="primary"
            type="submit">
            Submit
          </Button>
        </ModalFooter>
      </Form>
    </Modal >
  )
}

export default DownloadApiKeyModal;
