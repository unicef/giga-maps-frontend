import { useStore } from 'effector-react';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $entityConfigMap, $selectedEntityConfig, $selectedEntityType } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStats, $globalStatsByEntity, $stylePaintData } from '~/@/map/map.model';
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

const SchoolConnectivityLayer = ({ entityType }: { entityType?: EntityType }) => {
  const lng = useStore($lng)
  const { t } = useTranslation();
  const globalStats = useStore($globalStats);
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const currentSelectedEntityType = useStore($selectedEntityType);
  const selectedEntityType = entityType ?? currentSelectedEntityType;
  const currentSelectedEntityConfig = useStore($selectedEntityConfig);
  const entityConfigMap = useStore($entityConfigMap);
  const selectedEntityConfig = entityType ? entityConfigMap[entityType] : currentSelectedEntityConfig;
  const selectedEntityGlobalStats = globalStatsByEntity[selectedEntityType];
  const isLoading = useStore($isLoadingCountryAdminView);
  const schoolView = useRoute(mapSchools);
  const stylePaintData = useStore($stylePaintData);
  const connectedValue = selectedEntityGlobalStats?.connected_entities?.connected ?? globalStats?.connected_schools?.connected ?? 0;
  const totalMappedValue = selectedEntityGlobalStats?.entities_connected ?? selectedEntityGlobalStats?.entities_total ?? globalStats?.schools_connected ?? 0;
  const connectedNumber = formatNumber(connectedValue, lng);
  const totalMappedNumber = formatNumber(totalMappedValue, lng);
  const isConnected = connectedValue > 0;
  const theme = useTheme();
  const entityLabel = t(selectedEntityConfig?.slug ?? 'schools');
  return (
    <SchoolConnectivityLayerContainer>
      <div>
        {/* <CurrentLayerNameIcon showFilter={false} label={t("connectivity-status")} isSchoolStatus={true} /> */}
        {!schoolView && <SchoolInfoSection>
          {isLoading ? <>  <LoadingText $blockSize='3.5625' width="4rem" />
            <LoadingText $blockSize='0.5' />
          </> : <Div $margin='0rem 1rem 0rem 0rem'>
            <Text data-title={t('int', { val: (isConnected ? connectedValue : totalMappedValue) ?? 0 })} $size={2.375} $color={isConnected ? stylePaintData.connected : theme.text}>
              {isConnected ? connectedNumber : totalMappedNumber}
            </Text>
            <Text $color={theme.titleDesc}>
              {selectedEntityType === EntityType.SCHOOL
                ? `${isConnected ? `${t("connected-schools-for-total-mapped-number", { count: totalMappedValue, total: totalMappedNumber })} ` : ''}${t('schools-mapped')}`
                : `${isConnected ? `${t('connected')} ${entityLabel} / ${totalMappedNumber} ` : ''}${entityLabel} mapped`}
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
