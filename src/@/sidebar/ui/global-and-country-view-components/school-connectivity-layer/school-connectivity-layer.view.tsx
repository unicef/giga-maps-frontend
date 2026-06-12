import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $entityConfigMap,
  $selectedEntityConfig,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStats, $globalStatsByEntity } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $isLoadingCountryAdminView } from '~/@/sidebar/sidebar.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $lng } from '~/core/i18n/store';
import { mapSchools } from '~/core/routes';
import { useRoute } from '~/lib/router';
import { formatNumber } from '~/lib/utils';

const SchoolConnectivityLayer = ({
  entityType,
}: {
  entityType?: EntityType;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const globalStats = useStore($globalStats);
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
  const schoolView = useRoute(mapSchools);
  const connectedValue =
    selectedEntityGlobalStats?.connected_entities?.connected ??
    globalStats?.connected_schools?.connected ??
    0;
  const totalMappedValue =
    selectedEntityGlobalStats?.entities_connected ??
    selectedEntityGlobalStats?.entities_total ??
    globalStats?.schools_connected ??
    0;
  const connectedNumber = formatNumber(connectedValue, lng);
  const totalMappedNumber = formatNumber(totalMappedValue, lng);
  const isConnected = connectedValue > 0;
  const entityLabel = t(selectedEntityConfig?.slug ?? 'school', selectedEntityConfig?.slug ? undefined : { count: 2 });
  return (
    <div className="flex! h-full! flex-col! justify-between! max-md:h-auto!">
      <div>
        {!schoolView && (
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
                  {selectedEntityType === EntityType.SCHOOL
                    ? `${isConnected ? `${t('connected-schools-for-total-mapped-number', { count: totalMappedValue, total: totalMappedNumber })} ` : ''}${t('schools-mapped')}`
                    : `${isConnected ? `${t('connected')} ${entityLabel} / ${totalMappedNumber} ` : ''}${entityLabel} mapped`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <FooterDataSourcePopUp
        showOldDataSource={true}
        isFooter={false}
      />
    </div>
  );
};

export default SchoolConnectivityLayer;
