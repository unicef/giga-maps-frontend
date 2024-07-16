
import { useStore } from 'effector-react';

import { Div } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import { $schoolStats } from '~/@/sidebar/sidebar.model';

import { DateWeekWrapper } from '../../global-and-country-view-components/connectivity-layer/connectivity-layer.style';
import { SchoolInformation } from './school-information.view';
import { StatisticsStatusLg } from '../styles/school-information.style';
import { SchoolInformationWrapper } from '../styles/school-view-style';
import { getStaticSchoolDetails } from '~/@/sidebar/school-view.utils';

const SingleSchoolCoverageLayer = ({ schoolId }: { schoolId: number }) => {
  const schoolStats = useStore($schoolStats);
  const schoolDetails = schoolStats?.find((info) => info.id === schoolId) || null;
  const stylePaintData = useStore($stylePaintData);
  const { color, value } = getStaticSchoolDetails({ schoolDetails, stylePaintData })
  return (
    <>
      <div>
        <Div $margin='1.5rem 1rem 1.5rem 1rem'>
          {
            !!value && <DateWeekWrapper>
              <StatisticsStatusLg $color={color}>
                {value.toLowerCase()}
              </StatisticsStatusLg>
            </DateWeekWrapper>
          }
        </Div>
        <SchoolInformationWrapper>
          <SchoolInformation schoolData={schoolDetails} />
        </SchoolInformationWrapper>
      </div>
    </>
  );
}

export default SingleSchoolCoverageLayer
