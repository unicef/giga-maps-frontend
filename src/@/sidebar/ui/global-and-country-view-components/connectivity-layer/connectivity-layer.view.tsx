import { useStore } from 'effector-react';
import { useTheme } from 'styled-components';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $stylePaintData, $globalStats } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $connectivityStats, $isLoadingCountryAdminView, $selectedLayerData } from '~/@/sidebar/sidebar.model';
import { formatNumber } from '~/lib/utils';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import { HistoryGraphAccordian } from '../../common-components/history-graph';
import WeekSlider from '../common/week-slider/week-slider.view';
import { DateWeekWrapper } from './connectivity-layer.style';
import LiveAverage from './live-average.view';
import { UNKNOWN } from '~/@/map/map.types';

export default function ConnectivityLayer() {
  const { icon, global_benchmark } = useStore($selectedLayerData) ?? {};
  const connectivityStats = useStore($connectivityStats);
  const isLoading = useStore($isLoadingCountryAdminView);
  const theme = useTheme();
  const stylePaintData = useStore($stylePaintData);
  const globalStats = useStore($globalStats)
  const color = stylePaintData[connectivityStats?.live_avg_connectivity ?? UNKNOWN];
  const noOfSchoolsMeasure = connectivityStats?.no_of_schools_measure;

  return (
    <div>
      <CurrentLayerNameIcon isLiveLayer={true} label="Real-time Connectivity" />
      <Div $margin='1rem 1rem 0rem 1rem'>
        {isLoading ? <LoadingText width="80%" $marginEnd='2' /> : <Text $color={theme.titleDesc}>
          {`${formatNumber(noOfSchoolsMeasure)} schools with real-time connectivity data across ${formatNumber(globalStats.schools_connected)} schools mapped`}
        </Text>}

        <DateWeekWrapper>
          <LiveAverage isLoading={isLoading} color={color} icon={icon ?? ""} unit={global_benchmark?.convert_unit ?? ""} value={connectivityStats?.live_avg ?? 0} />
          <WeekSlider />
        </DateWeekWrapper>
      </Div>
      <HistoryGraphAccordian isLoading={isLoading} />
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </div>
  );
};

