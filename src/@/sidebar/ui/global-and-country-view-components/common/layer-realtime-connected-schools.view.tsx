import { AccordionItem } from '@carbon/react';
import { combine } from 'effector';
import { useStore } from 'effector-react';
import { useCallback } from 'react'

import { $realtimeSchoolConnectedOpenStatus, $stylePaintData, changeRealtimeSchoolConnectedOpenStatus } from '~/@/map/map.model';
import { $historyIntervalUnit } from '~/@/sidebar/history-graph.model';
import { ConnectivityDistribution } from '~/@/sidebar/sidebar.constant';
import { $connectivitySpeedGood, $connectivitySpeedModerate, $connectivitySpeednoInternet, $connectivitySpeedUnknown, $connectivityStats } from '~/@/sidebar/sidebar.model';
import ProgressBar from '~/@/sidebar/ui/common-components/progress-bar/progress-bar.view';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

import { ConnectivityDistributionNames } from '../container/layer-view.constant';
import { AccordionItemTitle } from './accordion-item-title.view';

const $showProgress = combine({
  [ConnectivityDistribution.good]: $connectivitySpeedGood,
  [ConnectivityDistribution.moderate]: $connectivitySpeedModerate,
  [ConnectivityDistribution.noInternet]: $connectivitySpeednoInternet,
  [ConnectivityDistribution.unknown]: $connectivitySpeedUnknown,
})

const LayerRealtimeConnectedSchools = ({ isLoading }: { isLoading: boolean }) => {
  const connectivityShow = useStore($showProgress);
  const connectivityStats = useStore($connectivityStats);
  const realtimeSchoolConnectedOpenStatus = useStore($realtimeSchoolConnectedOpenStatus);
  const connectivityColors = useStore($stylePaintData);
  const isWeek = useStore($historyIntervalUnit) === IntervalUnit.week;

  const handleAccordionChange = useCallback(() => {
    changeRealtimeSchoolConnectedOpenStatus(!realtimeSchoolConnectedOpenStatus);
  }, [realtimeSchoolConnectedOpenStatus]);

  // let legends;
  // if (connectivityBenchMark === ConnectivityBenchMarks.global) {
  let legends = connectivityStats?.real_time_connected_schools;
  // } 

  const label = `${isWeek ? 'Weekly' : 'Monthly'} distribution`;
  return (
    <>
      <AccordionItem title={<AccordionItemTitle tooltipLabel={label} label={<>{label}</>} />} open={realtimeSchoolConnectedOpenStatus} onHeadingClick={handleAccordionChange}>        <>
        {isLoading ? Array(4).fill(0).map((_, index) => <ProgressBar key={index} isLoading />)
          :
          Object.entries(legends || {}).map(([key, value]) => {
            if (!(connectivityShow[key] && value > 0)) return null;
            const label = ConnectivityDistributionNames[key];
            const colorType = connectivityColors[key] as string;
            return <ProgressBar key={key}
              isLoading={isLoading}
              value={value}
              maxValue={connectivityStats?.school_with_realtime_data}
              label={label}
              colorType={colorType}
            />
          })}
      </>
      </AccordionItem>
    </>
  )
}

export default LayerRealtimeConnectedSchools
