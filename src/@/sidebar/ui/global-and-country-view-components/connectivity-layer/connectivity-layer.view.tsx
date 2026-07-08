import { useStore } from 'effector-react';

import type { EntityType } from '~/@/entities/types/base-entity.type';
import { UNKNOWN } from '~/@/map/map.types';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $selectedEntityType } from '~/@/entities/models/entity.model';
import {
  $connectivityStats,
  $connectivityStatsByEntity,
  $isLoadingCountryAdminView,
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
  entityType: EntityType;
}) {
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedEntityType = useStore($selectedEntityType);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const currentConnectivityStats = useStore($connectivityStats);
  const connectivityStats = entityType
    ? connectivityStatsByEntity[entityType]
    : currentConnectivityStats;
  const isLoading = useStore($isLoadingCountryAdminView);
  const currentLayerData =
    selectedLayerDataByEntity[entityType ?? selectedEntityType];
  const colorClassName =
    connectivityColorClassByStatus[
    connectivityStats?.live_avg_connectivity ?? UNKNOWN
    ] ?? 'text-neutral!';

  return (
    <>
      <div className="mx-4!">
        <div className="relative! flex! w-full! flex-col! pt-3! pb-6! gap-3!">
          <LiveAverage
            isLoading={isLoading}
            colorClassName={colorClassName}
            currentLayerData={currentLayerData}
            value={connectivityStats?.live_avg ?? 0}
          />
          <WeekSlider entityType={entityType} />
        </div>
      </div>
      <HistoryGraphAccordian
        connectivityStats={connectivityStats}
        entityType={entityType}
        isLoading={isLoading}
        selectedLayerData={currentLayerData}
      />
      <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
    </>
  );
}
