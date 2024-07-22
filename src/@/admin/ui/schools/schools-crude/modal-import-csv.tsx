
import { Button, Checkbox, Form } from "@carbon/react";
import { useStore } from "effector-react";
import { FormEvent, useRef, useState } from "react";

import { importCsvFx } from "~/@/admin/effects/api-school-fx";
import { $showMessage, setToasterWarning } from "~/@/admin/models/country-model";
import { $dowloadApiModalContainerStyle, $modalBodyStyle } from "~/@/api-docs/ui/components/modals/modals.style";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "~/@/common/modal";
import { InlineToast } from "~/@/common/style/styled-component-style";
import { $layerFilterFooterStyle } from "~/@/sidebar/ui/common-components/styles/layer-filter-modal.style";

import { $countrymodalHeadingStyle, CheckboxCleanData, InputLabel } from "../../styles/admin-styles";


const ModalImportCsv = ({ open, setOpen, }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null);
  const [check, setCheck] = useState(false)
  const showMessage = useStore($showMessage);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedType = 'text/csv';
      if (file.type !== allowedType) {
        setToasterWarning('Please select a valid CSV file.');
        event.target.value = null;
        return;
      }
      const maxSize = 500 * 1024;
      if (file.size > maxSize) {
        setToasterWarning('File size exceeds the limit of 500 KB.');
        event.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setToasterWarning("Please select csv")
    }
    else {
      const formData = new FormData();
      formData.append('force', check);
      if (selectedFile) {
        formData.append('uploaded_file', selectedFile);
      }
      try {
        await importCsvFx({
          formData
        })
      }
      catch (e) {
        console.error(e)
      }
      setCheck(false)
      resetFileInput()
      setOpen(false)
    }
  }

  return (
    <Modal open={open} $containerStyle={$dowloadApiModalContainerStyle}
      preventCloseOnClickOutside id={'import-csv-filter-modal'}
    >
      <ModalHeader title="CSV import"
        $headingStyle={$countrymodalHeadingStyle}
        closeModal={() => {
          setOpen(false)
        }}
      />
      <Form id="formElemImportCsv"
        onSubmit={handleFormSubmit} autoComplete="off"
      >
        <ModalBody $style={$modalBodyStyle}>
          {(showMessage !== '') && <InlineToast
            role='alert'
            kind='warning-alt'
            onCloseButtonClick={() => setToasterWarning('')}
            title={showMessage}
            lowContrast
            hideCloseButton
          />}
          <InputLabel>
            CSV file
          </InputLabel>
          <input
            required
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ marginTop: '1rem', border: "none", paddingLeft: 0 }}
          />
          <CheckboxCleanData>
            <div className='amenities-checkbox'>
              <Checkbox
                name="force"
                checked={check}
                onChange={(_e, { checked }) => setCheck(checked)}
                labelText={'Skip rows with bad data'}
                id="checkbox-label-1"
              />
            </div>
          </CheckboxCleanData>
        </ModalBody>
        <ModalFooter $style={$layerFilterFooterStyle}>
          <Button
            kind="secondary"
            onClick={() => {
              resetFileInput()
              setCheck(false)
              setOpen(false)
            }}>
            Cancel
          </Button>
          <Button
            type='submit'
            kind="primary"
          >
            Submit
          </Button>
        </ModalFooter>
      </Form >
    </Modal>
  )
}

export default ModalImportCsv