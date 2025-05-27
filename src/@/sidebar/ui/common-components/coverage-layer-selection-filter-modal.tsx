import { Button } from "@carbon/react";
import React, { useEffect, useRef } from 'react'

import { Modal, ModalFooter, ModalHeader } from "~/@/common/modal";

import {
  resetCoverageFilterSelection,
} from '~/@/sidebar/sidebar.model';

import CoverageLayerSelectionFilterModalBody from "./coverage-layer-selection-filter-modal-body";
import { $layerFilterFooterStyle, $layerFilterHeadingStyle, $layerFilterModalStyle } from "./styles/layer-filter-modal.style";
import { useTranslation } from "react-i18next";


const CoverageLayerSelectionFilterModal = ({
  open, setOpen
}: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { t } = useTranslation();
  const filterModalRef = useRef<{ handleApply: () => void } | null>(null);
  const CoverageFilterButtonRef = useRef(null);

  useEffect(() => {
    const layerSelectionModal = document.querySelector("#coverage-layer-selection-filter-modal");
    const closeButton = layerSelectionModal?.querySelectorAll('.cds--modal-close');
    closeButton?.[0]?.addEventListener("click", () => {
      setOpen(false);
    })
  }, [setOpen])


  return (
    <Modal open={open} $containerStyle={$layerFilterModalStyle} preventCloseOnClickOutside id='coverage-layer-selection-filter-modal' launcherButtonRef={CoverageFilterButtonRef}>
      <ModalHeader title="Filter" $headingStyle={$layerFilterHeadingStyle} />
      {open && <CoverageLayerSelectionFilterModalBody ref={filterModalRef} />}
      <ModalFooter $style={$layerFilterFooterStyle}>
        <Button
          kind="secondary"
          onClick={() => {
            resetCoverageFilterSelection();
            setOpen(false);
          }}>
          {t('reset')}
        </Button>
        <Button
          kind="primary"
          onClick={() => {
            filterModalRef.current?.handleApply();
            setOpen(false);
          }}>
          {t('apply')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CoverageLayerSelectionFilterModal;
