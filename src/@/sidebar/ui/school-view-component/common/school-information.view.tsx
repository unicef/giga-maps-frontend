
import { ConnectionSignal, Hashtag, Information, Location } from '@carbon/icons-react'
import { useStore } from 'effector-react';

import { Div, LoadingText, TooltipStyle } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import { getSchoolStatus } from '~/@/sidebar/school-view.utils';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { SchoolStatsType } from '~/api/types';

import { ConnectivityStatusNames } from '../../global-and-country-view-components/container/layer-view.constant';
import { StatisticsStatus } from '../styles/school-information.style';
import { SchoolDetailInfo, SchoolDetailItem, SchoolDetailTitle, SingleInfoContainer } from '../styles/school-view-style';
import { $country } from '~/@/country/country.model';
import { $isLoadingSchoolView } from '~/@/sidebar/sidebar.model';


const SchoolInformation = ({ schoolData }: { schoolData?: SchoolStatsType }) => {
  const isLoading = useStore($isLoadingSchoolView);
  const stylePaintData = useStore($stylePaintData);
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({ schoolDetails: schoolData, stylePaintData });
  if (isLoading) {
    return <Div>
      <LoadingText width="40%" $blockSize='1' />
      <SchoolDetailInfo>
        {Array(6).fill(0).map((_, key) =>
          <SchoolDetailItem key={key}>
            <LoadingText width="90%" $blockSize='1' />
            <LoadingText width="70%" $blockSize='1' />
          </SchoolDetailItem>
        )}
      </SchoolDetailInfo>
    </Div>
  }
  const schoolCoordinates = (JSON.parse(JSON.stringify(schoolData?.geopoint?.coordinates ?? []))).reverse();

  if (!schoolData) return null;
  return (
    <>
      <SchoolDetailTitle>
        School Details
        <TooltipStyle align="top" label={'School details'}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </TooltipStyle>
      </SchoolDetailTitle>
      <SingleInfoContainer $width={true}  >
        <Location />
        <p title={schoolCoordinates.join(', ')}>{schoolCoordinates.join(', ')}</p>
      </SingleInfoContainer>
      <SingleInfoContainer $width={true} >
        <ConnectionSignal />
        <StatisticsStatus $color={connectivityStatusColor}>
          {ConnectivityStatusNames[connectivityStatus]}
        </StatisticsStatus>
      </SingleInfoContainer>
      {!!schoolData?.giga_id_school && <SingleInfoContainer $width={true} >
        <Hashtag />
        <p>Giga id: <span className="lowercase">{schoolData?.giga_id_school}</span></p>
      </SingleInfoContainer>}
      {schoolData?.admin1_name && <SingleInfoContainer $width={true} >
        <Hashtag />
        <p>{schoolData?.admin1_description_ui_label}: {schoolData?.admin1_name}</p>
      </SingleInfoContainer>}
      {schoolData?.admin2_name && <SingleInfoContainer $width={true} >
        <Hashtag />
        <p>{schoolData?.admin2_description_ui_label}: {schoolData?.admin2_name}</p>
      </SingleInfoContainer>}
      {schoolData?.education_level && <SingleInfoContainer $width={true} >
        <Hashtag />
        <p>Education level: {schoolData?.education_level}</p>
      </SingleInfoContainer>}
    </>
  );
};
export { SchoolInformation };
