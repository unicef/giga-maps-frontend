import { useStore } from 'effector-react';
import { Hash, MapPin, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  $currentLayerTypeUtilsByEntity,
  $selectedLayerDataByEntity,
} from '~/@/sidebar/sidebar.model';
import {
  getLiveSchoolDetails,
  getNullValueText,
  getSchoolStatus,
  getStaticSchoolDetails,
} from '~/@/sidebar/school-view.utils';
import { $stylePaintData } from '~/@/map/map.model';
import { SchoolStatsType } from '~/api/types';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { EntityType } from '~/@/entities';

import { ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';

import { LayerIcon } from './detail-line';
import {
  formatStaticFieldValue,
  getCollapsedEntityIdLabel,
  getEntityCountLabel,
} from './school-view.utils';

export function EntityCollapsedSummary({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const { t } = useTranslation();
  const stylePaintData = useStore($stylePaintData);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = selectedLayerDataByEntity[entityType];
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const liveDetails = getLiveSchoolDetails({
    schoolDetails: entity,
    stylePaintData,
  });
  const staticDetails = getStaticSchoolDetails({
    schoolDetails: entity,
    stylePaintData,
  });
  const statusLabel = t(
    ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus,
  );
  const unit =
    entity.benchmark_metadata?.display_unit ??
    selectedLayerData?.global_benchmark?.convert_unit ??
    '';
  const coordinates = entity.geopoint?.coordinates?.join(', ');
  const countLabel = getEntityCountLabel(entity);
  const metricColor = isLive ? liveDetails.color : staticDetails.color;
  const staticValue = formatStaticFieldValue(staticDetails.value);
  const metricValue = isLive
    ? liveDetails.value
      ? `${liveDetails.value}${unit ? ` ${unit}` : ''}`
      : getNullValueText(connectivityStatus)
    : isStatic && staticValue !== 'N/A'
      ? `${staticValue}${unit ? ` ${unit}` : ''}`
      : null;

  return (
    <div className="mt-3! space-y-3!">
      <div className="grid! grid-cols-2! gap-x-4! gap-y-2! text-xs! leading-5! text-muted-foreground!">
        <span className="flex! min-w-0! items-center! gap-1.5!">
          <Hash className="size-3.5! shrink-0!" />
          <span
            className="truncate!"
            title={String(getCollapsedEntityIdLabel(entity))}
          >
            {getCollapsedEntityIdLabel(entity)}
          </span>
        </span>
        {coordinates && (
          <span className="flex! min-w-0! items-center! gap-1.5!">
            <MapPin className="size-3.5! shrink-0!" />
            <span className="truncate!" title={coordinates}>
              {coordinates}
            </span>
          </span>
        )}
        {countLabel && (
          <span className="col-span-2! flex! min-w-0! items-center! gap-1.5!">
            <Hash className="size-3.5! shrink-0!" />
            <span className="truncate!" title={countLabel}>
              {countLabel}
            </span>
          </span>
        )}
      </div>
      <div className="flex! flex-wrap! items-center! gap-x-6! gap-y-2! text-sm! leading-5!">
        <span
          className="inline-flex! items-center! gap-2!"
          style={{ color: connectivityStatusColor }}
        >
          <span className="flex! shrink-0! items-center! justify-center!">
            <EntityLegendIndicator
              color={connectivityStatusColor}
              entityType={entityType}
              size={16}
            />
          </span>
          {statusLabel}
        </span>
        {metricValue && (
          <span
            className="inline-flex! items-center! gap-2!"
            style={{ color: metricColor }}
          >
            {isLive ? (
              <Wifi className="size-3.5! text-muted-foreground!" />
            ) : (
              <LayerIcon icon={selectedLayerData?.icon} />
            )}
            <span>{metricValue}</span>
          </span>
        )}
      </div>
    </div>
  );
}
