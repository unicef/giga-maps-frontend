import { useStore } from 'effector-react';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $globalStats, $stylePaintData } from '~/@/map/map.model';
import { $isLoadingCountryAdminView } from '~/@/sidebar/sidebar.model';
import { mapSchools } from '~/core/routes';
import { useRoute } from '~/lib/router';
import { formatNumber } from '~/lib/utils';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import { SchoolInfoSection } from '../styles/layer-view-common.style';
import styled, { useTheme } from 'styled-components';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $lng } from '~/core/i18n/store';
import { useTranslation } from 'react-i18next';

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
  const lng = useStore($lng)
  const { t } = useTranslation();
  const globalStats = useStore($globalStats);
  const isLoading = useStore($isLoadingCountryAdminView);
  const schoolView = useRoute(mapSchools);
  const stylePaintData = useStore($stylePaintData);
  const connectedNumber = formatNumber(globalStats?.connected_schools?.connected || 0, lng);
  const totalMappedNumber = formatNumber(globalStats?.schools_connected || 0, lng);
  const isConnected = globalStats?.connected_schools?.connected > 0;
  const theme = useTheme();
  return (
    <SchoolConnectivityLayerContainer>
      <div>
        <CurrentLayerNameIcon showFilter={false} label={t("connectivity-status")} isSchoolStatus={true} />
        {!schoolView && <SchoolInfoSection>
          {isLoading ? <>  <LoadingText $blockSize='3.5625' width="4rem" />
            <LoadingText $blockSize='0.5' />
          </> : <Div $margin='0rem 1rem 0rem 0rem'>
            <Text $size={2.375} $color={isConnected ? stylePaintData.connected : theme.text}>
              {isConnected ? connectedNumber : totalMappedNumber}
            </Text>
            <Text $color={theme.titleDesc}>
              {isConnected ? `${t("connected-schools-for-total-mapped-number", { count: Number(totalMappedNumber) })} ` : ''}{t('schools-mapped')}
            </Text>
          </Div>}
        </SchoolInfoSection>}
      </div>
      <FooterDataSourcePopUp showOldDataSource={true} size={25} isFooter={false} />
      {/* <LayerSchoolsConnectivityStatus /> */}

    </SchoolConnectivityLayerContainer>
  )
}

export default SchoolConnectivityLayer;
