import { useStore } from 'effector-react';

import { Div, LoadingText } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import { $isLoadingSchoolView, $schoolStats } from '~/@/sidebar/sidebar.model';

import { DateWeekWrapper } from '../../global-and-country-view-components/connectivity-layer/connectivity-layer.style';
import { ConnectivityStatusNames } from '../../global-and-country-view-components/container/layer-view.constant';
import { StatisticsStatusLg } from '../styles/school-information.style';
import { SchoolInformationWrapper } from '../styles/school-view-style';
import { SchoolInformation } from './school-information.view';
import { useTranslation } from 'react-i18next';


const CommonUIOnlySchoolConnectivityLayer = ({ schoolId }: { schoolId: number }) => {
  const { t } = useTranslation();
  const SchoolStatsTypes = useStore($schoolStats);
  const schoolData = SchoolStatsTypes?.find((info) => info.id === schoolId);
  const connectivityStatus = schoolData?.connectivity_status ?? schoolData?.statistics?.connectivity_status ?? UNKNOWN
  const connectivityStatusColors = useStore($stylePaintData);
  const color = connectivityStatusColors[connectivityStatus];
  const isLoading = useStore($isLoadingSchoolView);

  return (
    <>
      <Div $margin='1.5rem 1rem 1.5rem 1rem'>
        <DateWeekWrapper>
          {isLoading ? <LoadingText width="70%" $blockSize='2.8' /> :
            <StatisticsStatusLg $color={color}>
              {t(ConnectivityStatusNames[connectivityStatus])}
            </StatisticsStatusLg >
          }
        </DateWeekWrapper >
      </Div >

      <SchoolInformationWrapper>
        <SchoolInformation schoolData={schoolData} />
      </SchoolInformationWrapper>
    </>
  )
}

export default CommonUIOnlySchoolConnectivityLayer;
