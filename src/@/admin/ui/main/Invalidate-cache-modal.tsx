import { CheckmarkFilled, IbmCloudKeyProtect } from '@carbon/icons-react';
import { useStore } from 'effector-react';

import { $dowloadApiModalContainerStyle, $modalBodyStyle, SucccessMessageContainer, TopLogoContainer } from "~/@/api-docs/ui/components/modals/modals.style";
import { Modal, ModalBody, ModalHeader } from "~/@/common/modal/modal.style";

import { $inValidateCacheResponse } from '../../models/admin-model';


function InvalidatCacheModal({ open, setOpen }: { readonly open: boolean; readonly setOpen: any }) {

  const inValidateCacheResponse = useStore($inValidateCacheResponse)
  return (
    <Modal
      open={open}
      preventCloseOnClickOutside
      $containerStyle={$dowloadApiModalContainerStyle}
    >
      <ModalHeader closeModal={() => {
        setOpen(false);
      }} title="" />
      <ModalBody $style={$modalBodyStyle} style={{ height: "8rem" }}>
        <TopLogoContainer>
          <span>
            <IbmCloudKeyProtect className="cloud-protect-icon" size={64} />
            <CheckmarkFilled className="check-mark-icon" size={20} />
          </span>
        </TopLogoContainer>
        <SucccessMessageContainer>
          <p>{inValidateCacheResponse?.message}</p>
        </SucccessMessageContainer>
      </ModalBody>
    </Modal>
  )
}

export default InvalidatCacheModal