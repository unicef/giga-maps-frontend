import React, { useEffect, useState } from 'react';
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
import { getStatisticsConfig } from '~/@/sidebar/config/school-information-config'
import { StatisticConfig } from '../../../config/school-information-config'; // Adjust the import path as needed

const SchoolInformation = ({ schoolData }: { schoolData?: SchoolStatsType }) => {
  const [statisticsConfig, setStatisticsConfig] = useState<StatisticConfig[]>([]);
  const isLoading = useStore($isLoadingSchoolView);
  const stylePaintData = useStore($stylePaintData);
  const country = useStore($country);

  useEffect(() => {
    const fetchConfig = async () => {

      if (country?.id) {
        const config = await getStatisticsConfig(country.id);
        setStatisticsConfig(config);

      }
    };

    fetchConfig();
  }, [country?.id]);

  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({ schoolDetails: schoolData, stylePaintData });
  // 
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

      {statisticsConfig.map((config) => (
        <SingleInfoContainer $width={true} key={config.key}>
          <Hashtag />
          <p>
            {config.label}: {' '}
            {typeof schoolData?.statistics[config.key] === 'boolean'
              ? schoolData?.statistics[config.key] ? 'Yes' : 'No'
              : schoolData?.statistics[config.key] || 'N/A'}
          </p>
        </SingleInfoContainer>
      ))}
    </>
  );
};

export { SchoolInformation };