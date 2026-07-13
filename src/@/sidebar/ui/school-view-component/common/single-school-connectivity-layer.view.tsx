import { useStore } from 'effector-react';

import { Div } from '~/@/common/style/styled-component-style';
import type { EntityType } from '~/@/entities';
import { $stylePaintData } from '~/@/map/map.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { getLiveSchoolDetails } from '~/@/sidebar/school-view.utils';
import {
  $isLoadingSchoolView,
  $schoolStats,
  $selectedLayerDataByEntity,
} from '~/@/sidebar/sidebar.model';

import { HistoryGraphAccordian } from '../../common-components/history-graph';
import WeekSlider from '../../global-and-country-view-components/common/week-slider/week-slider.view';
import LiveAverage from '../../global-and-country-view-components/connectivity-layer/live-average.view';
import { SchoolInformationWrapper } from '../styles/school-view-style';
import CommonUIOnlySchoolConnectivityLayer from './common-ui-only-school-connectivity-layer';
import { SchoolInformation } from './school-information.view';

const SingleSchoolConnectivityLayer = ({
  entityType,
  schoolId,
}: {
  entityType: EntityType;
  schoolId?: number;
}) => {
  const isLoading = useStore($isLoadingSchoolView);
  const SchoolStatsTypes = useStore($schoolStats);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const { global_benchmark: globalBenchmark, icon } =
    selectedLayerDataByEntity[entityType] ?? {};
  const schoolDetails = SchoolStatsTypes?.find((info) => info.id === schoolId);
  const stylePaintData = useStore($stylePaintData);
  const { value, color } = getLiveSchoolDetails({
    schoolDetails,
    stylePaintData,
  });

  if (!schoolDetails?.is_rt_connected && schoolId) {
    return <CommonUIOnlySchoolConnectivityLayer schoolId={schoolId} />;
  }

  return (
    <div>
      <Div $margin="0 1rem 0rem 1rem">
        <div className="relative! flex! w-full! flex-col! pt-3! pb-6! [&>p]:pt-[0.56rem]! [&>p]:pb-4! gap-3!">
          <LiveAverage
            isLoading={isLoading}
            icon={icon ?? ''}
            color={color}
            unit={globalBenchmark?.convert_unit ?? ''}
            value={value}
          />
          <WeekSlider entityType={entityType} />
        </div>
      </Div>
      {schoolDetails && (
        <HistoryGraphAccordian
          schoolData={schoolDetails}
          entityType={entityType}
          isLoading={isLoading}
        />
      )}

      <SchoolInformationWrapper>
        <SchoolInformation schoolData={schoolDetails} />
      </SchoolInformationWrapper>
      <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
    </div>
  );
};

export default SingleSchoolConnectivityLayer;
