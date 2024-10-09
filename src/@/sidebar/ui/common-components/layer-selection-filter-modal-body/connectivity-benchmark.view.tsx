import { RadioButton, RadioButtonGroup, Tooltip } from "@carbon/react";
import { useStore } from 'effector-react';
import { forwardRef, useEffect, useState } from 'react'
import { Information } from '@carbon/icons-react'

import { ConnectivityBenchMarks } from "~/@/sidebar/sidebar.constant";
import {
  $benchmarkNamesAllLayers,
  $benchmarkmarkUtils,
  $connectivityBenchMark,
  $layerUtils,
  changeConnectivityBenchmark,
} from '~/@/sidebar/sidebar.model';
import { imperativeHandle } from "~/lib/utils/react.util";

import { PopoverFilterContentBenchmark } from "../styles/layer-filter-modal.style";
import { $countryActiveLayersDataById, $countryBenchmark, $countryConnectivityNames, $countryDefaultNational } from "~/@/country/country.model";
import { useTranslation } from "react-i18next";

export default forwardRef(function ConnectivityBenchmark({ layerId }: { layerId: null | number }, ref) {
  const { t } = useTranslation();
  const countryConnectivityNames = useStore($countryConnectivityNames)
  const benchmarkNames = useStore($benchmarkNamesAllLayers);
  const { selectedLayerId, currentLayerTypeUtils } = useStore($layerUtils);
  const { isLive } = currentLayerTypeUtils;
  const connectivityBenchMark = useStore($connectivityBenchMark);
  const countryBenchmark = useStore($countryBenchmark)
  const [connectivityBenchmarkValue, setConnectivityBenchmarkValue] = useState<ConnectivityBenchMarks>(connectivityBenchMark);
  const defaultNationalBenchmark = useStore($countryDefaultNational);
  const currentLegendConfig = useStore($countryActiveLayersDataById)[layerId ?? selectedLayerId ?? ""]?.legend_configs ?? {};
  const isCountryNationalBenchmark = !!countryBenchmark[layerId ?? selectedLayerId ?? 0] || Object.keys(currentLegendConfig).length > 0;
  const handleBenchmarkChange = () => {
    changeConnectivityBenchmark(connectivityBenchmarkValue)
  };

  imperativeHandle(ref, handleBenchmarkChange);

  useEffect(() => {
    if (layerId) {
      let currentBenchmarkValue = connectivityBenchmarkValue;
      const hasDefaultNationalBenchmark = !!defaultNationalBenchmark[layerId ?? 0];
      if (currentBenchmarkValue === ConnectivityBenchMarks.national && (!isCountryNationalBenchmark || !hasDefaultNationalBenchmark)) {
        currentBenchmarkValue = ConnectivityBenchMarks.global;
      }
      if (currentBenchmarkValue === ConnectivityBenchMarks.global && hasDefaultNationalBenchmark) {
        currentBenchmarkValue = ConnectivityBenchMarks.national;
      }
      setConnectivityBenchmarkValue(currentBenchmarkValue)
    }
  }, [layerId, defaultNationalBenchmark, setConnectivityBenchmarkValue])

  return (
    <PopoverFilterContentBenchmark>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 className="filter-popover-title">{isLive ? 'Real-time connectivity ' : 'Static '} {t('data-layer-benchmark')}</h2>
        <Tooltip className='info-icon' align="left-top" autoAlign={true} label={"You will see the impact on map legend where green is for schools surpassing global or national standards, yellow is for schools between global or national connectivity standard and red category which is for schools receiving lowest level of connectivity. "}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </div>
      {isLive && <p className="filter-popover-explanation">{t('please-select-if-you-wish-to-view-the-selected-real-time-connectivity-data-layer-as-per-giga-s-global-connectivity-standard-or-the-national-standard-of-the-country-selected')}</p>}
      {!isLive && <p className="filter-popover-explanation">{t('please-select-if-you-wish-to-view-the-selected-static-data-layer-as-per-giga-s-global-standard-or-the-national-standard-of-the-country-selected')}</p>}
      <RadioButtonGroup
        name="radio-button-group"
        defaultSelected={connectivityBenchmarkValue}
        valueSelected={connectivityBenchmarkValue}
        onChange={(selection) => setConnectivityBenchmarkValue(selection as ConnectivityBenchMarks)}
      >
        <RadioButton
          labelText={benchmarkNames[layerId ?? selectedLayerId ?? ""] ?? 'Global'}
          value={ConnectivityBenchMarks.global}
          id="globalId"
        />
        <RadioButton
          labelText={countryConnectivityNames?.[layerId ?? selectedLayerId ?? ""] ?? 'National'}
          value={ConnectivityBenchMarks.national}
          id="nationalId"
          disabled={!isCountryNationalBenchmark}
        />
      </RadioButtonGroup>
    </PopoverFilterContentBenchmark>
  )
});
