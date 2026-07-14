import { useStore } from 'effector-react';

import type { EntityType } from '~/@/entities/types/base-entity.type';
import { UNKNOWN } from '~/@/map/map.types';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  $connectivityStatsByEntity,
  $isLoadingCountryAdminView,
  $selectedLayerDataByEntity,
} from '~/@/sidebar/sidebar.model';

import HistoryGraph from '../../common-components/history-graph';
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
  entityType: EntityType;
}) {
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const connectivityStats = connectivityStatsByEntity[entityType];
  const isLoading = useStore($isLoadingCountryAdminView);
  const currentLayerData = selectedLayerDataByEntity[entityType];
  const colorClassName =
    connectivityColorClassByStatus[
    connectivityStats?.live_avg_connectivity ?? UNKNOWN
    ] ?? 'text-neutral!';

  return (
    <>
      <div className="mx-4! py-2! flex! flex-col! justify-start! items-start! gap-1!">
        <div className="self-stretch! flex! flex-col! justify-start! items-start! gap-4!">
          <LiveAverage
            isLoading={isLoading}
            colorClassName={colorClassName}
            currentLayerData={currentLayerData}
            value={connectivityStats?.live_avg ?? 0}
          />
          <WeekSlider entityType={entityType} />
        </div>
        <HistoryGraph
          connectivityStats={connectivityStats}
          entityType={entityType}
          isLoading={isLoading}
          selectedLayerData={currentLayerData}
        />
        <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
      </div>
    </>
  );
}
