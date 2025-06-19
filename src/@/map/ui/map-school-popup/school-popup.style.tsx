import { Button, Link, SkeletonText } from "@carbon/react"
import styled from "styled-components"
import { LocationFilled } from '@carbon/icons-react'

export const PopupTemplate = styled.div`
  width: 317px; // px to rem
  border-radius: 2px;
  background: ${props => props.theme.grayDark};
  padding: 16px;
  box-shadow: 0px 2px 3px 0px ${props => props.theme.main};
  display: flex;
  flex-direction: column;
`
export const SchoolNameWrapper = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
margin-bottom: 1rem;
`
export const SchoolInfoWrapper = styled.div`
display:flex;
flex-direction:column;
align-items:baseline;
gap: 0.5rem;
`

export const SchoolName = styled.h6`
  color: ${props => props.theme.text};
  font-weight: 400;
  font-size: 20px;
  font-style: normal;
  line-height: 28px;
  letter-spacing: 0.01rem;
  margin-bottom: 2px;
`
export const Label = styled.span<{ $color?: string, $size?: string, $textTransform?: string }>`
color: ${props => props.$color || props.theme.titleDesc};
font-size: ${props => props.$size || '16px'};
font-weight: 400;
line-height: 1.125rem; 
text-transform: ${props => props.$textTransform || 'capitalize'};
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
  scale: 1.3;
  margin-right: 0.2rem;
  position: relative;
`

export const OSMLink = styled(Link)`
  margin: 1.5rem 0;
  font-size: 14px;
  width: auto;
  margin-left: auto;    
  text-decoration: underline;
  display: flex;
  align-self: flex-end;
  gap: 0.2rem;
  svg {
    fill: ${props => props.theme.titleBlue};
  }
  &:hover, &:focus, &:active {
    color: ${props => props.theme.titleBlue};
  }
`

export const LiveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
`;

export const LiveContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const LiveStatusRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;