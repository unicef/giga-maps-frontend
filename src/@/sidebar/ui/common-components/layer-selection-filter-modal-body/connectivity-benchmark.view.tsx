import { RadioButton, RadioButtonGroup, Tooltip } from "@carbon/react";
import { useStore } from 'effector-react';
import { forwardRef, useState } from 'react'
import { Information } from '@carbon/icons-react'

import { ConnectivityBenchMarks, Layers } from "~/@/sidebar/sidebar.constant";
import {
  $connectivityBenchMark,
  $indicatorBenchmark,
  $isNationalBenchmark,
  changeConnectivityBenchmark,
} from '~/@/sidebar/sidebar.model';
import { imperativeHandle } from "~/lib/utils/react.util";

import { PopoverFilterContentBenchmark } from "../styles/layer-filter-modal.style";

export default forwardRef(function ConnectivityBenchmark(_props, ref) {
  const connectivityBenchMark = useStore($connectivityBenchMark);
  const [connectivityBenchmarkValue, setConnectivityBenchmarkValue] = useState<ConnectivityBenchMarks>(connectivityBenchMark);
  const isNationalBenchmark = useStore($isNationalBenchmark);
  const handleBenchmarkChange = () => {
    changeConnectivityBenchmark(connectivityBenchmarkValue)
  };

  imperativeHandle(ref, handleBenchmarkChange);

  return (
    <PopoverFilterContentBenchmark>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 className="filter-popover-title">Real-time connectivity data layer benchmark</h2>
        <Tooltip className='info-icon' align="left" autoAlign={true} label={"You will see the impact on map legend where green is for schools surpassing global or national standards, yellow is for schools between global or national connectivity standard and red category which is for schools receiving lowest level of connectivity. "}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </div>
      <p className="filter-popover-explanation">Please select if you wish to view the selected real-time connectivity data layer as per Giga’s global connectivity standard or the national standard of the country selected.</p>

      <RadioButtonGroup
        name="radio-button-group"
        defaultSelected={connectivityBenchmarkValue}
        onChange={(selection) => setConnectivityBenchmarkValue(selection as ConnectivityBenchMarks)}
      >
        <RadioButton
          labelText="Global"
          value={ConnectivityBenchMarks.global}
          id="globalId"
        />
        <RadioButton
          labelText="National"
          value={ConnectivityBenchMarks.national}
          id="nationalId"
          disabled={!isNationalBenchmark}
        />
      </RadioButtonGroup>
    </PopoverFilterContentBenchmark>
  )
});
