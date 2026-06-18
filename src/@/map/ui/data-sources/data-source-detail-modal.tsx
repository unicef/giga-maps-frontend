import { Calendar } from '@carbon/icons-react';
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
  YearRow,
  YearValue,
} from './data-sources.styles';
import { DataSourceBadgeItem } from './data-sources.types';

const SectionTitle = styled.h4`
  ${$dataSourceModalSectionTitle}
`;

const SectionText = styled.p`
  ${$dataSourceModalSectionText}
`;

const Divider = styled.hr`
  ${$dataSourceModalDivider}
`;

const DataSourceDetailModal = ({
  open,
  source,
  onClose,
}: {
  open: boolean;
  source: DataSourceBadgeItem | null;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  if (!source) return null;

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
        title={source.name}
        $headingStyle={$dataSourceModalHeader}
        closeModal={onClose}
      />
      <ModalBody $style={$dataSourceModalBody}>
        {source.description && (
          <>
            <SectionTitle>{t('data-sources-details-label')}</SectionTitle>
            <SectionText>{source.description}</SectionText>
          </>
        )}

        {source.collectionYear != null && (
          <>
            <Divider />
            <YearRow>
              <Calendar size={16} />
              <div>
                <SectionTitle style={{ margin: 0 }}>{t('data-sources-collection-year-label')}</SectionTitle>
                <YearValue>{source.collectionYear}</YearValue>
              </div>
            </YearRow>
          </>
        )}

        <DataSourcesModalFooter />
      </ModalBody>
    </Modal>
  );
};

export default DataSourceDetailModal;
