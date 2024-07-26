import { styled } from "styled-components";

import { Scroll } from '@/scroll';

export const LayerHeader = styled.div` 
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  svg{
    fill:${props => props.theme.text} !important;
  }
  
`

export const SchoolInfoSection = styled.div`
  margin-top: 1.25rem;
  margin-left: 1rem;

.highlight-number {
  color: var(--main-color-green);
  font-size: 2rem;
  font-weight: 500;
}

.descriptons {
  color: var(--primary-color-primary);
  font-size: 0.75rem;
}
`

export const SchoolConnectivityScroll = styled(Scroll)`
  max-height: calc(100vh - 19rem);

  @media (max-width:575px){
    max-height: calc(100vh - 31rem);
  }
`

export const CoverageLayerScroll = styled(Scroll)`
max-height: calc(100vh - 19rem);

  @media (max-width:575px){
    max-height: calc(100vh - 31rem);
  }
  `
export const FilterIconAndName = styled.div`
display:flex;
align-items:center;
justify-content: space-between;
padding: 0.55rem 1rem;
.cds--tooltip-content{
  font-size: 0.8rem;
  max-width: 10rem;
}
.layer-heading {
    margin: 0;
    color: ${props => props.theme.text};
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem;
    font-family: 'Open Sans';
    margin-left: .5rem;
  }

  svg{
    fill:${props => props.theme.text};
  }

 .info-icon{
   button{
  border: none;
    background: inherit;
    margin-top: 0.3rem;
    margin-left: 0.5rem;
    svg{
      fill:#7E7E7E;
      width: 0.75rem;
      height: 0.75rem;
    }
}
}
`

export const SidebarFooterGigalayerContainer = styled.div`
position: fixed;
bottom: 1.8rem;
display: flex;
align-items: flex-start;
justify-content: space-between;
width: inherit;
z-index: 1;
border-top: 1px solid ${props => props.theme.schoolListBack};
background:${props => props.theme.main};

.cds--btn--ghost:not([disabled]) svg {
    fill: var(--cds-icon-primary, #161616);
    color: #9e9e9e;
    height: 1rem;
    margin-right: 0.5rem;
    width: 1rem;
}

#connectivityID {
  margin: 0;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
}

.sidebar-worldview-gigaIcon{
  padding: 0;
    display: flex;
    align-items: center;
}

.sidebar-footer-gigalayer-icons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  // width: 100%;
  padding: 0.5rem;
  padding-right:0rem;

  .cds--popover-caret{
    background: ${props => props.theme.main};
  }
}

@media (max-width:768px){
  bottom: 0rem;
  width:100%;
}
`