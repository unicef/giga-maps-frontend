import { ChevronDown, ChevronRight, ChevronUp, Close, RecentlyViewed } from '@carbon/icons-react';
import { DesignResearch } from '@carbon/pictograms-react';
import { Button, Checkbox, InlineLoading, Search } from '@carbon/react';
import styled, { css } from "styled-components";

import { Scroll } from '~/@/scroll';
import CarbonPagination from '~/lib/carbon/carbon-pagination';

const ButtonBase = styled.button`
  cursor: pointer;
  background: none;
  border: none;
`

export const SearchResultWrapper = styled.div`
    background: ${props => props.theme.main};
    position: absolute;
    width: 100%;
    padding-top: 0.5rem;
    height: calc(100% - 6rem);
    z-index: 5;
    top:6rem;
    box-shadow:#212020 0px 14px 40px 0px;
    max-height: 31.25rem;

    @media (max-width:768px){
      position: fixed;
      top: 3.1rem;
      height: calc(100% - 3rem);
      z-index: 11;
    }
`

export const SearchListWrapper = styled.div`
background: ${props => props.theme.main};
    position: absolute;
    width: 100%;
    height: calc(100% - 6rem);
    z-index: 5;
    top:6rem;

    @media (max-width:768px){
      position: fixed;
    top: 3.1rem;
    height: calc(100% - 3rem);
    z-index: 11;
    }
`
export const SearchResultScroll = styled(Scroll)`
background: ${props => props.theme.main};
height: calc(100% - 4rem);

`
export const SearchTopHead = styled.span`
  display: flex;
  align-items: center;
  height: 2rem;
  padding: 1rem 1rem;
  background: ${props => props.theme.schoolListBack};
  color: ${props => props.theme.grey60};
  font-size: 0.75rem;
`
export const SearchItem = styled.div<{ $nested?: boolean; $border?: boolean; $justify?: string; $gap?: number; $history?: ReturnType<typeof css> }>`
   padding: 1rem;
   justify-content: ${props => props.$justify ?? 'space-between'};
   align-items: center;
   display: flex;
   width: calc(100% - 1rem);
   margin-left: .5rem;
      ${props => props.$nested && css`
    padding: 0.5rem;
    padding-left: 1.7rem; 
    padding-right: 1rem;
  `}
   ${props => props.onClick && css`
    cursor: pointer; 
  `}
   ${props => props.$gap && `
      gap: ${props.$gap}rem;  
   `}
   ${props => props.$border && css`
      border-bottom: 0.0625rem solid  ${props.theme.bottomBorder};  
   `}
   ${props => props.$history}

   .type-name {
    display: block;
   }
   .highlight {
    color: var(--primary-blue)
   }
   .light {
    color: var(--text-text-tertiary)
   }
   .sidebar-history-remove {
      >svg {
        fill: ${props => props.theme.text} !important;
      }
   }
`;

export const SchoolItem = styled(SearchItem)`
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0;
  cursor: pointer;
  padding: 0.5rem 1rem 0.5rem 0.75rem;
`

export const DistictWrapper = styled.div`
  padding-left: 0.5rem;
  background: ${props => props.theme.main};
`

export const LeftItem = styled.h4<{ $recent?: boolean; $bold?: boolean; $highlight?: boolean; $fullWidth?: boolean }>`
  color:  ${props => props.$highlight ? props.theme.titleBlue : props.theme.text};
  font-size: 0.875rem;
  position: relative;
  ${props => !props.$fullWidth && css`
    max-width: 8rem;
  `}
  ${props => props.$bold && css`
    font-weight: bold;
  `}
  ${props => props.$recent && css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  `}
  a:hover {
    text-decoration: underline;
  }
`

export const RightItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

export const LinkItem = styled.span<{ $underline?: boolean; $bold?: boolean; $highlight?: boolean; $secondary?: boolean; }>`
color:  ${({ $secondary, $highlight }) => {
  if ($highlight) {
    return props => props.theme.titleBlue;
  } else if ($secondary) {
    return props => props.theme.titleDesc;
  } else {
    return props => props.theme.text;
  }
}}; 
font-size: 0.75rem;
text-transform: capitalize;
  margin-right: 0.25rem;
  max-width: 6rem;
  text-align: right;
  ${props => props.$underline && css`
    text-decoration: underline;  
  `}
  ${props => props.$bold && css`
    font-weight: bold;
  `}
