import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $currentLayerTypeUtilsByEntity,
  $isLoadingSchoolView,
  $selectedLayerDataByEntity,
} from '~/@/sidebar/sidebar.model';
import {
  getLiveSchoolDetails,
  getSchoolStatus,
  getStaticSchoolDetails,
} from '~/@/sidebar/school-view.utils';
import { $stylePaintData } from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import { SchoolStatsType } from '~/api/types';
import { Skeleton } from '~/components/ui/skeleton';
import { EntityType } from '~/@/entities';

import { HistoryGraphAccordian } from '../common-components/history-graph/history-graph-accordian.view';
import WeekSlider from '../global-and-country-view-components/common/week-slider/week-slider.view';
import LiveAverage from '../global-and-country-view-components/connectivity-layer/live-average.view';
import { ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';

import {
  formatStaticFieldValue,
} from './school-view.utils';
import LayerNameWithTooltip from '../global-and-country-view-components/common/layer-name-with-tooltip.view';

export function EntityMetricSummary({
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
  const isLoading = useStore($isLoadingSchoolView);
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

  if (isLive) {
    return (
      <section className="pt-1!">
        <div className="mx-4!">
          <div className="relative! flex! w-full! flex-col! gap-3! pb-6! pt-3!">
            <LiveAverage
              connectivityColor={liveDetails.color}
              currentLayerData={selectedLayerData}
              isLoading={isLoading}
              value={Number(liveDetails.value ?? 0)}
            />
            <WeekSlider entityType={entityType} />
          </div>
        </div>
        <HistoryGraphAccordian
          connectivityStats={entity as never}
          entityType={entityType}
          isLoading={isLoading}
          selectedLayerData={selectedLayerData}
        />
      </section>
    );
  }

  const statusLabel = t(
    ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus,
  );
  const unit =
    entity.benchmark_metadata?.display_unit ??
    selectedLayerData?.global_benchmark?.convert_unit ??
    '';

  if (isStatic) {
    const formattedValue = formatStaticFieldValue(staticDetails.value);
    const layerName = selectedLayerData?.name ?? '';
    const layerDescription = selectedLayerData?.description;

    return (
      <section className="mx-4! pt-1!">
        <div className="relative! flex! w-full! flex-col! gap-2! pb-6! pt-3!">
          {isLoading ? (
            <Skeleton className="h-11! w-[70%]!" />
          ) : (
            <>
              {layerName && (
                <LayerNameWithTooltip
                  description={layerDescription}
                  name={layerName}
                />
              )}
              {formattedValue !== 'N/A' ? (
                <p
                  className="m-0! break-words! text-[2rem]! font-normal! leading-tight!"
                  style={{ color: staticDetails.color }}
                >
                  {formattedValue}
                  {unit ? ` ${unit}` : ''}
                </p>
              ) : (
                <div className="mb-[2.6rem]!">
                  <p className="m-0! text-xs! font-normal! leading-4! text-foreground!">
                    {t('no-data-available')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-4! pt-1!">
      <div className="relative! flex! w-full! flex-col! gap-2! pb-6! pt-3!">
        {isLoading ? (
          <Skeleton className="h-11! w-[70%]!" />
        ) : (<>
          <LayerNameWithTooltip description={t('connectivity-status')} name={t('connectivity-status')} />
          <p
            className="m-0! break-words! text-[2.375rem]! font-normal! leading-tight! capitalize!"
            style={{ color: connectivityStatusColor }}
          >
            {statusLabel}
          </p>
        </>)}
      </div>
    </section>
  );
}