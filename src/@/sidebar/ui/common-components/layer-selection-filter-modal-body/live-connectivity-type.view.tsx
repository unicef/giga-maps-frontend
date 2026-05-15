import { RadioButton, RadioButtonGroup } from "@carbon/react";
import { useStore } from 'effector-react';
import { forwardRef, useMemo, useState } from 'react'
import { useTranslation } from "react-i18next";

import { $country } from "~/@/country/country.model";
import {
  $activeLayerByCountryCode,
  $connectivityLayers, $selectedLayerId, onSelectMainLayer,
} from '~/@/sidebar/sidebar.model';
import { LayerType, LayerTypeChoices } from "~/@/sidebar/types";
import { imperativeHandle } from "~/lib/utils/react.util";

import { PopoverFilterContentConnectivitytype } from "../styles/layer-filter-modal.style";


export default forwardRef(function LiveConnectivityType({ setCurrentLayer }: { setCurrentLayer: (id: null | number) => void }, ref) {
  const { t } = useTranslation();
  const selectedIndicatorId = useStore($selectedLayerId);
  const [selectedId, setSelectedId] = useState(selectedIndicatorId);
  const connectivityLayers = useStore($connectivityLayers);
  const activeLayersByCountry = useStore($activeLayerByCountryCode);
  const country = useStore($country) ?? { id: 0 }
  const handleConnectivityTypeChange = () => {
    onSelectMainLayer(selectedId);
  };

  useMemo(() => {

  }, [connectivityLayers])

  imperativeHandle(ref, handleConnectivityTypeChange)
  console.log("layer connectivity", connectivityLayers)
  return (
    <PopoverFilterContentConnectivitytype>
      <h2 className="filter-popover-title">{t('real-time-connectivity-data-layer')}</h2>
      <p className="filter-popover-explanation">{t('please-select-the-real-time-connectivity-data-layer-you-want-to-visualise-on-the-map')}</p>
      <RadioButtonGroup
        name="radio-button-group-connectivity-type"
        value={selectedId as number}
        defaultSelected={selectedId as number}
        onChange={(id) => {
          setCurrentLayer(id as number)
          setSelectedId(id as number)
        }}
      >
        {connectivityLayers.map((layer: LayerType) => {
          if ((!layer.created_by && layer.type === LayerTypeChoices.LIVE) || layer.applicable_countries?.length && !layer.applicable_countries.includes(country.id)) return <>na {layer.name}</>;
          return (
            <RadioButton
              key={layer.id}
              labelText={layer.name}
              value={layer.id}
              id={`${layer.name}${layer.id}`}
              disabled={!activeLayersByCountry[String(layer.id)]}
            />)
        })}
      </RadioButtonGroup>
    </PopoverFilterContentConnectivitytype>
  )
});

