import { Form, NumberInput } from '@carbon/react';
import { useStore } from 'effector-react';
import { FormEvent, useEffect } from 'react';

import { downloadCountryDataFx, downloadSchoolDataFx } from '~/@/api-docs/effects/explore-api-fx';
import { $countryList, $currentSelectedApiData, getCountryList } from '~/@/api-docs/models/explore-api.model';
import { $downloadDataPopup, onDownloadDataPopup } from '~/@/api-docs/models/popup.model';
import { getCardAllProps } from '~/@/api-docs/utils';
import { Modal, ModalBody, ModalHeader } from '~/@/common/modal';

import { ModalFooterButtons } from '../common/ModalFooterButtons.view';
import { $dowloadApiModalContainerStyle, $modalBodyStyle, $modalHeadingStyle, ModalDescription, NumberPickerContainer } from '../modals.style';
import { $downloadFormData, $filterSchoolList, setPageNo, setPageSize } from './download-data.model';
import DownloadCountryDropDown from './download-data-country-dropdown.view';
import DownloadSchoolDropDown from './download-data-school-dropdown.view';

const DownloadDataModal = () => {
  const showPopup = useStore($downloadDataPopup);
  const exploreApiData = useStore($currentSelectedApiData);
  const { isCountry, isSchool } = getCardAllProps(exploreApiData);
  const { country_has_schools: countryHasSchool } = exploreApiData?.default_filters ?? { country_has_schools: false };
  const countryList = useStore($countryList)
  const schoolList = useStore($filterSchoolList);
  const formData = useStore($downloadFormData);
  const isLoading = useStore(downloadSchoolDataFx.pending);
  useEffect(() => {
    if (showPopup) {
      getCountryList(!!countryHasSchool);
    }
  }, [showPopup]);

  const onSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const props = {
      ...formData,
    };
    try {
      if (isSchool) {
        await downloadSchoolDataFx(props)
      } else if (isCountry) {
        await downloadCountryDataFx(props)
      }
      onDownloadDataPopup(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Modal
      open={showPopup}
      onClose={() => onDownloadDataPopup(false)}
      preventCloseOnClickOutside
      $containerStyle={$dowloadApiModalContainerStyle}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader closeModal={() => {
          onDownloadDataPopup(false);
        }} $headingStyle={$modalHeadingStyle} title={`Download - ${exploreApiData?.name} data`} />
        {showPopup && <ModalBody $style={$modalBodyStyle}>
          <ModalDescription>{exploreApiData?.description}</ModalDescription>
          {isCountry &&
            <DownloadCountryDropDown
              countryList={countryList}
            />
          }
          {isSchool &&
            <DownloadSchoolDropDown
              schoolList={schoolList}
            />
          }
          <NumberPickerContainer>
            <div>
              <NumberInput required name="pageNo" id="carbon-number" min={1} max={100000} value={formData.pageNo} label="Page no" invalidText="Number is not valid" onChange={(_event, { value }) => setPageNo(value as number)} />
            </div>
            <div>
              <NumberInput required name="pageSize" id="carbon-number" min={10} max={100000} value={formData.pageSize} label="Page size" invalidText="Number is not valid" onChange={(_event, { value }) => setPageSize(value as number)} />
            </div>
          </NumberPickerContainer>

        </ModalBody>}
        <ModalFooterButtons
          isLoading={isLoading}
          onCancel={() => onDownloadDataPopup(false)}
        />
      </Form>
    </Modal>
  )
}

export default DownloadDataModal;
