import { ChartNetwork, Compass } from '@carbon/icons-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalHeader } from '~/@/common/modal';

import DataSourcesModalFooter from './data-sources-modal-footer';
import {
  $dataSourceModalBody,
  $dataSourceModalContainer,
  $dataSourceModalDivider,
  $dataSourceModalHeader,
  $dataSourceModalSectionText,
  $dataSourceModalSectionTitle,
  InfoSectionRow,
} from './data-sources.styles';

const SectionTitle = styled.h4`
  ${$dataSourceModalSectionTitle}
`;

const SectionText = styled.p`
  ${$dataSourceModalSectionText}
`;

const Divider = styled.hr`
  ${$dataSourceModalDivider}
`;

const DataSourcesInfoModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      className="data-source-detail-modal"
      $containerStyle={$dataSourceModalContainer}
      preventCloseOnClickOutside
    >
      <ModalHeader
        title={t('data-sources-info-modal-title')}
        $headingStyle={$dataSourceModalHeader}
        closeModal={onClose}
      />
      <ModalBody $style={$dataSourceModalBody}>
        <InfoSectionRow>
          <ChartNetwork size={16} />
          <div>
            <SectionTitle style={{ margin: 0 }}>{t('data-sources-how-collected-title')}</SectionTitle>
            <SectionText>{t('data-sources-how-collected-body')}</SectionText>
          </div>
        </InfoSectionRow>
        <Divider />
        <InfoSectionRow>
          <Compass size={16} />
          <div>
            <SectionTitle style={{ margin: 0 }}>{t('data-sources-how-accurate-title')}</SectionTitle>
            <SectionText>{t('data-sources-how-accurate-body')}</SectionText>
          </div>
        </InfoSectionRow>
        <DataSourcesModalFooter />
      </ModalBody>
    </Modal>
  );
};

export default DataSourcesInfoModal;
