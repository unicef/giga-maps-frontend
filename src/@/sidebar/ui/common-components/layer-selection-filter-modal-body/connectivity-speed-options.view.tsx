import { Checkbox } from "@carbon/react";
import { combine } from "effector";
import { useStore } from 'effector-react';
import { forwardRef, useState } from 'react'

import { ConnectivityDistribution } from "~/@/sidebar/sidebar.constant";
import {
  $benchmarkmarkUtils,
  $connectivitySpeedGood,
  $connectivitySpeedModerate,
  $connectivitySpeednoInternet,
  $connectivitySpeedUnknown,
  $connectivityStats,
  changeConnectivitySpeedGood,
  changeConnectivitySpeedModerate,
  changeConnectivitySpeednoInternet,
  changeConnectivitySpeedUnknown,
} from '~/@/sidebar/sidebar.model';
import { imperativeHandle } from "~/lib/utils/react.util";

import { ConnectivityDistributionNames } from "../../global-and-country-view-components/container/layer-view.constant";
import { PopoverFilterContentSpeed } from "../styles/layer-filter-modal.style";

const $defaultSpeed = combine({
  [ConnectivityDistribution.good]: $connectivitySpeedGood,
  [ConnectivityDistribution.moderate]: $connectivitySpeedModerate,
  [ConnectivityDistribution.noInternet]: $connectivitySpeednoInternet,
  [ConnectivityDistribution.unknown]: $connectivitySpeedUnknown
})

export default forwardRef(function ConnectivitySpeedOptions(_props, ref) {
  const defaultSpeed = useStore($defaultSpeed);
  const connectivityStats = useStore($connectivityStats);
  const { benchmarkLogic } = useStore($benchmarkmarkUtils)
  const [currentConnectivitySpeed, setCurrentConnectivitySpeed] = useState(defaultSpeed as Record<string, boolean>)

  const handleConnectivityTypeChange = () => {
    changeConnectivitySpeedGood(currentConnectivitySpeed.good);
    changeConnectivitySpeedModerate(currentConnectivitySpeed.moderate);
    changeConnectivitySpeednoInternet(currentConnectivitySpeed.no_internet);
    changeConnectivitySpeedUnknown(currentConnectivitySpeed.unknown);
  }

  let legends = connectivityStats?.real_time_connected_schools;

  imperativeHandle(ref, handleConnectivityTypeChange);
  return (<>
    {
      connectivityStats?.school_with_realtime_data > 0 &&
      <PopoverFilterContentSpeed>
        <h2 className="filter-popover-title">Download Speed</h2>
        <p className="filter-popover-explanation">Explanation about what are the speeds and the logic behind them</p>
        <fieldset className="cds--fieldset">
          {Object.entries(legends ?? {}).map(([key, value]) => {
            return value > 0 &&
              <Checkbox
                key={key}
                labelText={`${ConnectivityDistributionNames[key]} ${benchmarkLogic ? benchmarkLogic[key] : ''}`}
                id={`${key}Id`}
                checked={currentConnectivitySpeed[key]}
                onChange={(_e, { checked }) => setCurrentConnectivitySpeed({
                  ...currentConnectivitySpeed,
                  [key]: checked
                })}
              />
          })
          }
        </fieldset>
      </PopoverFilterContentSpeed >
    }
  </>
  )
});
