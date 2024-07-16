import { Information } from '@carbon/icons-react'
import { Tooltip } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { useTheme } from 'styled-components';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $selectedGigaLayers, $stylePaintData } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $connectivityStats, $isLoadingCountryAdminView, $selectedLayerData, onSelectMainLayer, onSelectSchoolStatusLayer } from '~/@/sidebar/sidebar.model';
import { formatNumber } from '~/lib/utils';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import { HistoryGraphAccordian } from '../../common-components/history-graph';
import WeekSlider from '../common/week-slider/week-slider.view';
import { DateWeekWrapper } from './connectivity-layer.style';
import { $globalStats } from '~/@/map/map.model';
import LiveAverage from './live-average.view';
import { UNKNOWN } from '~/@/map/map.types';

export default function ConnectivityLayer() {
  const { icon, global_benchmark } = useStore($selectedLayerData) ?? {};
  const connectivityStats = useStore($connectivityStats);
  const lastSelelectedLayers = useStore($selectedGigaLayers)
  const isLoading = useStore($isLoadingCountryAdminView);
  const theme = useTheme();
  const stylePaintData = useStore($stylePaintData);
  const globalStats = useStore($globalStats)
  const color = stylePaintData[connectivityStats?.live_avg_connectivity ?? UNKNOWN];
  const noOfSchoolsMeasure = connectivityStats?.no_of_schools_measure;

  // useEffect(() => {
  //   if (!isLoading && connectivityStats && !connectivityStats.is_data_synced && !!lastSelelectedLayers.layerId) {
  //     onSelectMainLayer(null);
  //   }
  // }, [isLoading, connectivityStats, lastSelelectedLayers])
  return (
    <div>
      <CurrentLayerNameIcon isLiveLayer={true} label="Real-time Connectivity" />
      <Div $margin='1rem 1rem 0rem 1rem'>
        {isLoading ? <LoadingText width="80%" $marginEnd='2' /> : <Text $color={theme.titleDesc}>
          {/* <HashtagIcon size={12} /> */}
          {`${formatNumber(noOfSchoolsMeasure)} schools with real-time connectivity data across ${formatNumber(globalStats.schools_connected)} schools mapped`}
          {/* <Tooltip align="bottom-right" className='info-icon' label={'schools with real-time data'}>
            <button className="sb-tooltip-trigger" type="button">
              <Information />
            </button>
          </Tooltip> */}
        </Text>}

        <DateWeekWrapper>
          <LiveAverage isLoading={isLoading} color={color} icon={icon ?? ""} unit={global_benchmark?.convert_unit ?? ""} value={connectivityStats?.live_avg ?? 0} />
          <WeekSlider />
        </DateWeekWrapper>
      </Div>
      {/* <AccordionDistribution>
        <LayerRealtimeConnectedSchools isLoading={isLoading} />
      </AccordionDistribution> */}
      <HistoryGraphAccordian isLoading={isLoading} />
      <FooterDataSourcePopUp size={25} isFooter={false} />
      {/* <LayerSchoolsConnectivityStatus /> */}
    </div>
  );
};

