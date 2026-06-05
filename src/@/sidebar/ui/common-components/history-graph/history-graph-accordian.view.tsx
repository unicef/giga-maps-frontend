import type { LayerType } from '~/@/sidebar/types';
import type {
  ConnectivityStat,
  EntityConnectivityStat,
  SchoolStatsType,
} from '~/api/types';

import HistoryGraph from './history-graph.view';

export function HistoryGraphAccordian({
  connectivityStats,
  schoolData,
  isLoading,
  selectedLayerData,
}: {
  readonly connectivityStats?: ConnectivityStat | EntityConnectivityStat | null;
  readonly schoolData?: SchoolStatsType;
  readonly isLoading?: boolean;
  readonly selectedLayerData?: LayerType | null;
}) {
  return (
    <div className="mx-4!">
      <HistoryGraph
        connectivityStats={connectivityStats}
        schoolData={schoolData}
        isLoading={isLoading}
        selectedLayerData={selectedLayerData}
      />
    </div>
  );
}
