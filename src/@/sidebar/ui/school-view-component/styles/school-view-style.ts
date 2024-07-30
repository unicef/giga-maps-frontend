import { Accordion } from "@carbon/react";
import styled from "styled-components";

import { Scroll } from "~/@/scroll";


export const MultischoolBottomInfoItem = styled.div`
margin-top:0.75rem;
margin-right:1.5rem;
display: flex;
    align-items: center;
  svg{
    width: 0.75rem;
height: 0.75rem;
    fill:${props => props.theme.text};
  }
`

export const MultischoolBottomInfo = styled.div`
      display: flex;
    padding-left: 1rem;
    flex-direction: column;
    .multi-school-bottom-info{
       display: flex;
    align-items: center;
    }
`

export const AccordionTitle = styled.span`
  position: relative;
  left: 2.5rem;
  
  display: block;
  top: -0.35rem;
  color:${props => props.theme.text};
  font-size: 0.875rem;
font-weight: 600;
line-height: 1.125rem; 
letter-spacing: 0.01rem;
`

export const ConnectivityStatusCircle = styled.div<{ $color?: string; }>`
  background: ${props => props.$color} ;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 1.25rem;
  opacity: 0.65;
`
export const SchoolTitleWrapper = styled.div`
display:flex;
align-items:center;
margin-left: 0.3rem;
p{
  width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  color:  ${props => props.theme.text};
font-family: "Open Sans";
font-size: 0.875rem;
font-style: normal;
font-weight: 600;
line-height: 1.125rem; /* 128.571% */
letter-spacing: 0.01rem;
margin-right: 0.35rem;
}

@media(min-width:1584px){
  p{
    width: 11rem;
  }
}
`

export const MultiSchoolAccodion = styled.div`
    width: 17.5rem;
    @media (min-width:1584px){
      width: 18rem;
    }

    .cds--accordion__heading{
      justify-content: space-between !important;

    }
.cds--accordion__heading:focus::before {
    box-sizing: border-box;
    border: none;
}
    @media (max-width:768px){
      width: 100%;
    }
`

export const MultiSchoolContainer = styled.div`
  width: 100%;
  margin: 0;
  position: relative;
`

export const SchoolMultiAccordion = styled(Accordion)`
    .cds--accordion__title {
      padding-bottom: 0.5rem;
      width: 23rem;
      white-space: nowrap;
      margin: 0;
      direction: ltr;
      padding-left: 0.125rem;
      padding-top: 1rem;
    }
  .cds--accordion__item--active,
  .cds--accordion__item {
    border-top: none;
    /* border-bottom: none; */
  }

  .cds--accordion__title {
    // margin: 0.88rem 0rem 0rem 1rem;
    padding-right: 0;
  }
  .cds--accordion__content {
    padding: 0;
    margin-left: 0;
  }

  .cds--accordion__arrow {
    align-self: flex-start;
    margin-top: 0.7rem;
    fill:${props => props.theme.text};
  }
  .cds--accordion__item:last-child{
    border-top: 1px solid ${props => props.theme.schoolListBack} ;
    border-bottom: 1px solid ${props => props.theme.schoolListBack} ;
    padding-top: 0.4rem;
  }

  .cds--accordion__heading:hover::before {
    background-color: ${props => props.theme.main};
  }
`

export const SchoolScrollView = styled(Scroll)`
    //max-height: calc(100% - 8rem);   
     //max-height: calc(100vh - 19rem);
    //max-height: calc(100vh - 16.5rem);
    max-height: 100% !important;
    height: calc(100% - 2rem) !important;
    
    @media (max-width:768px){
      // max-height: calc(100% - 26rem) !important;
      // max-height: 100% !important;
      height: calc(100% - 7rem) !important;
    }
`

export const SchoolDetailTitle = styled.h2`
    color:  ${props => props.theme.text};
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: 0.01rem;
`
export const SchoolDetailInfo = styled.h2`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  // padding: 0rem 0rem 0.88rem 0rem;
  width: inherit;
  // max-height: 11.2rem;
  overflow-y: auto;
  width: 100%;
`

export const SchoolDetailItem = styled.div`
  padding: 0.75rem 0.5rem;
  overflow: hidden;
  word-wrap: break-word;
  padding-left: 0;
p {
  color:   ${props => props.theme.schoolId};
  font-family: Open Sans;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-bottom: 0.25rem;
  /* 133.333% */
}

span {
  display: block;
  color: ${props => props.theme.text};
  font-family: Open Sans;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  /* 128.571% */
}
`

export const SchoolInformationWrapper = styled.div`
  padding: 1rem;
  color:${props => props.theme.text};
  padding-top: 2rem;
`

export const SchoolInfoContainer = styled.div`
display: grid;
  grid-template-columns: 1fr 1fr;
    width: 100%;
`
export const SingleInfoContainer = styled.div<{ $width?: boolean }>`
    display: flex;
    align-items: center;
    margin-top: 0.75rem;
svg{
  width: 0.75rem;
height: 0.75rem;
fill:${props => props.theme.text};
margin-right:0.25rem;
}

p{
  color: ${props => props.theme.titleDesc};
font-size: 0.75rem;
font-style: normal;
font-weight: 400;
line-height: 1.125rem; 
overflow: hidden;
text-overflow: ellipsis;
text-transform: capitalize;
width: ${props => props.$width ? "100%" : "6.4rem"};
.lowercase {
  text-transform: lowercase;
}

}
`