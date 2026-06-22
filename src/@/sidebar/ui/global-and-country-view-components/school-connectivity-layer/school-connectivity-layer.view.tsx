import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $entityConfigMap,
  $selectedEntityConfig,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $isLoadingCountryAdminView } from '~/@/sidebar/sidebar.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

const SchoolConnectivityLayer = ({
  entityType,
}: {
  entityType?: EntityType;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const currentSelectedEntityType = useStore($selectedEntityType);
  const selectedEntityType = entityType ?? currentSelectedEntityType;
  const currentSelectedEntityConfig = useStore($selectedEntityConfig);
  const entityConfigMap = useStore($entityConfigMap);
  const selectedEntityConfig = entityType
    ? entityConfigMap[entityType]
    : currentSelectedEntityConfig;
  const selectedEntityGlobalStats = globalStatsByEntity[selectedEntityType];
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
  const entityLabel = t(selectedEntityConfig?.slug ?? selectedEntityType, {
    count: 2,
  });
  return (
    <div className="flex! h-full! flex-col! justify-between! max-md:h-auto!">
      <div>
        <div className="mt-5! ml-4!">
          {isLoading ? (
            <>
              <Skeleton className="h-[3.5625rem]! w-16!" />
              <Skeleton className="mt-2! h-2! w-full!" />
            </>
          ) : (
            <div className="mr-4!">
              <p
                className={
                  isConnected
                    ? 'my-2! text-[2.375rem]! font-normal! leading-none! text-success!'
                    : 'my-2! text-[2.375rem]! font-normal! leading-none! text-foreground!'
                }
                data-title={t('int', {
                  val: (isConnected ? connectedValue : totalMappedValue) ?? 0,
                })}
              >
                {isConnected ? connectedNumber : totalMappedNumber}
              </p>
              <p className="my-2! text-xs! font-normal! leading-4! text-muted-foreground!">
                {isConnected
                  ? `${t('connected')} ${entityLabel} / ${totalMappedNumber} ${entityLabel} mapped`
                  : `${entityLabel} mapped`}
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterDataSourcePopUp
        showOldDataSource={true}
        isFooter={false}
      />
    </div>
  );
};

export default SchoolConnectivityLayer;
