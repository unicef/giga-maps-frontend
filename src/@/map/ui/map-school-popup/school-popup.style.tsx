import { Button, Link, SkeletonText } from "@carbon/react"
import styled from "styled-components"
import { LocationFilled } from '@carbon/icons-react'

export const PopupTemplate = styled.div`
  width: 15.4375rem; // px to rem
  border-radius: 2px;
  background: ${props => props.theme.grayDark};
  padding: 1rem;
  box-shadow: 0px 2px 3px 0px ${props => props.theme.main};
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: Open Sans
`
export const SchoolNameWrapper = styled.div`
display:flex;
align-items:flex-start;
margin-bottom: 1rem;
justify-content: space-between;
gap: 0.75rem;
`
export const SchoolNameContent = styled.div`
display:flex;
align-items:center;
gap: 0.5rem;
flex-wrap: wrap;
min-width: 0;
flex: 1;
`
export const SchoolInfoWrapper = styled.div`
display:flex;
flex-direction:column;
align-items:baseline;
gap: 0.5rem;
margin-bottom: 0.5rem;
`

export const SchoolName = styled.h6`
  color: ${props => props.theme.filterText};
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.75rem;
  margin-bottom: 2px;
  max-width: 100%;
  margin-right: 0;
  text-transform: capitalize;
  overflow-wrap: break-word;
  word-break: break-word;
`
export const SchoolVerificationTag = styled.span`
  border-radius: 62.5rem;
  background: #CDD3DA;
  padding: 0 0.5rem 0.125rem;
  color: var(--tag-cool-gray-text, #474747);
  font-family: Open Sans;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  text-transform: capitalize;
  white-space: nowrap;
`
export const Label = styled.span<{ $color?: string, $size?: string, $textTransform?: string }>`
color: ${props => props.$color || props.theme.titleDesc};
font-size: ${props => props.$size || '.875rem'};
font-weight: 400;
line-height: 1rem; 
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
  align-self: flex-start;
  font-size: 14px;
  width: auto;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  svg {
    fill: ${props => props.theme.titleBlue};
    width: 16px;
    height: 16px;
  }
  &:hover, &:focus, &:active {
    color: ${props => props.theme.titleBlue};
  }
`

export const LiveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
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