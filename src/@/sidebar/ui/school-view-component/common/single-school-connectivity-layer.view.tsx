import { Information } from '@carbon/icons-react'
import { Link, Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { useState } from 'react';

import { DataSourceTableWrapper } from '~/@/admin/ui/styles/admin-styles';
import { Div } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { getLiveSchoolDetails } from '~/@/sidebar/school-view.utils';
import { $isLoadingCountryAdminView, $isLoadingSchoolView, $schoolStats, $selectedLayerData } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';

import ClickAnywhere from '../../common-components/click-anywhere';
import { HistoryGraphAccordian } from '../../common-components/history-graph';
import WeekSlider from '../../global-and-country-view-components/common/week-slider/week-slider.view';
import { DateWeekWrapper } from '../../global-and-country-view-components/connectivity-layer/connectivity-layer.style';
import LiveAverage from '../../global-and-country-view-components/connectivity-layer/live-average.view';
import { SchoolInformationWrapper } from '../styles/school-view-style';
import { SchoolInformation } from './school-information.view';

const SingleSchoolConnectivityLayer = ({ schoolId }: { schoolId?: number }) => {
  const isLoading = useStore($isLoadingSchoolView);
  const SchoolStatsTypes = useStore($schoolStats);
  const { global_benchmark, icon } = useStore($selectedLayerData) ?? {};
  const schoolDetails = SchoolStatsTypes?.find((info) => info.id === schoolId);
  const stylePaintData = useStore($stylePaintData);
  const { value, color } = getLiveSchoolDetails({ schoolDetails, stylePaintData })
  const [openDataSourcePopup, setDataSourcePopup] = useState(false)
  return (<>
    <div>
      <Div $margin='0 1rem 0rem 1rem'>
        <DateWeekWrapper>
          <LiveAverage isLoading={isLoading} icon={icon ?? ""} color={color} unit={global_benchmark?.convert_unit ?? ""} value={value} />
          <WeekSlider />
        </DateWeekWrapper>
      </Div>
      {schoolDetails && <HistoryGraphAccordian schoolData={schoolDetails} isLoading={isLoading} />}

      <SchoolInformationWrapper>
        <SchoolInformation schoolData={schoolDetails} />
      </SchoolInformationWrapper>
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </div>
  </>
  );
}

export default SingleSchoolConnectivityLayer;