`

export const SchoolCheckbox = styled(Checkbox)`
  margin-right: 1rem;
  margin-top: -4px;
  height: 12px;
  width: 12px;
  flex: none;
  .cds--checkbox:checked+.cds--checkbox-label::before{
    border: 1px solid ${props => props.theme.text};
    border-width: 1px;
    background-color: var(--cds-icon-primary, ${props => props.theme.text});
  }
  .cds--checkbox-label::after {
    border-block-end: 1.5px solid var(--cds-icon-inverse, ${props => props.theme.main});
    border-inline-start: 1.5px solid ${props => props.theme.main};
  }
  .cds--checkbox-label::before{
    border: 1px solid ${props => props.theme.text};
  }
`
export const SchoolName = styled.h6`
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 400;
  text-transform: capitalize;
  width: 14rem;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  overflow: hidden;
`

export const SchoolBody = styled.span`
  color: ${props => props.theme.schoolId}; 
  font-size: 10px;
  margin-top: 10px;
`
export const Loading = styled(InlineLoading)`
  padding: 16px;
`
export const ButtonGroup = styled.div<{ $hide: boolean; }>`
 display:flex;
 ${props => props.$hide && css`
  display: none;
`}
`

export const FooterWrapper = styled.div`
  position: absolute;
  background:${props => props.theme.main};
  bottom: 0;
  left: 0;
  width: 100%;

.cds--pagination__left {
  display:none;
}
.cds--pagination__right {
  color: var(--primary-black-80-giga-dark-grey);
  font-family: Open Sans;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  border: none;

  .cds--form-item.cds--select__page-number{
  display:block;
  }
}

@media (max-width: 768px) {
  position: fixed;
}
`

export const ApplyButton = styled(Button)`
  background:${props => props.theme.titleBlue};
  width: 25%;
  max-width: 100%;

`

export const SelectedColumn = styled.div`
 width: 75%;
  max-width: 100%;
  background: ${props => props.theme.titleBlue};
  padding: 8px 16px;
  display: flex;
  align-items: center;
`

export const SeletedText = styled.span`
  color: ${props => props.theme.text};
  font-size: 12px;
`

export const SchoolCount = styled.span`
  background: ${props => props.theme.text};
  font-size: 12px;
  padding: 2px 2px 2px 8px;
  border-radius: 50px;
  color: ${props => props.theme.main};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`

export const CloseButton = styled(ButtonBase)`
  padding: 2px;
  display: flex;
  svg{
    fill:${props => props.theme.main};
  }
`
export const SchoolHeader = styled.div`
  z-index: 1;
position: sticky;
top: 0;
left: 0;
`

export const CloseSchoolList = styled.div`
background: ${props => props.theme.main};
display: flex;
align-items: center;
justify-content: space-between;
padding: 0.5rem 1rem 0.5rem 1rem;
& > p {
  overflow: hidden;
color: ${props => props.theme.text};
text-overflow: ellipsis;
white-space: nowrap;
font-family: Open Sans;
font-size: 0.875rem;
font-style: normal;
font-weight: 400;
line-height: 1.125rem; 
}
`

export const CloseSchoolListIcon = styled(Close)`
cursor: pointer;
color:${props => props.theme.text};
`

export const SchoolListWrapper = styled.div`
background: ${props => props.theme.main};
position: fixed;
left: 18.5rem;
z-index: 3;
top: 6rem;
height: calc(100vh - 7.7rem);
width: 288px;
max-width: 18rem;

  @media (max-width:768px){
    left: 0;
    width: 100%;
    max-width: 100%;
    top:3rem;
    height:100%;
  }

    @media only screen and (min-width: 1584px) {
    left: 19.1rem;
    width: 296px;
  }
`

export const SchoolListPagination = styled(CarbonPagination)`
  background:${props => props.theme.main};
  justify-content: flex-end;
  color:${props => props.theme.text};
  border: none;
  .cds--select-input:hover {
    background: ${props => props.theme.main};
}
.cds--pagination__button{
border: none;
}
.cds--select-input:focus {
  background-color: ${props => props.theme.main} !important;
}


