import { useStore } from 'effector-react';
import React from 'react'

import { $currentLayerTypeUtils } from '~/@/sidebar/sidebar.model';

import CoverageLayerSelectionFilterModal from './coverage-layer-selection-filter-modal';
import LayerSelectionFilterModal from './layer-selection-filter-modal';


const LayerSelectionFilter = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // const { isLive, isStatic } = useStore($currentLayerTypeUtils);

  return (
    <>
      <LayerSelectionFilterModal open={open} setOpen={setOpen} />
      {/* {isStatic && <CoverageLayerSelectionFilterModal open={open} setOpen={setOpen} />} */}
    </>
  )
}

export { LayerSelectionFilter };
