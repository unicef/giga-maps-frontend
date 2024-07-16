import { useStore } from 'effector-react';

import { LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $globalStats, $stylePaintData } from '~/@/map/map.model';
import { $isLoadingCountryAdminView } from '~/@/sidebar/sidebar.model';
import { mapSchools } from '~/core/routes';
import { useRoute } from '~/lib/router';
import { formatNumber } from '~/lib/utils';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import LayerSchoolsConnectivityStatus from '../layer-schools-connectivity-accordion';
import { SchoolInfoSection } from '../styles/layer-view-common.style';
import styled, { useTheme } from 'styled-components';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';

const SchoolConnectivityLayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  @media (max-width: 768px) {
    height: auto;
  }
`

const SchoolConnectivityLayer = () => {
  const globalStats = useStore($globalStats);
  const isLoading = useStore($isLoadingCountryAdminView);
  const schoolView = useRoute(mapSchools);
  const stylePaintData = useStore($stylePaintData);
  const connectedNumber = formatNumber(globalStats?.connected_schools?.connected || 0);
  const totalMappedNumber = formatNumber(globalStats?.schools_connected || 0);
  const isConnected = globalStats?.connected_schools?.connected > 0;
  const theme = useTheme();
  return (
    <SchoolConnectivityLayerContainer>
      <div>
        <CurrentLayerNameIcon showFilter={false} label='Connectivity status' isSchoolStatus={true} />
        {!schoolView && <SchoolInfoSection>
          {isLoading ? <>  <LoadingText $blockSize='3.5625' width="4rem" />
            <LoadingText $blockSize='0.5' />
          </> : <>
            <Text $size={2.375} $color={isConnected ? stylePaintData.connected : theme.text}>
              {isConnected ? connectedNumber : totalMappedNumber}
            </Text>
            <Text $color={theme.titleDesc}>
              {isConnected ? `Connected schools for ${totalMappedNumber} ` : ''}schools mapped
            </Text>
          </>}
        </SchoolInfoSection>}
      </div>
      <FooterDataSourcePopUp showOldDataSource={true} size={25} isFooter={false} />
      {/* <LayerSchoolsConnectivityStatus /> */}

    </SchoolConnectivityLayerContainer>
  )
}

export default SchoolConnectivityLayer;
