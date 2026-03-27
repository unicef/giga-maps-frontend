import { Hashtag } from '@carbon/icons-react'
import { Accordion } from "@carbon/react";
import { styled } from "styled-components";

import { Scroll } from '@/scroll';

export const AccordionDistribution = styled(Accordion)`
  .cds--accordion__item {
    border: none;
  }
  .cds--accordion__heading:focus::before {
    box-sizing: border-box;
    border: none;
}

  .cds--accordion__arrow{
    fill:${props => props.theme.text};
  }

  .cds--accordion__heading::before {
    color: white;
    background-color: ${props => props.theme.text};
  }

  .cds--accordion__content {
    width: 100%;
    padding: 0 1rem;
    margin-top: 0.5rem;
    
.hash-icon-school-status{
  margin-right:0.25rem;
}
    /* >p {
      color:  ${props => props.theme.text};
      font-family: "Open Sans";
      font-size: 0.75rem;
      font-style: normal;
      line-height: 1rem;
      margin-bottom: 0.5rem;
      align-items: center;
      display: flex;
      font-weight: normal;
    } */
  }

  .cds--accordion__heading::before {
    color: white;
    background-color: transparent;
  }


  .cds--accordion__title {
    height: 2rem;
    display: flex;
    color:${props => props.theme.text};
    font-size: 0.75rem;
    align-items: center;
    font-weight: normal;
    line-height: 1.25rem;
  }
  // .cds--accordion__heading:hover {
  //   background: ${props => props.theme.main};
  // }
`

export const MobileCoverageScroll = styled(Scroll) <{ $height?: boolean; }>`
max-height: ${(props) => props.$height ? "calc(100vh - 29rem)" : ""} ;
`

export const SidebarScroll = styled(Scroll)`
    height: auto;
`

export const HashtagIcon = styled(Hashtag)`
  fill: ${props => props.theme.text};
  margin-right: 0.325rem;
`


export const VerticalSliderButton = styled.div`
width: 56px;
height: 4px;
border-radius: 20px;
background: #ECECEC;
cursor: pointer;
`

