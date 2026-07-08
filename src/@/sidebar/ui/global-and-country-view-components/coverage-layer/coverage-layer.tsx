import { useStore } from 'effector-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $entityConfigMap,
  $selectedEntityConfig,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
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

const CoverageLayer = ({ entityType }: { entityType?: EntityType }) => {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const coverageStatsByEntity = useStore($coverageStatsByEntity);
  const currentSelectedEntityType = useStore($selectedEntityType);
  const selectedEntityType = entityType ?? currentSelectedEntityType;
  const currentSelectedEntityConfig = useStore($selectedEntityConfig);
  const entityConfigMap = useStore($entityConfigMap);
  const selectedEntityConfig = entityType
    ? entityConfigMap[entityType]
    : currentSelectedEntityConfig;
  const coverageStats = coverageStatsByEntity[selectedEntityType];
  const isLoading = useStore($isLoadingCountryAdminView);
  const coverageDistribution = coverageStats?.connected_schools;
  const { selectedLayerData, selectedLayerDataByEntity } =
    useStore($layerUtils);
  const currentSelectedLayerData = entityType
    ? selectedLayerDataByEntity[entityType]
    : selectedLayerData;
  const legendsList = useMemo(
    () => Object.entries(coverageDistribution || {}),
    [coverageDistribution],
  );
  const layerName = currentSelectedLayerData?.name ?? t('cellular-coverage');
  const layerDescription = currentSelectedLayerData?.description;

  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const isDataAvailable = legendsList.length;
  const entityLabel = t(selectedEntityConfig?.slug ?? selectedEntityType, {
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
    <div className="flex! h-full! flex-col! justify-between! max-md:h-auto!">
      <div>
        <div className="mt-4! mb-3! ml-4!">
          <LayerNameWithTooltip
            description={layerDescription}
            name={layerName}
          />
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
                {displayText}
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
