import { useRef } from "react";

import { Modal, ModalFooter, ModalHeader } from "~/@/common/modal";
import {
  resetFilterModal,
} from '~/@/sidebar/sidebar.model';

import { Scroll } from '@/scroll';

import LayerSelectionFilterModalBody from "./layer-selection-filter-modal-body";
import { $layerFilterFooterStyle, $layerFilterHeadingStyle, $layerFilterModalStyle } from "./styles/layer-filter-modal.style";

const LayerSelectionFilterModal = ({
  open, setOpen
}: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const layerFilterButtonRef = useRef(null);
  const filterModalRef = useRef<{ apply: () => void } | null>(null);

  return (
    <Modal open={open} $containerStyle={$layerFilterModalStyle} preventCloseOnClickOutside id='layer-selection-filter-modal' launcherButtonRef={layerFilterButtonRef}
    >
      <ModalHeader title="Data layer selection" $headingStyle={$layerFilterHeadingStyle}
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
        primaryButtonText="Apply"
        secondaryButtonText="Reset">
        {''}
      </ModalFooter>
    </Modal>
  )
}

export default LayerSelectionFilterModal;
