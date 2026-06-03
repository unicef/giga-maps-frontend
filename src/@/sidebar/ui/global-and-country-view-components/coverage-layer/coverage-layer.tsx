import { useStore } from 'effector-react';
import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  $entityConfigMap,
  $selectedEntityConfig,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  $coverageStats,
  $coverageStatsByEntity,
  $isLoadingCountryAdminView,
  $layerUtils,
} from '~/@/sidebar/sidebar.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

const CoverageLayer = ({ entityType }: { entityType?: EntityType }) => {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const currentCoverageStats = useStore($coverageStats);
  const coverageStatsByEntity = useStore($coverageStatsByEntity);
  const currentSelectedEntityType = useStore($selectedEntityType);
  const selectedEntityType = entityType ?? currentSelectedEntityType;
  const currentSelectedEntityConfig = useStore($selectedEntityConfig);
  const entityConfigMap = useStore($entityConfigMap);
  const selectedEntityConfig = entityType
    ? entityConfigMap[entityType]
    : currentSelectedEntityConfig;
  const coverageStats = entityType
    ? coverageStatsByEntity[entityType]
    : currentCoverageStats;
  const isLoading = useStore($isLoadingCountryAdminView);
  const legends = coverageStats?.connected_schools;
  const totalSchools = coverageStats?.total_schools ?? 0;
  const { selectedLayerData, selectedLayerDataByEntity } =
    useStore($layerUtils);
  const currentSelectedLayerData = entityType
    ? selectedLayerDataByEntity[entityType]
    : selectedLayerData;
  const legendsList = useMemo(() => Object.entries(legends || {}), [legends]);

  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayText, setDisplayText] = useState<{
    key: string;
    data?: Record<string, unknown>;
  }>({ key: '', data: {} });

  const isDataAvailable = legendsList.length;
  const entityLabel = t(selectedEntityConfig?.slug ?? 'schools');
  // this block of useEffect needs refactoring, all this logic should come from column config
  useEffect(() => {
    if (legendsList.length > 1) {
      const firstValue = legendsList[0] ? legendsList[0][1] : 0;
      const secondValue = legendsList[1] ? legendsList[1][1] : 0;
      const thirdValue = legendsList[2] ? legendsList[2][1] : 0;
      const fourthValue = legendsList[3] ? legendsList[3][1] : 0;
      const sum = firstValue + secondValue + thirdValue + fourthValue;
      setDisplayNumber(firstValue + secondValue + thirdValue);
      if (selectedEntityType === EntityType.SCHOOL) {
        setDisplayText({
          key: 'schools-with-coverage-schools-mapped',
          data: {
            totalSchools: formatNumber(sum, lng),
            totalSchoolsExact: t('int', { val: sum }),
            layerName: currentSelectedLayerData?.name,
          },
        });
      } else {
        setDisplayText({
          key: '',
          data: {
            totalSchools: formatNumber(sum, lng),
            layerName: currentSelectedLayerData?.name,
          },
        });
      }
    } else {
      setDisplayNumber(0);
      setDisplayText({ key: 'insufficient-data' });
    }
  }, [
    entityLabel,
    legendsList,
    selectedEntityType,
    currentSelectedLayerData?.name,
    totalSchools,
    lng,
  ]);

  return (
    <div className="flex! h-full! flex-col! justify-between! max-md:h-auto!">
      <div>
        <div className="mt-4! mb-3! ml-4! flex! items-center!">
          {isLoading ? (
            <Skeleton className="h-4! w-4/5!" />
          ) : (
            <div className="mr-0.5!">
              <p
                className={
                  isDataAvailable
                    ? 'my-2! text-[2.375rem]! font-normal! leading-none! text-success!'
                    : 'my-2! text-[2.375rem]! font-normal! leading-none! text-foreground!'
                }
                data-title={t('int', { val: displayNumber })}
              >
                {isDataAvailable ? formatNumber(displayNumber, lng) : ''}
              </p>
              <p className="my-2! text-xs! font-normal! leading-4! text-muted-foreground!">
                {displayText.key ? (
                  <Trans
                    i18nKey={displayText.key}
                    values={displayText.data}
                    components={[<span />]}
                  />
                ) : (
                  `${entityLabel} with ${currentSelectedLayerData?.name ?? t('coverage')} mapped`
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterDataSourcePopUp isFooter={false} />
    </div>
  );
};

export default CoverageLayer;
