import { FileUploader } from "@carbon/react"
import { UploadFlagImage } from "../../../styles/admin-styles"
import { FormEvent, useRef } from "react"
import { $formData, onUdpateGigaLayerForm } from "~/@/admin/models/giga-layer.model"
import { useStore } from "effector-react"

export const GigaUploadIcon = () => {
  const formData = useStore($formData);
  const onUploadIcon = (e: FormEvent<HTMLInputElement>) => {
    const files = e?.currentTarget?.files;
    if (!files) {
      return console.log('Please select an SVG file');
    }
    const file = files[0];
    if (!file) {
      return console.log('Please select an SVG file');
    }

    const sizeInBytes = file.size; // File size in bytes
    const sizeInKB = (sizeInBytes / 1024).toFixed(2); // Convert to KB
    if (Number(sizeInKB) > 500) {
      console.log('File size exceeds 500 KB');
      alert('File size should not exceed 500 KB');
      return;
    }
    // Process the uploaded file here (read as text or array buffer)
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const svgContent = e?.target?.result as string;
      onUdpateGigaLayerForm(['icon', svgContent])
    };

    reader.readAsText(file);
  }

  const onDeleteIcon = () => {
    onUdpateGigaLayerForm(['icon', '']);
  }

  return (
    <UploadFlagImage>
      <div dangerouslySetInnerHTML={{ __html: formData.icon }} />
      <FileUploader
        id="file-upload"
        labelTitle="Upload layer icon"
        labelDescription="Max file size is 500 KB. Only .svg file is supported."
        buttonLabel="Upload"
        buttonKind="primary"
        size="md"
        filenameStatus="edit"
        accept={['.svg']}
        multiple={false}
        iconDescription="Delete file"
        onChange={onUploadIcon}
        onDelete={onDeleteIcon}
        name=""
      />
    </UploadFlagImage>
  )
}