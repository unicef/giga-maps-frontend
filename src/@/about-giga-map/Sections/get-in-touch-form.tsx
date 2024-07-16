import { Button, Form, Select, SelectItem, TextArea, TextInput, Theme } from "@carbon/react"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "~/@/common/modal"
import { NextOutline } from "@carbon/icons-react"
import { useEffect } from "react"
import { getInTouchStyle } from "../styles/about-giga-map-styles"
import useForm from "~/lib/hooks/useForm"
import { Scroll } from '@/scroll';
import { onSubmitGetInTouchFx } from "../about.model"

interface FormValues {
  [key: string]: string; // Generic type for form field values
}
const defaultFields = {
  full_name: '',
  organisation: '',
  purpose: '',
  message: ''
}

const validationRules = {
  full_name: [{
    required: true,
    message: "Full name is required"
  }],
  organisation: [{
    required: true,
    message: "Organisation is required"
  }],
  purpose: [{
    required: true,
    message: "Purpose of inquiry is required"
  }],
  message: [{
    required: true,
    message: "Message is required"
  }]
}
export const GetInTouchForm = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { values, errors, isError, touched, reset, handleChange, handleSubmit, handleBlur } = useForm(defaultFields, validationRules);
  const handleFormSubmit = async (data: FormValues) => {
    // submit logic
    try {
      await onSubmitGetInTouchFx(data);
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }
  // reset form
  useEffect(reset, [open]);

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Modal open={open} preventCloseOnClickOutside onClose={() => setOpen(false)} $containerStyle={getInTouchStyle}>
        <ModalHeader closeModal={() => setOpen(false)}>
          <h4>Get in touch</h4>
        </ModalHeader>
        <Scroll>
          <ModalBody>
            <Theme theme="g90">
              <p className="form-title">Questions or clarifications? Get in touch with us</p>
              <TextInput id="name" value={values['full_name']} invalid={!!errors['full_name'] && touched['full_name']} invalidText={errors['full_name']} name="full_name" onChange={handleChange} onBlur={handleBlur} labelText="Full name" placeholder="John Doe" />
              <TextInput id="email" value={values['organisation']} invalid={!!errors['organisation'] && touched['organisation']} invalidText={errors['organisation']} name="organisation" onChange={handleChange} onBlur={handleBlur} labelText="Your organisation" placeholder="Business name" />
              <Select id="select" value={values['purpose']} invalid={!!errors['purpose'] && touched['purpose']} name="purpose" invalidText={errors['purpose']} onChange={handleChange} onBlur={handleBlur} labelText="Purpose of inquiry" placeholder="Choose an option">
                <SelectItem value="" text="Choose an option" />
                <SelectItem value="I want to join" text="I want to join" />
                <SelectItem value="I want to share data" text="I want to share data" />
                <SelectItem value="I want to volunteer" text="I want to volunteer" />
                <SelectItem value="I want to be a partner" text="I want to be a partner" />
                <SelectItem value="Other" text="Other" />
              </Select>
              <TextArea rows={5} id="message" maxCount={100} value={values['message']} invalid={!!errors['message'] && touched['message']} name="message" onChange={handleChange} onBlur={handleBlur} labelText="Your Message" placeholder="Type your message here..." />
            </Theme>
          </ModalBody>
        </Scroll>
        <ModalFooter className="cds--modal-footer">
          <Button size="sm" disabled={isError} title="Send" className="submit-btn" fullWidth type="submit" kind="primary" renderIcon={NextOutline}>Send</Button>
        </ModalFooter>
      </Modal >
    </Form>
  )
}