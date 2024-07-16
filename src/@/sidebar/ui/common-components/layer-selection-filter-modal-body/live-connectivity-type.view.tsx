import { RadioButton, RadioButtonGroup } from "@carbon/react";
import { useStore } from 'effector-react';
import { forwardRef, useState } from 'react'

import { Layers } from "~/@/sidebar/sidebar.constant";
import {
  $activeLayerByCountryCode,
  $connectivityLayers, $selectedLayerId, onSelectMainLayer,
} from '~/@/sidebar/sidebar.model';
import { imperativeHandle } from "~/lib/utils/react.util";

import { PopoverFilterContentConnectivitytype } from "../styles/layer-filter-modal.style";
import { LayerType } from "~/@/sidebar/types";
import { $country } from "~/@/country/country.model";


export default forwardRef(function LiveConnectivityType(_props, ref) {
  const selectedIndicatorId = useStore($selectedLayerId);
  const [selectedId, setConnectivityTypeValue] = useState(selectedIndicatorId);
  const connectivityLayers = useStore($connectivityLayers);
  const activeLayersByCountry = useStore($activeLayerByCountryCode);
  const country = useStore($country) ?? { id: 0 }
  const handleConnectivityTypeChange = () => {
    onSelectMainLayer(selectedId);
  };

  imperativeHandle(ref, handleConnectivityTypeChange)

  return (
    <PopoverFilterContentConnectivitytype>
      <h2 className="filter-popover-title">Real-time connectivity data layer</h2>
      <p className="filter-popover-explanation">Please select the real-time connectivity data layer you want to visualise on the map.</p>
      <RadioButtonGroup
        name="radio-button-group-connectivity-type"
        value={selectedId as number}
        defaultSelected={selectedId as number}
        onChange={(id) => setConnectivityTypeValue(id as number)}
      >
        {connectivityLayers.map((layer: LayerType) => {
          if (layer.applicable_countries?.length && !layer.applicable_countries.includes(country.id)) return <></>;
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

