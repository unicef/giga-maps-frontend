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
    height: 100%;
`

export const HashtagIcon = styled(Hashtag)`
  fill: ${props => props.theme.text};
  margin-right: 0.325rem;
`


export const SidePanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  width: inherit;
  .cds--tooltip-content{
    font-size: 0.8rem;
    margin-left: 0.5rem;
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
    z-index: 1;
    width: 100%;
    height: ${props => props.$height ? "60vh" : "40vh"} ;
    top: unset;
    bottom: ${props => props.$left ? "-24vh" : "0"};
    position: fixed;

    .sidebar__expander {
      display: none;
      cursor: pointer;
    }
  }

  @media (min-width: 769px) and (max-width: 1584px) {
    transition: all 0.3s;
    position: fixed;
    top: 0rem;
    bottom: 5.3rem;
    left: ${props => props.$left ? "-17rem" : "0.5rem"};
    width: 288px ;
    height: 96vh;
    .sidebar__expander {
      cursor: pointer;
    position: absolute;
        top: 9.5rem;
        left: 100%;
        display: flex;
        width: 16px;
        height: 48px;
        align-items: center;
        justify-content: center;
        background-color: #7E7E7E;
        border: none;
        outline: none;
        padding: 0;
    
        >svg {
          fill:#fff;
          transition: all .5s;
          transform: ${props => props.$left ? 'rotate(0deg)' : 'rotate(180deg)'};
          
          width: 1rem;
          height: 1rem;
        }
      }
  }

  @media only screen and (min-width: 1584px) {
    transition: all 0.3s;
    position: fixed;
    top: 0rem;
    bottom: 5.3rem;
    left: ${props => props.$left ? "-18.2rem" : "0.5rem"};
    width: 296px ;
    height: 96vh;
    .sidebar__expander {
      cursor: pointer;
    position: absolute;
        top: 9.5rem;
        left: 100%;
        display: flex;
        width: 16px;
        height: 48px;
        align-items: center;
        justify-content: center;
        background-color: #7E7E7E;
        border: none;
        outline: none;
        padding: 0;
    
        >svg {
          transition: all .5s;
          transform: rotate(180deg);
          width: 1rem;
          height: 1rem;
        }
      }
}
  
  .sidebar__expander > svg {
    transform: ${props => props.$left && "rotate(0deg)"};
    color: #fff;
  }
`

export const VerticalSliderButtonWrapper = styled.div`
padding: 0.5rem;
display: flex;
align-items: center;
justify-content: center;
width: 100%;
background:${props => props.theme.main};
`

export const VerticalSliderButton = styled.div`
width: 56px;
height: 4px;
border-radius: 20px;
background: #ECECEC;
cursor: pointer;
`

export const SubContainer = styled.div`
height:calc(100% - 6rem);

@media (max-width:768px){
  height:calc(100%);
}
`

export const MapButtonWrapper = styled.div<{ $hide?: boolean }>`
  transition: all .5s;
  ${props => props.$hide && css`
    transform: translateX(-100%);
  `};
`