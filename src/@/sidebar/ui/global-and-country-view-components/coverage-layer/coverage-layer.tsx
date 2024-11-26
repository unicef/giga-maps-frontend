import { useStore } from 'effector-react';
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import { $isLoadingCountryAdminView, $potentialCoverageOpenStatus, changePotentialCoverageOpenStatus, $layerUtils, $coverageStats } from '~/@/sidebar/sidebar.model';
import { formatNumber } from '~/lib/utils';
import styled, { useTheme } from 'styled-components';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { useTranslation } from 'react-i18next';

const CoverageLayerContanier = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  @media (max-width: 768px) {
    height: auto;
  }
`

const CoverageLayer = () => {
  const { t } = useTranslation();
  const coverageStats = useStore($coverageStats);
  const isLoading = useStore($isLoadingCountryAdminView);
  const legends = coverageStats?.connected_schools;
  const totalSchools = coverageStats?.total_schools ?? 0;
  const { selectedLayerId, coverageLayerId, selectedLayerData } = useStore($layerUtils);
  const legendsList = useMemo(() => Object.entries(legends || {}), [legends]);

  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const styledPaintData = useStore($stylePaintData);
  const isDataAvailable = legendsList.length
  const theme = useTheme();
  // this block of useEffect needs refactoring, all this logic should come from column config
  useEffect(() => {
    if (legendsList.length > 1) {
      const firstValue = legendsList[0] ? legendsList[0][1] : 0;
      const secondValue = legendsList[1] ? legendsList[1][1] : 0;
      const thirdValue = legendsList[2] ? legendsList[2][1] : 0;
      const fourthValue = legendsList[3] ? legendsList[3][1] : 0;
      const sum = firstValue + secondValue + thirdValue + fourthValue;
      setDisplayNumber(firstValue + secondValue + thirdValue);
      setDisplayText(t('schools-with-coverage-schools-mapped', { totalSchools: formatNumber(sum), layerName: selectedLayerData?.name }));
    } else {
      setDisplayNumber(0);
      setDisplayText('insufficient-data');
    }
  }, [legendsList, totalSchools]);

  return (
    <CoverageLayerContanier>
      <Div>
        <CurrentLayerNameIcon label={selectedLayerData?.name} icon={selectedLayerData?.icon} />
        <Div $margin={"1rem 0rem 0.75rem 1rem;"} $flex={"center"}>
          {isLoading ? <LoadingText width="80%" $marginEnd='0' /> :
            <Div>
              <Text $size={2.375} $color={isDataAvailable ? styledPaintData["good"] : theme.text}>
                {isDataAvailable ? formatNumber(displayNumber) : ""}
              </Text>
              <Text $color={theme.titleDesc}>
                {displayText}
              </Text>
            </Div>}
        </Div>
      </Div>
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </CoverageLayerContanier>
  )
}

export default CoverageLayer
