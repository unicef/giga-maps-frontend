import { Hashtag, Location, Wifi } from '@carbon/icons-react';
import { AccordionItem } from '@carbon/react';
import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';

import { CustomIcon } from '~/@/common/style/styled-component-style';
import { $stylePaintData } from '~/@/map/map.model';
import { getLiveSchoolDetails, getNullValueText, getSchoolStatus, getStaticSchoolDetails } from '~/@/sidebar/school-view.utils';
import { $layerUtils } from '~/@/sidebar/sidebar.model';
import { SchoolStatsType } from '~/api/types';

import { ConnectivityStatusNames } from '../../global-and-country-view-components/container/layer-view.constant';
import { StatisticsStatus } from '../styles/school-information.style';
import { AccordionTitle, ConnectivityStatusCircle, MultiSchoolAccodion, MultischoolBottomInfo, MultischoolBottomInfoItem, MultiSchoolContainer, SchoolInfoContainer, SchoolMultiAccordion, SchoolTitleWrapper, SingleInfoContainer } from '../styles/school-view-style';
import CommonUIOnlySchoolConnectivityLayer from './common-ui-only-school-connectivity-layer';
import SchoolCheckbox from './school-checkbox.view';
import SingleSchoolConnectivityLayer from './single-school-connectivity-layer.view';
import SingleSchoolCoverageLayer from './single-school-coverage-layer';

const MultiSchoolCommonAccodion = ({ schoolDetails, isOpen, onToggle }: PropsWithChildren<{ schoolDetails: SchoolStatsType; isOpen: boolean; onToggle: () => void }>) => {
  const { currentLayerTypeUtils, selectedLayerData } = useStore($layerUtils);
  const { global_benchmark, icon } = selectedLayerData ?? {};
  const { isLive, isStatic } = currentLayerTypeUtils;
  const unit = global_benchmark?.convert_unit;
  const stylePaintData = useStore($stylePaintData);
  const { value, color } = isLive ? getLiveSchoolDetails({ schoolDetails, stylePaintData }) : getStaticSchoolDetails({ schoolDetails, stylePaintData });
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({ schoolDetails, stylePaintData });
  const { num_students: numStudents } = schoolDetails.statistics || {};
  return (
    <MultiSchoolContainer
      key={schoolDetails.id}>
      <SchoolCheckbox schoolDetails={schoolDetails} />
      <MultiSchoolAccodion>
        <SchoolMultiAccordion>
          <AccordionItem
            title={
              <>
                <AccordionTitle title={schoolDetails.name}>
                  <SchoolTitleWrapper>
                    <p>{schoolDetails.name}</p>
                    <ConnectivityStatusCircle $color={connectivityStatusColor}>
                    </ConnectivityStatusCircle>
                  </SchoolTitleWrapper>
                </AccordionTitle>
                {!isOpen &&
                  <MultischoolBottomInfo>
                    <SchoolInfoContainer>
                      <SingleInfoContainer>
                        <Hashtag />
                        <p>{schoolDetails.external_id}</p>
                      </SingleInfoContainer>
                      <SingleInfoContainer>
                        <Location />
                        <p title={schoolDetails?.geopoint?.coordinates.join(', ')}>{schoolDetails?.geopoint?.coordinates.join(', ')}</p>
                      </SingleInfoContainer>
                      {
                        <SingleInfoContainer>
                          <Hashtag />
                          <p>{numStudents} students</p>
                        </SingleInfoContainer>
                      }
                    </SchoolInfoContainer>
                    <div className='multi-school-bottom-info'>
                      <MultischoolBottomInfoItem>
                        {connectivityStatus &&
                          <>
                            <ConnectivityStatusCircle $color={connectivityStatusColor}>
                            </ConnectivityStatusCircle>&nbsp;&nbsp;
                            <StatisticsStatus $color={connectivityStatusColor}>{ConnectivityStatusNames[connectivityStatus]}</StatisticsStatus>
                          </>
                        }
                      </MultischoolBottomInfoItem>
                      {(isLive || isStatic) && <MultischoolBottomInfoItem>
                        {isLive && <Wifi size={20} />}
                        {isStatic && <CustomIcon dangerouslySetInnerHTML={{ __html: (icon ?? "") }} $size={20} />}
                        &nbsp;&nbsp;
                        <StatisticsStatus $color={color}>
                          {isLive ? `${value ? `${value} ${unit}` : getNullValueText(connectivityStatus)}` : String(value)}
                        </StatisticsStatus>
                      </MultischoolBottomInfoItem>}
                    </div>
                  </MultischoolBottomInfo>}
              </>
            }
            onHeadingClick={onToggle} open={isOpen}
          >
          </AccordionItem>
        </SchoolMultiAccordion>
      </MultiSchoolAccodion>
      {isOpen && (
        <>
          {isLive && <SingleSchoolConnectivityLayer schoolId={schoolDetails.id} />}
          {isStatic && <SingleSchoolCoverageLayer schoolId={schoolDetails.id} />}
          {!isLive && !isStatic && <CommonUIOnlySchoolConnectivityLayer schoolId={schoolDetails.id} />}
        </>
      )}
    </MultiSchoolContainer>
  )
}

export default MultiSchoolCommonAccodion;
