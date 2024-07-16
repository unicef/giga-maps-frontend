import { Information } from '@carbon/icons-react'
import { AccordionItem, Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $selectedGigaLayers, $stylePaintData } from '~/@/map/map.model';
import { $isLoadingCountryAdminView, $potentialCoverageOpenStatus, changePotentialCoverageOpenStatus, $layerUtils, $coverageStats, $coverageStatusAll, onSelectSchoolStatusLayer, $layersList } from '~/@/sidebar/sidebar.model';
import { formatNumber } from '~/lib/utils';
import styled, { useTheme } from 'styled-components';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';

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
  const potentialCoverageOpenStatus = useStore($potentialCoverageOpenStatus);
  const coverageStats = useStore($coverageStats);
  const coverageStatusAll = useStore($coverageStatusAll) as Record<string, boolean>;
  const isLoading = useStore($isLoadingCountryAdminView);
  const lastSelelectedLayers = useStore($selectedGigaLayers)
  const legends = coverageStats?.connected_schools;
  const totalSchools = coverageStats?.total_schools || 0;
  const { selectedLayerId, coverageLayerId, currentLayerLegends, selectedLayerData } = useStore($layerUtils);
  const isCoverage = selectedLayerId === coverageLayerId;
  const legendsList = useMemo(() => Object.entries(legends || {}), [legends]);
  const allLayers = useStore($layersList)

  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const handleAccordionChange = useCallback(() => {
    changePotentialCoverageOpenStatus(!potentialCoverageOpenStatus);
  }, [potentialCoverageOpenStatus]);
  const styledPaintData = useStore($stylePaintData);
  const isDataAvailable = legendsList.length
  const theme = useTheme();
  // this block of useEffect needs refactoring, all this logic should come from column config
  useEffect(() => {
    if (selectedLayerId === coverageLayerId) {
      if (legendsList.length > 1) {
        const firstValue = legendsList[0] ? legendsList[0][1] : 0;
        const secondValue = legendsList[1] ? legendsList[1][1] : 0;
        setDisplayNumber(firstValue + secondValue);
        setDisplayText(`Schools with coverage data out of ${formatNumber(totalSchools)} schools mapped`);
      } else {
        setDisplayNumber(0);
        setDisplayText('Insufficient data');
      }
    } else {

      if (legendsList.length > 1) {
        const firstValue = legendsList[0] ? legendsList[0][1] : 0;
        const secondValue = legendsList[1] ? legendsList[1][1] : 0;
        const thirdValue = legendsList[2] ? legendsList[2][1] : 0;
        const fourthValue = legendsList[3] ? legendsList[3][1] : 0;
        const sum = firstValue + secondValue + thirdValue + fourthValue;
        setDisplayNumber(firstValue + secondValue + thirdValue);
        setDisplayText(`Schools with ${selectedLayerData?.name} data out of ${formatNumber(sum)} schools mapped`);
      } else {
        setDisplayNumber(0);
        setDisplayText('Insufficient data');
      }

    }
    // switch (selectedLayerId) {
    //   case 4:
    //     if (legendsList.length > 1) {
    //       const firstValue = legendsList[0] ? legendsList[0][1] : 0;
    //       const secondValue = legendsList[1] ? legendsList[1][1] : 0;
    //       setDisplayNumber(firstValue + secondValue);
    //       setDisplayText(`Schools with coverage data out of ${totalSchools} schools mapped`);
    //     } else {
    //       setDisplayNumber(0);
    //       setDisplayText('Insufficient data');
    //     }
    //     break;
    //   default:
    //     setDisplayNumber(0);
    //     setDisplayText('No data available');
    //     break;
    // }
  }, [selectedLayerId, legendsList, totalSchools]);

  return (
    <CoverageLayerContanier>
      <Div>
        <CurrentLayerNameIcon showFilter={false} label={selectedLayerData?.name} icon={selectedLayerData?.icon} />
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
      {/* <AccordionDistribution>
        <AccordionItem title={selectedLayerData?.description} open={potentialCoverageOpenStatus} onHeadingClick={handleAccordionChange}>
          {isLoading ? Object.entries(CoverageBenchMarks).map(([key]) => <ProgressBar key={key} isLoading />)
            :
            <>
              {legendsList.map(([key, value]) => {
                const label = isCoverage ? CoverageBenchmarkNames[key] : key;
                const type = isCoverage ? CoverageColorNames[key] : currentLayerLegends.reverseMapping[key];
                const colorType = styledPaintData[type];
                if (!(value > 0) || !coverageStatusAll[type]) return null;
                return <ProgressBar
                  key={key}
                  value={value}
                  maxValue={totalSchools}
                  label={label}
                  colorType={colorType}
                />
              })}
            </>
          }
        </AccordionItem>
      </AccordionDistribution > */}
      {/* <LayerSchoolsConnected /> */}
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </CoverageLayerContanier>
  )
}

export default CoverageLayer
