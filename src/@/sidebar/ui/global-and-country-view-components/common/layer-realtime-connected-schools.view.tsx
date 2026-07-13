import { useStore } from 'effector-react';

import {
  $realtimeSchoolConnectedOpenStatus,
  $stylePaintData,
  changeRealtimeSchoolConnectedOpenStatus,
} from '~/@/map/map.model';
import { $historyIntervalUnitByEntity } from '~/@/sidebar/history-graph.model';
import { ConnectivityDistribution } from '~/@/sidebar/sidebar.constant';
import {
  $connectivitySpeedFilterByEntity,
  $connectivityStatsByEntity,
} from '~/@/sidebar/sidebar.model';
import ProgressBar from '~/@/sidebar/ui/common-components/progress-bar/progress-bar.view';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

import { ConnectivityDistributionNames } from '../container/layer-view.constant';
import { AccordionItemTitle } from './accordion-item-title.view';

const LayerRealtimeConnectedSchools = ({
  entityType,
  isLoading,
}: {
  entityType: import('~/@/entities').EntityType;
  isLoading: boolean;
}) => {
  const connectivityShow = useStore($connectivitySpeedFilterByEntity)[
    entityType
  ];
  const connectivityStats = useStore($connectivityStatsByEntity)[entityType];
  const realtimeSchoolConnectedOpenStatus = useStore(
    $realtimeSchoolConnectedOpenStatus,
  );
  const connectivityColors = useStore($stylePaintData);
  const isWeek =
    (useStore($historyIntervalUnitByEntity)[entityType] ??
      IntervalUnit.week) === IntervalUnit.week;

  const legends = connectivityStats?.real_time_connected_entities;

  const label = `${isWeek ? 'Weekly' : 'Monthly'} distribution`;
  return (
    <Accordion
      collapsible
      onValueChange={(value) =>
        changeRealtimeSchoolConnectedOpenStatus(value === 'distribution')
      }
      type="single"
      value={realtimeSchoolConnectedOpenStatus ? 'distribution' : undefined}
    >
      <AccordionItem className="border-0!" value="distribution">
        <AccordionTrigger className="py-2! text-left! text-sm! font-medium! text-foreground! hover:no-underline!">
          <AccordionItemTitle tooltipLabel={label} label={<>{label}</>} />
        </AccordionTrigger>
        <AccordionContent className="pb-3!">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => <ProgressBar key={index} isLoading />)
            : Object.entries(legends ?? {}).map(([key, value]) => {
                const distributionKey = key as keyof NonNullable<
                  typeof connectivityShow
                >;
                if (!(connectivityShow?.[distributionKey] && value > 0))
                  return null;
                const distributionLabel = ConnectivityDistributionNames[key];
                const colorType = connectivityColors[key];
                return (
                  <ProgressBar
                    key={key}
                    isLoading={isLoading}
                    value={value}
                    maxValue={connectivityStats?.entity_with_realtime_data}
                    label={distributionLabel}
                    colorType={colorType}
                  />
                );
              })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LayerRealtimeConnectedSchools;
