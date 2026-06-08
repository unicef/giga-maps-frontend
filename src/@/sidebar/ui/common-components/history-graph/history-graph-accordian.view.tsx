import type { EntityType } from '~/@/entities';
import type { LayerType } from '~/@/sidebar/types';
import type {
  ConnectivityStat,
  EntityConnectivityStat,
  SchoolStatsType,
} from '~/api/types';

import HistoryGraph from './history-graph.view';

export function HistoryGraphAccordian({
  connectivityStats,
  entityType,
  schoolData,
  isLoading,
  selectedLayerData,
}: {
  readonly connectivityStats?: ConnectivityStat | EntityConnectivityStat | null;
  readonly entityType?: EntityType;
  readonly schoolData?: SchoolStatsType;
  readonly isLoading?: boolean;
  readonly selectedLayerData?: LayerType | null;
}) {
  return (
    <div className="mx-4!">
      <HistoryGraph
        connectivityStats={connectivityStats}
        entityType={entityType}
        schoolData={schoolData}
        isLoading={isLoading}
        selectedLayerData={selectedLayerData}
      />
    </div>
  );
}
