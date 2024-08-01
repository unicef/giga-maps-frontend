import { Button, ButtonProps, ModalHeader } from "@carbon/react";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter } from "~/@/common/modal";


export const AlertModalWithButton = ({ buttonProps, modalProps, confirm }: { buttonProps: ButtonProps<{}>, modalProps: { note?: string; modalHeading: string; modalLabel: string; primaryButtonText: string; secondaryButtonText: string; }, confirm: () => void }) => {
  const [open, setOpen] = useState(false);
  const { title, ...buttonOtherProps } = buttonProps;
  const { note, modalLabel, modalHeading, primaryButtonText, secondaryButtonText } = modalProps;
  return <>
    <Button onClick={() => setOpen(true)} {...buttonOtherProps}>{title ?? ''}</Button>
    <Modal open={open}
      theme="white"
      onClose={() => {
        setOpen(false)
      }}
      onSubmit={confirm}
      size="sm"
    >
      <ModalHeader>{modalLabel}</ModalHeader>
      <ModalBody>
        <p>{modalHeading}</p>
        {note && <p style={{ color: '#fd2222', marginTop: '1rem' }}><b>Note: </b>{note}</p>}
      </ModalBody>
      <ModalFooter
        onRequestSubmit={() => {
          confirm()
          setOpen(false)
        }}
        onRequestClose={() => setOpen(false)}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}>{''}</ModalFooter>
    </Modal>
  </>;

};