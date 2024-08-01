import { useState } from 'react';
import LayerTopHead from '../global-and-country-view-components/common/layer-top-head.view';
import { LayerWrapper } from './common-components-styles/layer';
import { LayerSelectionFilter } from './layer-selection-filter';



const LayerSelectionTextAndFilter = () => {
  const [open, setOpen] = useState(false);
  return (
    <LayerWrapper>
      <LayerTopHead label={'heading'} onClickSetting={() => setOpen(true)} />
      <LayerSelectionFilter open={open} setOpen={setOpen} />
    </LayerWrapper>
  );
};

export { LayerSelectionTextAndFilter };
