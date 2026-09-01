import { useStore } from 'effector-react';

import { Div } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import { getStaticSchoolDetails } from '~/@/sidebar/school-view.utils';
import { $schoolStats } from '~/@/sidebar/sidebar.model';

import { StatisticsStatusLg } from '../styles/school-information.style';
import { SchoolInformationWrapper } from '../styles/school-view-style';
import SidebarDublicateSchoolList from './dublicate-school-list-view';
import { SchoolInformation } from './school-information.view';

const SingleSchoolCoverageLayer = ({ schoolId }: { schoolId: number }) => {
  const schoolStats = useStore($schoolStats);
  const schoolDetails =
    schoolStats?.find((info) => info.id === schoolId) ?? null;
  const stylePaintData = useStore($stylePaintData);
  const { color, value } = getStaticSchoolDetails({
    schoolDetails,
    stylePaintData,
  });
  return (
    <div>
      <Div $margin="1.5rem 1rem 1.5rem 1rem">
        {!!value && (
          <div className="relative! flex! w-full! flex-col! pt-3! pb-6! [&>p]:pt-[0.56rem]! [&>p]:pb-4!">
            <StatisticsStatusLg $color={color}>
              {value === 'true' ? 'Yes' : value === 'false' ? 'No' : value}
            </StatisticsStatusLg>
          </div>
        )}
      </Div>
      <SchoolInformationWrapper>
        <SchoolInformation schoolData={schoolDetails} />
      </SchoolInformationWrapper>
      <SidebarDublicateSchoolList scrollableTargetId="school-sidebar-scroll" />
    </div>
  );
};

export default SingleSchoolCoverageLayer;
