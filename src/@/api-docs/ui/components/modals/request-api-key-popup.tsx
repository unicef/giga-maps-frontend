import { Button, Form, Link, TextArea } from '@carbon/react';
import { useStore } from 'effector-react';
import { FormEvent, useEffect } from 'react';

import { $currentSelectedApiData } from '~/@/api-docs/models/explore-api.model';
import { $requestAPIPopup, onRequestAPIPopup } from '~/@/api-docs/models/popup.model';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/@/common/modal';

import { $dowloadApiModalContainerStyle, $modalBodyStyle, $modalFooterStyle, $modalHeadingStyle, ModalDescription, TextInputWrapper } from './modals.style';
import CountryMultiDropdown from './download-data-modal/country-multi-select';
import { requestForApiKeyFx } from '~/@/api-docs/effects/api-keys-fx';
import useForm from '~/lib/hooks/useForm';


interface FormValues {
  [key: string]: string; // Generic type for form field values
}
const defaultFields = {
  countries: '',
  description: '',
}

const validationRules = {
  countries: [{
    required: true,
    message: "Country is required"
  }],
  description: [{
    required: true,
    message: "Description is required"
  }, {
    validate: (value: string) => value.length >= 5,
    message: "Description must be at least 5 characters"
  }],
}

const ReuestApiKeyPopup = () => {
  const { values, errors, isError, touched, reset, handleChange, handleSubmit, handleBlur } = useForm(defaultFields, validationRules);
  const requestApiPopup = useStore($requestAPIPopup);
  const exploreApiData = useStore($currentSelectedApiData);
  useEffect(reset, [requestApiPopup]);

  const onSubmit = async (data: FormValues) => {
    try {
      await requestForApiKeyFx({
        api: exploreApiData?.id,
        description: data.description,
        active_countries_list: data.countries,
      });
      onRequestAPIPopup(false);
      reset();
    } catch (e) { }
  }

  const onFormSubmit = (event: FormEvent) => {
    handleSubmit(onSubmit)(event)
  }

  return (
    <Modal
      open={requestApiPopup}
      preventCloseOnClickOutside
      $containerStyle={$dowloadApiModalContainerStyle}
    >
      <Form onSubmit={onFormSubmit}>
        <ModalHeader closeModal={() => {
          onRequestAPIPopup(false);
        }} $headingStyle={$modalHeadingStyle} title="Request API Key" />
        <ModalBody $style={$modalBodyStyle}>
          <ModalDescription> Please select the countries for which you need data access. Please explain how you plan to utilise the data for each country.  </ModalDescription>
          {exploreApiData?.code === "DAILY_CHECK_APP" && <Link size="sm" href='https://opendatacommons.org/licenses/odbl/'>Daily Check App data is made available under the Open Database License(ODBL)</Link>}
          {requestApiPopup && <CountryMultiDropdown
            onMenuChange={(open: boolean) => {
              if (!open) {
                handleBlur({ target: { name: 'countries' } });
              }
            }}
            invalid={!!errors['countries'] && touched['countries']}
            invalidText={errors['countries']}
            onSelectCountry={(countries) => {
              const ids = countries.map(country => country.id);
              handleChange({
                target: {
                  name: 'countries',
                  value: ids.length ? ids : '',
                }
              })
            }}
          />}
          <TextInputWrapper>
            <TextArea
              rows={3}
              id="message"
              maxCount={500}
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values['description']}
              invalid={!!errors['description'] && touched['description']}
              invalidText={errors['description']}
              labelText="Description"
              placeholder="Please provide a brief description of how you plan to utilize the data." />
          </TextInputWrapper>
        </ModalBody>
        <ModalFooter $style={$modalFooterStyle}>
          <Button
            kind="secondary"
            onClick={() => {
              onRequestAPIPopup(false);
            }}>
            Cancel
          </Button>
          <Button
            kind="primary"
            disabled={isError}
            type="submit">
            Submit
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default ReuestApiKeyPopup;
