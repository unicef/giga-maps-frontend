import { CheckmarkFilled, IbmCloudKeyProtect } from '@carbon/icons-react';
import { Button } from '@carbon/react';
import { useStore } from 'effector-react';

import { $successMessagePopup, onSuccessMessagePopup } from '~/@/api-docs/models';
import { $currentSelectedApiData } from '~/@/api-docs/models/explore-api.model';
import { getCardAllProps } from '~/@/api-docs/utils';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/@/common/modal';
import { docsApiKeys } from '~/core/routes';

import { $dowloadApiModalContainerStyle, $modalBodyStyle, $modalFooterStyle, SucccessMessageContainer, TopLogoContainer } from './modals.style';

const ApiCreatedSuccessModal = () => {
  const showPopup = useStore($successMessagePopup);
  const currentApi = useStore($currentSelectedApiData);
  const { isPublic } = getCardAllProps(currentApi);

  return (
    <Modal
      open={showPopup}
      preventCloseOnClickOutside
      $containerStyle={$dowloadApiModalContainerStyle}
    >
      <ModalHeader closeModal={() => {
        onSuccessMessagePopup(false);
      }} title="" />
      <ModalBody $style={$modalBodyStyle}>
        <TopLogoContainer>
          <span>
            <IbmCloudKeyProtect className="cloud-protect-icon" size={64} />
            <CheckmarkFilled className="check-mark-icon" size={20} />
          </span>
        </TopLogoContainer>
        <SucccessMessageContainer>
          <>
            {isPublic ?
              <h3>API key created successfully</h3>
              : <h3>API key requested.</h3>
            }
            {isPublic ?
              <p>API key has been generated. Please check API keys tab.</p>
              : <p>API key request has been sent for approval.</p>
            }
          </>
        </SucccessMessageContainer>
      </ModalBody>
      <ModalFooter $style={$modalFooterStyle}>
        <Button
          kind="primary"
          onClick={() => {
            onSuccessMessagePopup(false);
            docsApiKeys.navigate();
          }}>
          Go to API keys home
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ApiCreatedSuccessModal;
