import { useStore } from 'effector-react';
import React from 'react';
import type { EntityType } from '~/@/entities';

import CoverageLayerSelectionFilterModal from './coverage-layer-selection-filter-modal';
import LayerSelectionFilterModal from './layer-selection-filter-modal';

const LayerSelectionFilter = ({
  entityType,
  open,
  setOpen,
}: {
  entityType: EntityType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <LayerSelectionFilterModal
        entityType={entityType}
        open={open}
        setOpen={setOpen}
      />
      {/* {isStatic && <CoverageLayerSelectionFilterModal open={open} setOpen={setOpen} />} */}
    </>
  );
};

export { LayerSelectionFilter };
