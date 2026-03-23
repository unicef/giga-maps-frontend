import { Hashtag } from '@carbon/icons-react'
import { Accordion } from "@carbon/react";
import { css, styled } from "styled-components";

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
  fill: #f4f4f4;
  margin-right: 0.325rem;
`


export const SidePanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  width: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  background: #161616;
  border: 1px solid #393939;
  border-radius: 0.875rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);

  .cds--tooltip-content{
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  @media (max-width: 768px) {
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`
export const MainSideBarContainer = styled.div<{ $height: boolean, $left: boolean }>`
  transition: all 0.3s;
  position: relative;
  z-index: 2;
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 100%;


  @media (max-width: 768px) {
    width: 100%;
    height: ${props => props.$height ? "60vh" : "32vh"} ;
    top: unset;
    bottom: ${props => props.$left ? "-24vh" : "0"};
    position: fixed;

    .sidebar__expander {
      display: none;
      cursor: pointer;
    }
  }

  @media (min-width: 769px) and (max-width: 1584px) {
    position: fixed;
    top: 0.5rem;
    bottom: 1.8rem;
    left: ${props => props.$left ? "-17rem" : "0.5rem"};
    width: 288px ;
    height: auto;
  }

  @media only screen and (min-width: 1584px) {
    position: fixed;
    top: 0.5rem;
    bottom: 0.5rem;
    left: ${props => props.$left ? "-18.2rem" : "0.5rem"};
    width: 296px ;
    height: auto;
  }

 .sidebar__expander {
    cursor: pointer;
    position: absolute;
    bottom: 5.5rem;
    left: 100%;
    display: flex;
    width: 16px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.main};
    border: none;
    outline: none;
    padding: 0;

    >svg {
      fill:#fff;
      transition: all .5s;
      transform: ${props => props.$left ? 'rotate(0deg)' : 'rotate(180deg)'};
      width: 1rem;
      height: 1rem;
      color: ${props => props.theme.text};
    }
  }
`

export const VerticalSliderButtonWrapper = styled.div`
padding: 0.6rem;
display: flex;
align-items: center;
justify-content: center;
width: 100%;
margin-bottom: -0.0625rem; 
background:${props => props.theme.main};
svg {
  fill: ${props => props.theme.text};  
}
`

export const VerticalSliderButton = styled.div`
width: 56px;
height: 4px;
border-radius: 20px;
background: #ECECEC;
cursor: pointer;
`

export const SubContainer = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
`

export const SearchAreaWrapper = styled.div`
  position: relative;
  z-index: 12;
`

export const MapButtonWrapper = styled.div<{ $hide?: boolean }>`
  position: relative;
  transition: all .5s;
  ${props => props.$hide && css`
    transform: translateX(-100%);
  `};
  z-index: 10;
`
