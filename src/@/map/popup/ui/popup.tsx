import { ArrowRight, Hashtag, LocationFilled, TransmissionLte, Wifi } from '@carbon/icons-react'
import { Button, ButtonSkeleton, SkeletonText } from '@carbon/react';
import { styled } from 'styled-components';

import { ConnectivityStatusCircle } from '~/@/sidebar/ui/school-view-component/styles/school-view-style';

import { InnerCircle, InnerCircleConnectivity } from '../../ui/legend-info/legend-button.style';
import { $country } from '~/@/country/country.model';
import { useStore } from 'effector-react';

const SchoolMarkerWrapper = styled.div`
  // position: relative;
  // top: -50px;
  cursor: pointer;
`
const PopupTemplate = styled.div`
  width: 231px;
  border-radius: 2px;
  background: ${props => props.theme.main};
  padding: 16px;
  box-shadow: 0px 2px 3px 0px ${props => props.theme.main};
`
const SchoolNameWrapper = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
`
export const SchoolInfoWrapper = styled.div`
display:flex;
align-items:baseline;
margin-top:0.75rem;
&.hide, .hide {
  display: none;
}
svg{
  width: 0.75rem;
  height: 0.75rem;
  fill: ${props => props.theme.text};
  margin-right:0.25rem;
  margin-top: -0.12rem;
}
`

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const SchoolName = styled.h6`
  color: ${props => props.theme.text};
font-size: 0.875rem;
font-style: normal;
font-weight: 600;
line-height: 1.125rem;
letter-spacing: 0.01rem;
  margin-bottom: 2px;
  max-width: 85%;
  margin-right:1rem;
`
const Label = styled.span`
color: ${props => props.theme.titleDesc};
font-size: 0.75rem;
font-weight: 400;
line-height: 1.125rem; 
text-transform: capitalize;
`
const GeoLabel = styled(Label)`
   color: ${props => props.theme.titleDesc};
font-size: 0.75rem;
font-weight: 400;
line-height: 1.125rem; 
`
const GeoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 8px;
`

const LocationFilledIcon = styled(LocationFilled)`
  color: ${props => props.theme.graphWeekMonthBorder};
`

const LocationCompanyFilledIcon = styled(LocationFilled)`
  color: ${props => props.theme.titleBlue};
  height: 3rem;
  width: 3rem;
  transform: translateY(-34px);
`
export const GoToSchoolButton = styled(Button)`
width:100%;
outline: none;
border: none;
&.hide {
  display: none;
}
`

const SkeletonHeading = styled(SkeletonText).attrs({ heading: true })`
  width: 100%;
  height: 1rem;
  margin-block-end: 0.25rem;
`

const SkeletonLabel = styled(SkeletonText)`
  margin-block-end: 0;
  height: 1.125rem;
`
const ConnectivityCircleWrapper = styled.div`
  position: relative;
`
export const Popup = () => {
  return (
    <div className="school-popup-data">
      <SchoolMarkerWrapper className="shool-marker-wrapper">
        <LocationCompanyFilledIcon aria-label="marker" className="school-map-marker" size={46} />
      </SchoolMarkerWrapper>
      <div className="map-popup-template">
        <PopupTemplate className="main-popup-container">
          <SchoolNameWrapper>
            <SchoolName className="map-school-name"></SchoolName>
            <ConnectivityCircleWrapper className="map-school-status-circle">
              <InnerCircleConnectivity className="outer-circle" />
              <InnerCircle className="inner-circle" $margin="0.35rem 0 0 0" />
            </ConnectivityCircleWrapper>
          </SchoolNameWrapper>
          <SchoolInfoWrapper>
            <LocationFilledIcon />
            <GeoLabel className="label map-school-geo"></GeoLabel>
          </SchoolInfoWrapper>
          <SchoolInfoWrapper className="live-container hide">
            <Wifi />
            <FlexColumn>
              <Label className="map-school-connectivity-speed"></Label>
              <Label className="benchmark-value-label hide">School benchmark 2Mbps</Label>
            </FlexColumn>
          </SchoolInfoWrapper>
          <SchoolInfoWrapper className="static-container hide">
            <span className="static-icon"><TransmissionLte /></span>
            <Label className="map-school-school-coverage"></Label>
          </SchoolInfoWrapper>
        </PopupTemplate>
        <GoToSchoolButton className="go-to-school hide" type="button"
          renderIcon={ArrowRight} >
          Go to School page
        </GoToSchoolButton>
      </div>

      <div className="popup-template-loading">
        <PopupTemplate>
          <SchoolNameWrapper>
            <SkeletonHeading />
            <ConnectivityStatusCircle $color={""}>
            </ConnectivityStatusCircle>
          </SchoolNameWrapper>
          <SchoolInfoWrapper>
            <Hashtag />
            <SkeletonLabel width="60%" />
          </SchoolInfoWrapper>
          <SchoolInfoWrapper>
            <LocationFilledIcon />
            <SkeletonLabel width="80%" />
          </SchoolInfoWrapper>
          <SchoolInfoWrapper>
            <Wifi />
            <SkeletonLabel width="40%" />
          </SchoolInfoWrapper>
          <SchoolInfoWrapper>
            <TransmissionLte />
            <SkeletonLabel width="40%" />
          </SchoolInfoWrapper>
        </PopupTemplate>
        <ButtonSkeleton style={{ width: '100%' }} />
      </div>
    </div>
  );
};