.cds--btn--ghost:not([disabled]) svg, svg {
  fill: ${props => props.theme.schoolId};
}
  .cds--select-input__wrapper{
    .cds--select-input{
      color:${props => props.theme.text};
    }
    svg{
      fill:${props => props.theme.text};
    }
  }
  .cds--pagination__text{
    color:${props => props.theme.text};
  }
  .cds--number--sm.cds--number input[type=number] {
    padding-inline-end: 0.4rem;
    min-inline-size: 6rem;
    background-color: ${props => props.theme.main};
    color:${props => props.theme.text};
    border-block-end: none;
    text-align: right;
  }
  .cds--number__control-btn:hover {
    background-color: ${props => props.theme.main};
  }
  .cds--btn--ghost:hover.cds--pagination__button {
    background-color: ${props => props.theme.text};
  }
  .cds--btn--ghost:hover.cds--pagination__button:focus {
    background-color: ${props => props.theme.main};
  }
  .cds--btn--ghost:hover.cds--pagination__button > svg {
    fill: ${props => props.theme.main};
  }
  .cds--number__control-btn::before, .cds--number__control-btn::after {
    inline-size: 0;
  }
  .cds--number__rule-divider {
    background-color: ${props => props.theme.text} !important;
  }
`

export const SchoolListContainer = styled.div`
  padding-bottom: 4.75rem;
  @media (max-width: 768px) {
    padding-bottom: 8.5rem;
  }
`

export const SchoolSearch = styled(Search)`
  >.cds--search-input {
    background:${props => props.theme.main};
    color:${props => props.theme.text};
    font-size: 0.75rem;
    border: none;
    //border: 0.5px solid var(--border-border-strong-01, ${props => props.theme.searchSchoolBorder});
    //border-bottom: 0.5px solid var(--border-border-strong-01, #C7C7C7);

  }
  
    input::placeholder{
  color: #6F6F6F;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
}

    .cds--search-magnifier{
      svg{
        fill:${props => props.theme.text};
      }
    }

    .cds--search-close{
      svg{
        fill:${props => props.theme.text};
      }
      :hover{
        background: ${props => props.theme.main};
        border-block-end:1px solid ${props => props.theme.schoolListBack}
      }
    
    }

    .cds--search-close::before{
      background-color: ${props => props.theme.schoolListBack};
      block-size: 0;
    }
    .cds--search-close:hover, .cds--search-button:hover {
      background-color:  ${props => props.theme.main};
    }
    .cds--search-close
    button{
      :hover{
        background: ${props => props.theme.main};
      }
    }
`
export const ChevronUpIcon = styled(ChevronUp) <{ 
  $highlight?: boolean; 
  $scondary?: boolean; }>`
  fill:  ${({ $secondary, $highlight }) => $highlight ? props => props.theme.titleBlue : $secondary ? props => props.theme.titleDesc : props => props.theme.text}; 
   pointer-events: none;
`
export const ChevronDownIcon = styled(ChevronDown) <{ $highlight?: boolean; $scondary?: boolean; }>`
  fill:${({ $secondary, $highlight }) => $highlight ? props => props.theme.titleBlue : $secondary ? props => props.theme.titleDesc : props => props.theme.text}; 
  pointer-events: none;
`
export const ChevronRightIcon = styled(ChevronRight) <{ $highlight?: boolean; $scondary?: boolean; }>`
  fill:  ${({ $secondary, $highlight }) => $highlight ? props => props.theme.titleBlue : $secondary ? props => props.theme.titleDesc : props => props.theme.text}; 
`

export const RecentlyViewedIcon = styled(RecentlyViewed) <{ $highlight?: boolean; $scondary?: boolean; }>`
  fill: ${({ $secondary, $highlight }) => $highlight ? props => props.theme.titleBlue : $secondary ? props => props.theme.titleDesc : props => props.theme.text}; 
`

export const SearchHistoryWrapper = styled.div`
  margin-left: 1rem;
`

export const SearchHistoryStyle = css`
  /* justify-content: flex-start; */
  gap: 1rem;
  padding-left: 0;
`
export const Dot = styled.span<{ $color?: string; }>`
  width: 0.3125rem;
  height: 0.3125rem;
  background: ${props => props.$color ?? 'var(--primary-blue)'};
  display: inline-block;
  border-radius: 1.25rem;
  margin-left: 0.375rem;
`
export const NotFoundContainer = styled.div`
margin:2rem 1rem 0 1rem;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;

  h3{
      color: ${props => props.theme.notFoundRed};
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.125rem;
      margin-top:2rem
    }

  p{
      color: ${props => props.theme.grey60};
      text-align: center;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.125rem;
      margin-top:1rem;
    }

    button{
      margin-top:2rem;
    }
`

export const NotFoundIcon = styled(DesignResearch)`
width:5rem;
height:5rem;
color: ${props => props.theme.grey60};
`

export const LayerDetailContainer = styled.div`
 height: calc(100% - 8.5rem);
 background: ${props => props.theme.main} ;
 overflow: hidden;

 @media (max-width: 768px) {
  height: calc(100% - 6rem);
 }
`