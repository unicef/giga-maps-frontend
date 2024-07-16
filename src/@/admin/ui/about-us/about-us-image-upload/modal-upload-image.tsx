import { $dowloadApiModalContainerStyle } from "~/@/api-docs/ui/components/modals/modals.style"
import { Modal, ModalHeader } from "~/@/common/modal/modal.style"

import { $countrymodalHeadingStyle, } from "../../styles/admin-styles"
import ModalUploadImageContent from "./modal-upload-image-content"

const ModalUploadImage = ({ open, setOpen, }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <>
      <Modal open={open} $containerStyle={$dowloadApiModalContainerStyle}
        preventCloseOnClickOutside id={'import-csv-filter-modal'}
      >
        <ModalHeader title="Image Upload"
          $headingStyle={$countrymodalHeadingStyle}
          closeModal={() => {
            setOpen(false)
          }}
        />
        {open && <ModalUploadImageContent setOpen={setOpen} />}
      </Modal>
    </>
  )
}

export default ModalUploadImage