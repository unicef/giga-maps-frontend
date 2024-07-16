import { Tooltip } from '@carbon/react';
import styled from "styled-components";

import { Scroll } from '@/scroll';

export const ExploreMapButtonWrapper = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;

    button{
      width: 100%;
      max-width: 100%;
    }
`

export const LandingPageContentWrapper = styled.div`
  background: ${props => props.theme.main};
  width: 100%;
  padding: 1.5rem 1rem 2rem 1rem;
`

export const UpperContentWrapper = styled.div`

`

export const TitleWrapper = styled.div`
display:flex;
`
export const MainTitle = styled.p<{ $color: string }>`
color: ${(props) => props.$color};
font-family: Open Sans;
font-size: 1.5rem;
font-weight: 600;
line-height: 2rem;
margin-right:0.5rem;
`

export const DescriptionWrapper = styled.div`
margin-top:1rem;
p{
  color:${props => props.theme.titleDesc};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.01rem;
}
`

export const TakeTourLink = styled.div`
margin-top:1rem;
display:flex;
svg{
  fill:${props => props.theme.titleDesc};
  margin-right:0.5rem;
}
a{
  cursor: pointer;
}
`

export const MappedContentWrapper = styled.div`
padding-top:1.5rem;
svg{
  fill:${props => props.theme.iconSecondary};
  height:1rem;
  width:1rem;
}
`

export const SchoolNumberWrapper = styled.div`
margin-top: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
p{
  color: ${props => props.theme.titleDesc};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 0.75rem; 
  margin:0;
  span{
    color:  ${props => props.theme.titleDesc};
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    margin-top:0.25rem;
  }
}

.information-icon{
  button{
    border:none;
    background:inherit;
  svg 
  {
      height:0.75rem;
      width:0.75rem;
      fill: ${props => props.theme.grey60};
    }
  }
}

.cds--tooltip-content{
  width: 10rem;
  max-height: 10rem;
}
`
export const MappedInfoWrapper = styled.div`
display:flex;
align-items:center;
margin-top:0.25rem;
justify-content: space-between;
p{
  color: ${props => props.theme.textTertiary};
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.75rem;
  
}
span{
  color: ${props => props.theme.textTertiary};
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.75rem; 
}
`

export const LandingPageScroll = styled(Scroll)`
max-height: calc(100% - 6.5rem);
background: ${props => props.theme.main};
@media (max-width: 768px){
  max-height: calc(100%);
}

`
interface CustomTooltipProps {
  align: string;
  key: number;
  flexgrow: string;
  backgroundcolor: string;
  label: string
}

export const CustomTooltip = styled(Tooltip) <CustomTooltipProps>`
  flex-grow: ${(prop) => prop.flexgrow};
  background-color: ${(prop) => prop.backgroundcolor};
  .cds--tooltip-trigger__wrapper {
    display: flex;
  }
  .cds--popover-content {
    width: 8rem;
  }
`
export const BarChartWrapper = styled.div`
display: flex;
    max-width: 100%;
    margin-top: 0.5rem;
    height: 0.25rem;
`

interface TooltipButtonProps {
  backgroundcolor: string;
}

export const TooltipButton = styled.button<TooltipButtonProps>`
flex-grow: 1;
background-color: ${(prop) => prop.backgroundcolor};;
cursor: pointer;
border: none;
height: 0.25rem;
`