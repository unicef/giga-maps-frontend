import { useStore } from 'effector-react';

import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $stylePaintData } from '~/@/map/map.model';
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

export default function ConnectivityLayer({
  entityType,
  isLiveDataLoading = false,
}: {
  entityType: EntityType;
  isLiveDataLoading?: boolean;
}) {
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const connectivityStats = connectivityStatsByEntity[entityType];
  const isLoadingCountryAdminView = useStore($isLoadingCountryAdminView);
  const isLoading = isLiveDataLoading || isLoadingCountryAdminView;
  const currentLayerData = selectedLayerDataByEntity[entityType];
  const stylePaintData = useStore($stylePaintData);
  const connectivityColor =
    stylePaintData[
    connectivityStats?.live_avg_connectivity ?? UNKNOWN
    ] ?? stylePaintData[UNKNOWN];

  return (
    <>
      <div className="mx-4! py-4! flex! flex-col! justify-start! items-start! gap-6!">
        <div className="self-stretch! flex! flex-col! justify-start! items-start! gap-4!">
          <LiveAverage
            isLoading={isLoading}
            connectivityColor={connectivityColor}
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
