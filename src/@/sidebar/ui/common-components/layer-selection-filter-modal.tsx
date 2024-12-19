import { useRef } from "react";

import { Modal, ModalFooter, ModalHeader } from "~/@/common/modal";

import { Scroll } from '@/scroll';

import LayerSelectionFilterModalBody from "./layer-selection-filter-modal-body";
import { $layerFilterFooterStyle, $layerFilterHeadingStyle, $layerFilterModalStyle } from "./styles/layer-filter-modal.style";
import { useTranslation } from "react-i18next";

const LayerSelectionFilterModal = ({
  open, setOpen
}: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const layerFilterButtonRef = useRef(null);
  const filterModalRef = useRef<{ apply: () => void } | null>(null);
  const { t } = useTranslation();

  return (
    <Modal open={open} $containerStyle={$layerFilterModalStyle} preventCloseOnClickOutside id='layer-selection-filter-modal' launcherButtonRef={layerFilterButtonRef}
    >
      <ModalHeader title={t("data-layer-selection")} $headingStyle={$layerFilterHeadingStyle}
        closeModal={() => setOpen(false)}
      />
      <Scroll className="layer-selection-filter-body-scroll" >
        {open && <LayerSelectionFilterModalBody ref={filterModalRef} />}
      </Scroll>
      <ModalFooter
        $style={$layerFilterFooterStyle}
        onRequestSubmit={() => {
          filterModalRef.current?.apply();
          setOpen(false);
        }}
        onRequestClose={() => {
          setOpen(false)
        }}
        primaryButtonText={t("apply")}
        secondaryButtonText={t("reset")}>
        {''}
      </ModalFooter>
    </Modal>
  )
}

export default LayerSelectionFilterModal;
