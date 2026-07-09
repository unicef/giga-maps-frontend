import { useStore } from 'effector-react';
import React from 'react'



import CoverageLayerSelectionFilterModal from './coverage-layer-selection-filter-modal';
import LayerSelectionFilterModal from './layer-selection-filter-modal';


const LayerSelectionFilter = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {


  return (
    <>
      <LayerSelectionFilterModal open={open} setOpen={setOpen} />
      {/* {isStatic && <CoverageLayerSelectionFilterModal open={open} setOpen={setOpen} />} */}
    </>
  )
}

export { LayerSelectionFilter };
