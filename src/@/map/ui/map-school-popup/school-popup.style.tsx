import { Button, SkeletonText } from "@carbon/react"
import styled from "styled-components"
import { LocationFilled } from '@carbon/icons-react'

export const SchoolMarkerWrapper = styled.div`
  // position: relative;
  // top: -50px;
  cursor: pointer;
`
export const PopupTemplate = styled.div`
  width: 231px;
  border-radius: 2px;
  background: ${props => props.theme.main};
  padding: 16px;
  box-shadow: 0px 2px 3px 0px ${props => props.theme.main};
`
export const SchoolNameWrapper = styled.div`
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
export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const SchoolName = styled.h6`
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
export const Label = styled.span`
color: ${props => props.theme.titleDesc};
font-size: 0.75rem;
font-weight: 400;
line-height: 1.125rem; 
text-transform: capitalize;
`
export const GeoLabel = styled(Label)`
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

export const LocationFilledIcon = styled(LocationFilled)`
  color: ${props => props.theme.graphWeekMonthBorder};
`

export const LocationCompanyFilledIcon = styled(LocationFilled)`
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

export const SkeletonHeading = styled(SkeletonText).attrs({ heading: true })`
  width: 100%;
  height: 1rem;
  margin-block-end: 0.25rem;
`

export const SkeletonLabel = styled(SkeletonText)`
  margin-block-end: 0;
  height: 1.125rem;
`
export const ConnectivityCircleWrapper = styled.div`
  position: relative;
`