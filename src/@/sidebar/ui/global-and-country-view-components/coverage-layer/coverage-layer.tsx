import { useStore } from 'effector-react';
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $entityConfigMap, $selectedEntityConfig, $selectedEntityType } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $stylePaintData } from '~/@/map/map.model';
import { $isLoadingCountryAdminView, $layerUtils, $coverageStats, $coverageStatsByEntity } from '~/@/sidebar/sidebar.model';
import { formatNumber } from '~/lib/utils';
import styled, { useTheme } from 'styled-components';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { Trans, useTranslation } from 'react-i18next';
import { $lng } from '~/core/i18n/store';

const CoverageLayerContanier = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  @media (max-width: 768px) {
    height: auto;
  }
`

const CoverageLayer = ({ entityType }: { entityType?: EntityType }) => {
  const { t } = useTranslation();
  const lng = useStore($lng)
  const currentCoverageStats = useStore($coverageStats);
  const coverageStatsByEntity = useStore($coverageStatsByEntity);
  const currentSelectedEntityType = useStore($selectedEntityType);
  const selectedEntityType = entityType ?? currentSelectedEntityType;
  const currentSelectedEntityConfig = useStore($selectedEntityConfig);
  const entityConfigMap = useStore($entityConfigMap);
  const selectedEntityConfig = entityType ? entityConfigMap[entityType] : currentSelectedEntityConfig;
  const coverageStats = entityType ? coverageStatsByEntity[entityType] : currentCoverageStats;
  const isLoading = useStore($isLoadingCountryAdminView);
  const legends = coverageStats?.connected_schools;
  const totalSchools = coverageStats?.total_schools ?? 0;
  const { selectedLayerData, selectedLayerDataByEntity } = useStore($layerUtils);
  const currentSelectedLayerData = entityType ? selectedLayerDataByEntity[entityType] : selectedLayerData;
  const legendsList = useMemo(() => Object.entries(legends || {}), [legends]);

  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayText, setDisplayText] = useState<{ key: string, data?: Record<string, any> }>({ key: '', data: {} });

  const styledPaintData = useStore($stylePaintData);
  const isDataAvailable = legendsList.length
  const theme = useTheme();
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
        setDisplayText({ key: 'schools-with-coverage-schools-mapped', data: { totalSchools: formatNumber(sum, lng), totalSchoolsExact: t('int', { val: sum }), layerName: currentSelectedLayerData?.name } });
      } else {
        setDisplayText({ key: '', data: { totalSchools: formatNumber(sum, lng), layerName: currentSelectedLayerData?.name } });
      }
    } else {
      setDisplayNumber(0);
      setDisplayText({ key: 'insufficient-data' });
    }
  }, [entityLabel, legendsList, selectedEntityType, currentSelectedLayerData?.name, totalSchools, lng]);

  return (
    <CoverageLayerContanier>
      <Div>
        {/* <CurrentLayerNameIcon label={currentSelectedLayerData?.name} icon={currentSelectedLayerData?.icon} /> */}
        <Div $margin={"1rem 0rem 0.75rem 1rem;"} $flex={"center"}>
          {isLoading ? <LoadingText width="80%" $marginEnd='0' /> :
            <Div $margin='0rem 0.2rem 0 0'>
              <Text data-title={t('int', { val: displayNumber })} $size={2.375} $color={isDataAvailable ? styledPaintData["good"] : theme.text}>
                {isDataAvailable ? formatNumber(displayNumber, lng) : ""}
              </Text>
              <Text $color={theme.titleDesc}>
                {displayText.key ? (
                  <Trans i18nKey={displayText.key}
                    values={displayText.data}
                    components={[<span />]}
                  />
                ) : (
                  `${entityLabel} with ${currentSelectedLayerData?.name ?? t('coverage')} mapped`
                )}
              </Text>
            </Div>}
        </Div>
      </Div>
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </CoverageLayerContanier>
  )
}

export default CoverageLayer
