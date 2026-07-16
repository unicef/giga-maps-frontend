import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $entityConfigMap } from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $isLoadingCountryAdminView } from '~/@/sidebar/sidebar.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';
import LayerNameWithTooltip from '../common/layer-name-with-tooltip.view';

const SchoolConnectivityLayer = ({
  entityType,
}: {
  entityType: EntityType;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const entityConfigMap = useStore($entityConfigMap);
  const entityConfig = entityConfigMap[entityType];
  const selectedEntityGlobalStats = globalStatsByEntity[entityType];
  const isLoading = useStore($isLoadingCountryAdminView);
  const connectedValue =
    selectedEntityGlobalStats?.connected_entities?.connected ?? 0;
  const totalMappedValue =
    selectedEntityGlobalStats?.entities_connected ??
    selectedEntityGlobalStats?.entities_total ??
    0;
  const connectedNumber = formatNumber(connectedValue, lng);
  const totalMappedNumber = formatNumber(totalMappedValue, lng);
  const isConnected = connectedValue > 0;
  const entityLabel = t(entityConfig?.slug ?? entityType, {
    count: 2,
  });
  return (
    <div className="mx-4! py-4! flex! flex-col! justify-start! items-start! gap-6! h-full! max-md:h-auto!">
      <div className="self-stretch! flex! flex-col! justify-start! items-start! gap-4!">
        {isLoading ? (
          <div className="self-stretch! flex! flex-col! gap-2!">
            <Skeleton className="h-10! w-24!" />
            <Skeleton className="h-4! w-full!" />
          </div>
        ) : (
          <div className="self-stretch! flex! flex-col! justify-start! items-start! gap-2!">
            <LayerNameWithTooltip description={t('connectivity-status')} name={t('connectivity-status')} />
            <p
              className={
                isConnected
                  ? 'm-0! text-3xl! font-bold! font-manrope! leading-9! text-success!'
                  : 'm-0! text-3xl! font-bold! font-manrope! leading-9! text-foreground!'
              }
              data-title={t('int', {
                val: (isConnected ? connectedValue : totalMappedValue) ?? 0,
              })}
            >
              {isConnected ? connectedNumber : totalMappedNumber}
            </p>
            <p className="m-0! text-xs! font-normal! leading-4! text-muted-foreground!">
              {isConnected
                ? `${t('connected')} ${entityLabel} / ${totalMappedNumber} ${entityLabel} mapped`
                : `${entityLabel} mapped`}
            </p>
          </div>
        )}
      </div>
      <FooterDataSourcePopUp
        showOldDataSource={true}
        isFooter={false}
        entityType={entityType}
      />
    </div>
  );
};

export default SchoolConnectivityLayer;
