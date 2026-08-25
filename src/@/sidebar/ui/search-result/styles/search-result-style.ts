import { ChevronDown, ChevronRight, ChevronUp, RecentlyViewed } from '@carbon/icons-react';
import { DesignResearch } from '@carbon/pictograms-react';
import styled, { css } from "styled-components";

import { Scroll } from '~/@/scroll';

export const SearchListWrapper = styled.div`
  background: ${props => (props.theme.main === '#fff' ? '#f4f4f4' : '#242424')};
  position: absolute;
  left: 0.875rem;
  right: 0.875rem;
  width: auto;
  z-index: 13;
  top: calc(100% + 0.125rem);
  max-height: 80vh;
  border: 1px solid ${props => props.theme.searchSchoolBorder};
  border-radius: 0.5rem;
  box-shadow: ${props => (props.theme.main === '#fff'
    ? '0 14px 40px 0 rgba(0, 0, 0, 0.12)'
    : '#212020 0px 14px 40px 0px')};
  overflow: hidden;

  @media (max-width:768px){
    max-height: 80vh;
  }
`
export const SearchResultScroll = styled(Scroll)`
  background: ${props => (props.theme.main === '#fff' ? '#f4f4f4' : '#242424')};
  max-height: calc(80vh - 4.5rem);
`
export const SearchTopHead = styled.span`
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.625rem 1rem;
  background: ${props => (props.theme.main === '#fff' ? '#f4f4f4' : '#242424')};
  color: ${props => props.theme.grey60};
  font-size: 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;
`
export const SearchItem = styled.div<{ $nested?: boolean; $border?: boolean; $justify?: string; $gap?: number; $history?: ReturnType<typeof css> }>`
   padding: 0.875rem 1rem;
   justify-content: ${props => props.$justify ?? 'space-between'};
   align-items: center;
   display: flex;
   width: 100%;
   margin-left: 0;
   transition: background-color 0.15s ease;
   &:hover {
     background: ${props => (props.theme.main === '#fff' ? '#e8e8e8' : '#393939')};
   }
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
      border-bottom: 0.0625rem solid ${props.theme.searchSchoolBorder};
   `}
   ${props => props.$history}

   .type-name {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.125rem;
    margin-top: 0.125rem;
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

export const DistictWrapper = styled.div`
  padding-left: 0.5rem;
  background: ${props => (props.theme.main === '#fff' ? '#f4f4f4' : '#242424')};
`

export const LeftItem = styled.h4<{ $recent?: boolean; $bold?: boolean; $highlight?: boolean; $fullWidth?: boolean }>`
  color:  ${props => props.$highlight ? props.theme.titleBlue : props.theme.text};
  font-size: 0.875rem;
  line-height: 1.25rem;
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
line-height: 1rem;
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

export const ChevronUpIcon = styled(ChevronUp) <{
  $highlight?: boolean;
  $scondary?: boolean;
}>`
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
  margin-left: 0;
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
margin: 2.5rem 1rem 1.5rem;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;

  h3{
      color: ${props => (props.theme.main === '#fff' ? '#525252' : '#C6C6C6')};
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.125rem;
      margin-top: 1.5rem;
    }

  p{
      color: ${props => (props.theme.main === '#fff' ? '#8d8d8d' : props.theme.grey60)};
      text-align: center;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.125rem;
      margin-top: 0.5rem;
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

export const LayerDetailContainer = styled.div<{ $height?: string; }>`
 height: 100%;
 background: ${props => props.theme.main} ;
 overflow: hidden;

 @media (max-width: 768px) {
  height: calc(100% - ${props => props.$height ?? '1rem'});
 }
`
