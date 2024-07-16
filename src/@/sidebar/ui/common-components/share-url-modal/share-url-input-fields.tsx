import { TextInput } from '@carbon/react';

const ShareUrlInputFields = ({ showFields, textFields, handleTextChange, setTextFields }:
  { showFields: any, textFields: any, handleTextChange: any, setTextFields: any }) => {

  return (
    <>
      {
        textFields.map((text, index) => (
          <div key={index}
            className='side-panel-shareURL-input-fields'>
            <TextInput
              id={`Text Field ${index + 1}`}
              labelText={showFields === "message" ? `Enter Message ${index + 1}` : `Enter Email ${index + 1}`}
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          </div>
        ))
      }
    </>
  )
}

export default ShareUrlInputFields