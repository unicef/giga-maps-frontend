import { useStore } from 'effector-react';
import { useTheme } from 'styled-components';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $entityConfigMap, $selectedEntityConfig, $selectedEntityType } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $stylePaintData, $globalStats } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $connectivityStats, $connectivityStatsByEntity, $isLoadingCountryAdminView, $selectedLayerData, $selectedLayerDataByEntity } from '~/@/sidebar/sidebar.model';
import { formatNumber } from '~/lib/utils';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import { HistoryGraphAccordian } from '../../common-components/history-graph';
import WeekSlider from '../common/week-slider/week-slider.view';
import { DateWeekWrapper } from './connectivity-layer.style';
import LiveAverage from './live-average.view';
import { UNKNOWN } from '~/@/map/map.types';
import { useTranslation } from 'react-i18next';
import { $lng } from '~/core/i18n/store';
import { Trans } from "react-i18next";

export default function ConnectivityLayer({ entityType }: { entityType?: EntityType }) {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = useStore($selectedLayerData);
  const currentSelectedEntityType = useStore($selectedEntityType);
  const selectedEntityType = entityType ?? currentSelectedEntityType;
  const entityConfigMap = useStore($entityConfigMap);
  const currentSelectedEntityConfig = useStore($selectedEntityConfig);
  const selectedEntityConfig = entityType ? entityConfigMap[entityType] : currentSelectedEntityConfig;
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const currentConnectivityStats = useStore($connectivityStats);
  const connectivityStats = entityType ? connectivityStatsByEntity[entityType] : currentConnectivityStats;
  const isLoading = useStore($isLoadingCountryAdminView);
  const theme = useTheme();
  const stylePaintData = useStore($stylePaintData);
  const globalStats = useStore($globalStats)
  const currentLayerData = entityType ? selectedLayerDataByEntity[entityType] : selectedLayerData;
  const color = stylePaintData[connectivityStats?.live_avg_connectivity ?? UNKNOWN];
  const noOfSchoolsMeasure = (connectivityStats as any)?.no_of_schools_measure ?? (connectivityStats as any)?.no_of_entities_measure ?? 0;
  const entityLabel = t(selectedEntityConfig?.slug ?? 'schools');

  return (
    <div>
      {/* <CurrentLayerNameIcon isLiveLayer={true} label={t("real-time-connectivity")} /> */}
      <Div $margin='0rem 1rem 0rem 1rem'>
        {/* {isLoading ? <LoadingText width="80%" $marginEnd='2' /> : <Text $color={theme.titleDesc}>
          {selectedEntityType === EntityType.SCHOOL ? (
            <Trans i18nKey="schools-with-real-time-mapped"
              count={noOfSchoolsMeasure}
              values={{ schoolCount: formatNumber(noOfSchoolsMeasure, lng), globalCount: formatNumber(globalStats.schools_connected, lng), schoolCountExact: t('int', { val: noOfSchoolsMeasure }), globalCountExact: t('int', { val: globalStats.schools_connected }) }}
              components={[<span />]}
            />
          ) : (
            `${formatNumber(noOfSchoolsMeasure, lng)} ${entityLabel} reporting internet quality`
          )}
        </Text>} */}
        <DateWeekWrapper>
          <LiveAverage isLoading={isLoading} color={color} currentLayerData={currentLayerData} value={connectivityStats?.live_avg ?? 0} />
          <WeekSlider />
        </DateWeekWrapper>
      </Div>
      <HistoryGraphAccordian isLoading={isLoading} />
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </div>
  );
};

