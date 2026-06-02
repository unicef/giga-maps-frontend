import { useStore } from 'effector-react';

import type { EntityType } from '~/@/entities/types/base-entity.type';
import { UNKNOWN } from '~/@/map/map.types';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  $connectivityStats,
  $connectivityStatsByEntity,
  $isLoadingCountryAdminView,
  $selectedLayerData,
  $selectedLayerDataByEntity,
} from '~/@/sidebar/sidebar.model';

import { HistoryGraphAccordian } from '../../common-components/history-graph';
import WeekSlider from '../common/week-slider/week-slider.view';
import LiveAverage from './live-average.view';

const connectivityColorClassByStatus: Record<string, string> = {
  good: 'text-success!',
  moderate: 'text-warning!',
  no_internet: 'text-error-brand!',
  bad: 'text-error-brand!',
  unknown: 'text-neutral!',
};

export default function ConnectivityLayer({
  entityType,
}: {
  entityType?: EntityType;
}) {
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = useStore($selectedLayerData);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const currentConnectivityStats = useStore($connectivityStats);
  const connectivityStats = entityType
    ? connectivityStatsByEntity[entityType]
    : currentConnectivityStats;
  const isLoading = useStore($isLoadingCountryAdminView);
  const currentLayerData = entityType
    ? selectedLayerDataByEntity[entityType]
    : selectedLayerData;
  const colorClassName =
    connectivityColorClassByStatus[
    connectivityStats?.live_avg_connectivity ?? UNKNOWN
    ] ?? 'text-neutral!';

  return (
    <>
      <div className="mx-4!">
        <div className="relative! flex! w-full! flex-col! pt-3! pb-6!">
          <LiveAverage
            isLoading={isLoading}
            colorClassName={colorClassName}
            currentLayerData={currentLayerData}
            value={connectivityStats?.live_avg ?? 0}
          />
          <WeekSlider />
        </div>
      </div>
      <HistoryGraphAccordian isLoading={isLoading} />
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </>
  );
}
