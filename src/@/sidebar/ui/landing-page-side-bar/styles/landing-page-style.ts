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
  padding: 0.625rem 0.875rem;
`

export const EntityCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`

export const EntityCard = styled.section`
  background: ${props => props.theme.main};
  border: 1px solid ${props => props.theme.schoolListBack};
  border-radius: 0.5rem;
  overflow: visible;
`

export const EntityCardPanel = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${props => props.$open ? '1fr' : '0fr'};
  opacity: ${props => props.$open ? 1 : 0};
  transition:
    grid-template-rows 220ms ease,
    opacity 180ms ease;
`

export const EntityCardPanelInner = styled.div<{ $open: boolean }>`
  min-height: 0;
  overflow: ${props => props.$open ? 'visible' : 'hidden'};
`

export const EntityCardHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${props => props.theme.text};

  svg {
    fill: currentColor;
  }
`

export const EntityCardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
`

export const EntityCardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #0f62fe;
  color: #f4f4f4;
  font-size: 0.625rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
`

export const EntityCardTitle = styled.span`
  color: ${props => props.theme.text};
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.125rem;
  text-align: left;
`

export const EntityCardCollapsedContent = styled.div`
  padding: 0 0.875rem 0.5rem;
`

export const EntityCardCollapsedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-top: 1px solid ${props => props.theme.schoolListBack};

  &:first-child {
    border-top: none;
  }
`

export const EntityCardCollapsedValue = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.375rem;
`

export const EntityCardCollapsedLabel = styled.span`
  color: ${props => props.theme.titleDesc};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: right;
`

export const EntityCardExpandedContent = styled.div`
  padding: 0 0.875rem 0.625rem;
`

export const EntityCardMetric = styled.div`
  padding: 0.875rem 0;
  border-top: 1px solid ${props => props.theme.schoolListBack};

  &:first-child {
    border-top: none;
  }
`

export const EntityCardMetricLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${props => props.theme.titleDesc};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.25rem;

  .metric-label-tooltip {
    display: inline-flex;
    align-items: center;

    button {
      border: none;
      background: transparent;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    svg {
      fill: ${props => props.theme.grey60};
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`

export const EntityCardMetricValue = styled.div`
  margin-top: 0.5rem;
  color: ${props => props.theme.text};
  font-size: 1.375rem;
  font-weight: 500;
  line-height: 1.625rem;
`

export const EntityCardMetricEstimate = styled.span`
  color: #a8a8a8;
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 0.875rem;
  margin-left: 0.375rem;
`

export const EntityCardMetricDetail = styled.p`
  margin: 0.25rem 0 0;
  color: #a8a8a8;
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 0.875rem;
`

export const EntityCardBarWrapper = styled.div`
  margin-top: 0.75rem;
`

export const EntityCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.35rem 0.875rem;
  box-sizing: border-box;
  background: #0f62fe;
  border-radius: 0 0 0.5rem 0.5rem;
`

export const EntityCardFooterBrand = styled.a`
  color: #f4f4f4;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
  text-decoration: none;
`

export const EntityCardFooterLogo = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #f4f4f4;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;

  img {
    display: block;
    height: 0.875rem;
    width: auto;
  }

  svg {
    display: block;
    height: 1.5rem;
    width: auto;
  }

  svg path,
  svg g,
  svg polygon,
  svg rect,
  svg circle {
    fill: #f4f4f4;
  }
`

export const UpperContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const TitleWrapper = styled.div`
  display:flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`
export const MainTitle = styled.p<{ $color: string }>`
color: ${(props) => props.$color};
font-family: Open Sans;
font-size: 1rem;
font-weight: 400;
line-height: 1.35rem;
margin: 0;
max-width: 14rem;
`

export const DescriptionWrapper = styled.div`
p{
  color:${props => props.theme.titleDesc};
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0.01rem;
  margin: 0;
}
`

export const LandingPageHeadingActions = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: -0.125rem;

  .cds--btn--ghost,
  .cds--btn--ghost:hover,
  .cds--btn--ghost:focus,
  .cds--btn--ghost:active {
    background: transparent;
  }

  .sidebar-worldview-shareIcon svg {
    fill: ${props => props.theme.text} !important;
  }
`

export const MappedContentWrapper = styled.div`
padding-top:1.5rem;
svg{
  fill:#a8a8a8;
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
  .text {
    font-size: 0.875rem;
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
  max-height: 20rem;
}
`
export const MappedInfoWrapper = styled.div`
display:flex;
align-items:center;
margin-top:0.25rem;
justify-content: space-between;
p{
  color: #a8a8a8;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.75rem;
  
}
span{
  color: #a8a8a8;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.75rem; 
}
`

export const LandingPageScroll = styled(Scroll)`
  height: auto;
  max-height: none;
  background: ${props => props.theme.main};
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

export const EntityCardSkeleton = styled.div`
  padding: 0 1rem 0.75rem;

  .loading-line + .loading-line {
    margin-top: 0.75rem;
  }
`
