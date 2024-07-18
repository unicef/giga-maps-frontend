import { Button, FileUploader, Form, TextInput } from "@carbon/react"
import { useStore } from "effector-react"
import { ChangeEvent, FormEvent, useState } from "react"

import { getImagesListFx, uploadImagesFx } from "~/@/admin/effects/about-us-fx"
import { $showMessage, setToasterWarning } from "~/@/admin/models/country-model"
import { $modalBodyStyle } from "~/@/api-docs/ui/components/modals/modals.style"
import { ModalBody, ModalFooter } from "~/@/common/modal/modal.style"
import { InlineToast } from "~/@/common/style/styled-component-style"

import { AboutUsUploadImgesWrapper, InputLabel } from "../../styles/admin-styles"
import { Scroll } from "~/@/scroll"

const ModalUploadImageContent = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [names, setNames] = useState<string[]>([]); // Store names of files
  const showMessage = useStore($showMessage);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files);
    // File size validation
    const invalidFiles = files.filter((file) => file.size > 1024 * 1024 * 10);
    if (invalidFiles.length > 0) {
      setToasterWarning('Some files exceed the limit of 10MB.');
      event.target.value = null;
      return;
    }
    const filesList = [...files]
    setSelectedFiles([...selectedFiles, ...filesList]);
    setNames([...names, ...filesList.map((file) => file.name.split('.')[0])]); // Initialize names
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleDeleteImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newNames = [...names];
    newNames.splice(index, 1);
    setNames(newNames);
  };
  const uploadNextFile = async (currentIndex: number) => {
    if (currentIndex >= selectedFiles.length) {
      setOpen(false);
      setSelectedFiles([]);
      setNames([]);
      await getImagesListFx(); // Refresh image list after upload
      return;
    }

    const file = selectedFiles[currentIndex];
    const name = names[currentIndex];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);

    try {
      await uploadImagesFx({ formData });
      const nextIndex = currentIndex + 1;
      uploadNextFile(nextIndex); // Recursive call 
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setToasterWarning("Please upload images");
      return;
    }

    uploadNextFile(0);
  };

  return (
    <Form id="formElemImportCsv"
      data-testid='form-image-uplaod'
      onSubmit={handleFormSubmit}
      autoComplete="off"
    >
      <Scroll style={{ maxHeight: 'calc(100vh - 260px)' }}>
        <ModalBody $style={$modalBodyStyle}>
          { showMessage !== '' &&
            <InlineToast
              role='alert'
              kind='warning-alt'
              onCloseButtonClick={() => setToasterWarning('')}
              title={showMessage}
              lowContrast
              hideCloseButton
            />}
          <AboutUsUploadImgesWrapper>
            {selectedFiles?.map((file, index) => (
              <div key={`${file.type}-${index}`} className="custom-file-container">
                <InputLabel>Name</InputLabel>
                <TextInput
                  required
                  data-testid={`image-upload-name-${index}`}
                  type="text"
                  labelText=""
                  id={`name-${index}`}
                  value={names[index]}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Enter Name"
                  name={`name-${index}`}
                />
                <span className="file-name">{file.name}</span>
              </div>
            ))}
            <FileUploader
              className="file-uploader"
              labelTitle=""
              labelDescription="Only .png, .jpg and .gif file is supported."
              buttonLabel="Upload"
              data-testid='image-uploader'
              buttonKind="primary"
              size="md"
              filenameStatus="edit"
              accept={['.png', '.jpg', '.gif']}
              multiple
              iconDescription="Delete file"
              onChange={handleFileChange}
              onDelete={handleDeleteImage}
              name=""
            />
          </AboutUsUploadImgesWrapper>
        </ModalBody>
      </Scroll>
      <ModalFooter>
        <Button
          kind="secondary"
          onClick={() => {
            setOpen(false)
          }}>
          Cancel
        </Button>
        <Button
          type='submit'
          kind="primary"
          data-testid='submit-about-us-image'
        >
          Submit
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default ModalUploadImageContent