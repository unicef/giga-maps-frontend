import { Account } from '@carbon/icons-react'
import { AccordionItem } from '@carbon/react';
import { useStore } from 'effector-react';
import { useCallback, useEffect } from 'react'
import styled from 'styled-components';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { Colors } from '~/@/map/map.constant';
import { $globalStats, $schoolConnectedOpenStatus, $stylePaintData, changeSchoolConnectedOpenStatus } from '~/@/map/map.model';
import { ConnectivityStatusDistribution, SCHOOL_STATUS_LAYER } from '~/@/sidebar/sidebar.constant';
import { $allLoadings, $currentLayerTypeUtils, $schoolStatusSelectedLayer, $staticLegendsSelected, onSelectSchoolStatusLayer, staticLegendsSelection } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { formatNumber } from '~/lib/utils';

import ProgressBar from '../../common-components/progress-bar/progress-bar.view';
import { AccordionDistribution, HashtagIcon } from '../../sidebar.style';
import { AccordionItemTitle } from '../common/accordion-item-title.view';
import { ConnectivityStatusNames } from '../container/layer-view.constant';

const SchoolConntectivtyWrapper = styled.div`
  margin-top: 1rem;
  position: fixed;
  bottom: 7rem;
  width: 273px;
  margin:0.5rem 0.5rem;
  background: ${props => props.theme.schoolListBack};
  z-index: 2; 
  .cds--accordion__content {
    padding: 0rem 1rem 1rem 1rem;
  }
  @media (max-width: 768px) {
    width: 100%;
    margin:0;
    margin-bottom:0.5rem;
    bottom: 5rem;
  }

  @media only screen and (min-width: 1584px) {
    width: 280px;
  }
`
const AccordionTitle = styled.div`
display: flex;
align-items: center;
p{
  color:  ${props => props.theme.text};
font-family: Open Sans;
font-size: 0.875rem;
font-weight: 500;
line-height: 1.25rem; 
letter-spacing: 0.01rem;
margin-left:0.5rem;
margin-right:0.5rem;
}
`

const AccordionTitleWrapper = () => (
  <AccordionItemTitle tooltipLabel={'School status'} label={<AccordionTitle>
    <Account />
    <p>
      School status
    </p>
  </AccordionTitle>}
  />
);

const LayerSchoolsConnectivityStatus = () => {
  const isMobile = useStore($isMobile)
  const globalstats = useStore($globalStats);
  const { stats, country } = useStore($allLoadings);
  const isLoading = stats || country;
  const schoolConnectedOpenStatus = useStore($schoolConnectedOpenStatus);
  const { isSchoolStatus } = useStore($currentLayerTypeUtils);
  const staticLegends = useStore($staticLegendsSelected);
  const connectivityStatusColor = useStore($stylePaintData);
  const schoolStatusSelected = useStore($schoolStatusSelectedLayer)
  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;
  const handleAccordionChange = useCallback(() => {
    changeSchoolConnectedOpenStatus(!schoolConnectedOpenStatus)
  }, [schoolConnectedOpenStatus]);

  const handleClicked = (buttonId: string) => {
    if (!schoolStatusSelected && buttonId) {
      onSelectSchoolStatusLayer(SCHOOL_STATUS_LAYER.id)
    }
    if (!isSchoolStatus) {
      staticLegendsSelection([buttonId])
    } else {
      staticLegendsSelection(buttonId);
    }
  }

  useEffect(() => {
    if (isMobile) {
      changeSchoolConnectedOpenStatus(false)
    }
  }, [])

  return (<>
    <SchoolConntectivtyWrapper className="connectivity-status-container">
      <AccordionDistribution>
        <AccordionItem
          title={<AccordionTitleWrapper />}
          open={schoolConnectedOpenStatus}
          onHeadingClick={handleAccordionChange} >
          <>
            <Div $margin={"0 0 0.75rem 0"}>
              {isLoading ? <LoadingText width="80%" /> :
                <Text $size={0.75} $color="#9E9E9E"><HashtagIcon size={12} />{`${formatNumber(globalstats?.schools_connected ? globalstats?.schools_connected : 0)} schools mapped`}</Text>
              }
            </Div>
            <ProgressBar
              isLoading={isLoading}
              value={globalstats?.connected_schools?.connected}
              maxValue={globalstats?.schools_connected}
              label={ConnectivityStatusNames[connected]}
              toggleProps={{
                id: `${connected}_id`,
                onToggle: () => handleClicked(connected),
                toggled: !!(staticLegends.includes(connected) && isSchoolStatus)
              }}
              colorType={connectivityStatusColor[connected]}
              backColor={Colors.LIGHT_GREEN}
            />

            <ProgressBar
              isLoading={isLoading}
              value={globalstats?.connected_schools?.not_connected}
              maxValue={globalstats?.schools_connected}
              label={ConnectivityStatusNames[notConnected]}
              toggleProps={{
                id: `${notConnected}_id`,
                onToggle: () => handleClicked(notConnected),
                toggled: !!(staticLegends.includes(notConnected) && isSchoolStatus)
              }}
              colorType={connectivityStatusColor[notConnected]}
              backColor={Colors.LIGHT_RED}
            />
            <ProgressBar
              isLoading={isLoading}
              value={globalstats?.connected_schools?.unknown}
              maxValue={globalstats?.schools_connected}
              label={ConnectivityStatusNames[unknown]}
              toggleProps={{
                id: `${unknown}_id`,
                onToggle: () => handleClicked(unknown),
                toggled: !!(staticLegends.includes(unknown) && isSchoolStatus)
              }}
              colorType={connectivityStatusColor[unknown]}
              backColor={Colors.LIGHT_BLUE}
            />
          </>
        </AccordionItem>
      </AccordionDistribution>
    </SchoolConntectivtyWrapper>
  </>
  )
}


export default LayerSchoolsConnectivityStatus
