import { useStore } from 'effector-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $entityConfigMap } from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  $coverageStatsByEntity,
  $isLoadingCountryAdminView,
  $layerUtils,
} from '~/@/sidebar/sidebar.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

import LayerNameWithTooltip from '../common/layer-name-with-tooltip.view';

const CoverageLayer = ({ entityType }: { entityType: EntityType }) => {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const coverageStatsByEntity = useStore($coverageStatsByEntity);
  const entityConfigMap = useStore($entityConfigMap);
  const entityConfig = entityConfigMap[entityType];
  const coverageStats = coverageStatsByEntity[entityType];
  const isLoading = useStore($isLoadingCountryAdminView);
  const coverageDistribution = coverageStats?.connected_schools;
  const { selectedLayerDataByEntity } =
    useStore($layerUtils);
  const currentSelectedLayerData = selectedLayerDataByEntity[entityType];
  const legendsList = useMemo(
    () => Object.entries(coverageDistribution || {}),
    [coverageDistribution],
  );
  const layerName = currentSelectedLayerData?.name ?? t('cellular-coverage');
  const layerDescription = currentSelectedLayerData?.description;

  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const isDataAvailable = legendsList.length;
  const entityLabel = t(entityConfig?.slug ?? entityType, {
    count: 2,
  });
  // this block of useEffect needs refactoring, all this logic should come from column config
  useEffect(() => {
    if (legendsList.length > 1) {
      const firstValue = legendsList[0] ? legendsList[0][1] : 0;
      const secondValue = legendsList[1] ? legendsList[1][1] : 0;
      const thirdValue = legendsList[2] ? legendsList[2][1] : 0;
      const fourthValue = legendsList[3] ? legendsList[3][1] : 0;
      const sum = firstValue + secondValue + thirdValue + fourthValue;
      setDisplayNumber(firstValue + secondValue + thirdValue);
      setDisplayText(
        `${entityLabel} with ${layerName} data out of ${formatNumber(
          sum,
          lng,
        )} ${entityLabel} mapped`,
      );
    } else {
      setDisplayNumber(0);
      setDisplayText(t('insufficient-data'));
    }
  }, [entityLabel, legendsList, layerName, lng, t]);

  return (
    <div className="mx-4! py-4! flex! flex-col! justify-start! items-start! gap-6! h-full! max-md:h-auto!">
      <div className="self-stretch! flex! flex-col! justify-start! items-start! gap-4! min-h-[10.5rem]! max-h-[18.5rem]! h-[24vh]!">
        <LayerNameWithTooltip
          description={layerDescription}
          name={layerName}
        />
        {isLoading ? (
          <div className="self-stretch! flex! flex-col! gap-2!">
            <Skeleton className="h-10! w-24!" />
            <Skeleton className="h-4! w-full!" />
          </div>
        ) : (
          <div className="self-stretch! flex! flex-col! justify-start! items-start! gap-2!">
            <p
              className={
                isDataAvailable
                  ? 'm-0! text-3xl! font-normal! leading-9! text-success!'
                  : 'm-0! text-3xl! font-normal! leading-9! text-foreground!'
              }
              data-title={t('int', { val: displayNumber })}
            >
              {isDataAvailable ? formatNumber(displayNumber, lng) : ''}
            </p>
            <p className="m-0! text-xs! font-normal! leading-4! text-muted-foreground!">
              {displayText}
            </p>
          </div>
        )}
      </div>
      <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
    </div>
  );
};

export default CoverageLayer;
