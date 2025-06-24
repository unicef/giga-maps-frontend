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
          <ModalDescription>
            An API key is required to view the documentation for the {exploreApiData?.name} {showDownload ? 'data' : 'API'}. Your existing API keys can be found in your  <a href="/docs/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#0f62fe' }}> Giga Maps Dashboard</a>.<div style={{ height: '1rem' }}></div> If you have not yet been provided an API key, please  <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (isPublic) {
                  onRequestApiKey(exploreApiData?.id)
                } else {
                  onRequestAPIPopup(true);
                  onDownloadAPIPopup(false);
                  onDocumentAPIPopup(false);
                }
              }}
              style={{ color: '#0f62fe', cursor: 'pointer' }}
            >
              request one
            </a>.<br />



          </ModalDescription>
          <TextInputWrapper>
            <div className='explore-text-input'>
              <TextInput value={apiInput} required onChange={(e) => setApiInput(e.target.value)} id="text-input-explore-api" type="text" labelText="" placeholder='Enter the api_key value' invalid={invalidKey} invalidText={'Please enter valid api key'} />
            </div>
          </TextInputWrapper><br />
          <ModalDescription> If you would like more information about Giga Maps APIs, please contact us at   <a href="mailto:gigamaps@unicef.org" style={{ color: '#0f62fe' }}> gigamaps@unicef.org</a>.
          </ModalDescription>

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