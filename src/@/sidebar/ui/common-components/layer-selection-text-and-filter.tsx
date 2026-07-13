import { useState } from 'react';
import type { EntityType } from '~/@/entities';
import LayerTopHead from '../global-and-country-view-components/common/layer-top-head.view';
import { LayerWrapper } from './common-components-styles/layer';
import { LayerSelectionFilter } from './layer-selection-filter';

const LayerSelectionTextAndFilter = ({
  entityType,
}: {
  entityType: EntityType;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <LayerWrapper>
      <LayerTopHead
        entityType={entityType}
        label={'heading'}
        onClickSetting={() => setOpen(true)}
      />
      <LayerSelectionFilter
        entityType={entityType}
        open={open}
        setOpen={setOpen}
      />
    </LayerWrapper>
  );
};

export { LayerSelectionTextAndFilter };
