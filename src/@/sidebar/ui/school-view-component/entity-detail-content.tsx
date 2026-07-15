import { useStore } from 'effector-react';

import { $currentLayerTypeUtilsByEntity } from '~/@/sidebar/sidebar.model';
import { SchoolStatsType } from '~/api/types';
import { Separator } from '~/components/ui/separator';
import { EntityType } from '~/@/entities';

import { EntityMetricSummary } from './entity-metric-summary';
import { EntityInformation } from './entity-information';
import { EntityDuplicateLocationList } from './entity-duplicate-location-list';

export function EntityDetailContent({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const showSectionSeparator = isLive || isStatic;

  return (
    <div className="min-w-0!">
      <EntityMetricSummary entity={entity} entityType={entityType} />
      {showSectionSeparator && <Separator className="my-2!" />}
      <EntityInformation entity={entity} entityType={entityType} />
      <EntityDuplicateLocationList entity={entity} entityType={entityType} />
    </div>
  );
}
