import { RadioButton, RadioButtonGroup } from '@carbon/react';
import { useStore } from 'effector-react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import {
  $selectedEntityType,
  getEntityMapValue,
  isLayerForEntity,
} from '~/@/entities';
import {
  $activeLayerByCountryCodeByEntity,
  $connectivityLayers,
  $selectedLayerIdByEntity,
  onSelectEntityMainLayer,
} from '~/@/sidebar/sidebar.model';
import { LayerType, LayerTypeChoices } from '~/@/sidebar/types';
import { imperativeHandle } from '~/lib/utils/react.util';

import { PopoverFilterContentConnectivitytype } from '../styles/layer-filter-modal.style';

export default forwardRef(function LiveConnectivityType(
  { setCurrentLayer }: { setCurrentLayer: (id: null | number) => void },
  ref,
) {
  const { t } = useTranslation();
  const selectedEntityType = useStore($selectedEntityType);
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const selectedIndicatorId = getEntityMapValue(
    selectedLayerIdByEntity,
    selectedEntityType,
    null,
  );
  const [selectedId, setSelectedId] = useState(selectedIndicatorId);
  const connectivityLayers = useStore($connectivityLayers);
  const activeLayersByCountryByEntity = useStore(
    $activeLayerByCountryCodeByEntity,
  );
  const activeLayersByCountry =
    activeLayersByCountryByEntity[selectedEntityType] ?? {};
  const country = useStore($country) ?? { id: 0 };
  const handleConnectivityTypeChange = () => {
    onSelectEntityMainLayer({
      [selectedEntityType]: selectedId,
    });
  };

  imperativeHandle(ref, handleConnectivityTypeChange);

  return (
    <PopoverFilterContentConnectivitytype>
      <h2 className="filter-popover-title">
        {t('real-time-connectivity-data-layer')}
      </h2>
      <p className="filter-popover-explanation">
        {t(
          'please-select-the-real-time-connectivity-data-layer-you-want-to-visualise-on-the-map',
        )}
      </p>
      <RadioButtonGroup
        name="radio-button-group-connectivity-type"
        value={selectedId as number}
        defaultSelected={selectedId as number}
        onChange={(id) => {
          setCurrentLayer(id as number);
          setSelectedId(id as number);
        }}
      >
        {connectivityLayers
          .filter((layer) => isLayerForEntity(layer, selectedEntityType))
          .map((layer: LayerType) => {
            if (
              (!layer.created_by && layer.type === LayerTypeChoices.LIVE) ||
              (layer.applicable_countries?.length &&
                !layer.applicable_countries.includes(country.id))
            )
              return <></>;
            return (
              <RadioButton
                key={layer.id}
                labelText={layer.name}
                value={layer.id}
                id={`${layer.name}${layer.id}`}
                disabled={!activeLayersByCountry[String(layer.id)]}
              />
            );
          })}
      </RadioButtonGroup>
    </PopoverFilterContentConnectivitytype>
  );
});
