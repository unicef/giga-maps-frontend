import { Account, ConnectionSignal, Hashtag, Location } from '@carbon/icons-react'
import { AccordionItem } from '@carbon/react';
import { useStore } from 'effector-react';
import styled from 'styled-components';

import { $stylePaintData } from '~/@/map/map.model';

import { AccordionItemTitle } from '../../global-and-country-view-components/common/accordion-item-title.view';
import { ConnectivityStatusNames } from '../../global-and-country-view-components/container/layer-view.constant';
import { AccordionDistribution } from '../../sidebar.style';
import { StatisticsStatus } from '../styles/school-information.style';
import { SingleInfoContainer } from '../styles/school-view-style';

const SchoolConntectivtyWrapper = styled.div`
margin-top: 1rem;
position: fixed;
bottom: 7rem;
width: 273px;
margin:0.5rem 0.5rem;
background: ${props => props.theme.schoolListBack};
z-index: 2; 
.cds--accordion__content {
  padding: 0rem 1rem 1rem 1rem;
}
@media (max-width: 768px) {
  width: 100%;
  margin:0;
  bottom:5.5rem;
}
@media only screen and (min-width: 1584px) {
    width: 280px;
  }

`
const AccordionTitle = styled.div`
  display: flex;
p{
  color:  ${props => props.theme.text};
  font-family: Open Sans;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem; 
  letter-spacing: 0.01rem;
  margin-left:0.5rem;
  margin-right:0.5rem;
}

`

const AccordionTitleWrapper = () => (
  <AccordionItemTitle tooltipLabel={'School status'} label={<AccordionTitle>
    <Account />
    <p>
      School status
    </p>
  </AccordionTitle>}
  />
);

const SingleSchoolStatus = ({ open, setShow, schoolData }: { open: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>>; schoolData: SchoolStatsType }) => {
  const connectivityStatusColors = useStore($stylePaintData);

  return (
    <SchoolConntectivtyWrapper className="connectivity-status-container">
      <AccordionDistribution>
        <AccordionItem
          title={<AccordionTitleWrapper />}
          open={open}
          onHeadingClick={() => setShow(prev => !prev)} >
          <>
            <SingleInfoContainer>
              <Hashtag />
              <p>{schoolData?.id}</p>
            </SingleInfoContainer>
            <SingleInfoContainer>
              <Location />
              <p title={schoolData?.geopoint?.coordinates.join(', ')}>{schoolData?.geopoint?.coordinates.join(', ')}</p>
            </SingleInfoContainer>
            <SingleInfoContainer>
              <ConnectionSignal />
              <StatisticsStatus $color={connectivityStatusColors[schoolData?.statistics?.connectivity_status]}>
                {ConnectivityStatusNames[schoolData?.statistics?.connectivity_status]}
              </StatisticsStatus>
            </SingleInfoContainer>
          </>
        </AccordionItem>
      </AccordionDistribution>
    </SchoolConntectivtyWrapper>
  )
}


export default SingleSchoolStatus
