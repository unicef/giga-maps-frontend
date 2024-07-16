import { Button, Popover, PopoverContent } from "@carbon/react";
import styled, { css } from "styled-components";

import { ObjectType } from "~/core/global-types";



export const $tourStartModalHeader = css`
color: var(--text-text-inverse, ${props => props.theme.text});
font-size: 0.875rem;
font-weight: 400;
line-height: 1.125rem;
margin-bottom: 4px;
`

export const $tourStartModalContainer = css`
  width:600px;
  padding: 32px 40px 24px 40px;
  background:${props => props.theme.main};
  .cds--modal-close{
    display:none;
  }
  .cds--modal-header{
padding: 0;
  }
 @media (max-width:768px){
  width: 100%;
  padding: 2rem;
 }
`

export const $tourEndModalContainer = css`
  width:600px;
  background:#393939;
  .cds--modal-close{
    display:none;
  }
  @media (max-width:768px){
  width: 100%;
  padding: 0;
 }

`
export const $tourStartModalBody = css`
padding: 0;
margin:0;
h3{
  color: var(--text-text-inverse, ${props => props.theme.text});
  margin-top:1rem;
/* Body styles/Body Compact 01 */
font-family: Open Sans;
font-size: 0.875rem;
font-style: normal;
font-weight: 400;
line-height: 1.125rem; /* 128.571% */
}

p{
  color: var(--text-text-on-color, ${props => props.theme.text});
margin-top:1rem;
/* Utility styles/Helper Text 01 */
font-family: Open Sans;
font-size: 0.75rem;
font-style: normal;
font-weight: 400;
line-height: 1rem; /* 133.333% */
letter-spacing: 0.02rem;
}


`
export const TourStartDescription = styled.div`
color: var(--text-text-on-color, ${props => props.theme.text});
font-size: 0.75rem;
font-weight: 400;
line-height: 1rem;
letter-spacing: 0.02rem;
padding-top: 1rem;

a{
  color: #0f62fe;
}
`
export const BottonContainer = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 4.375rem;
flex-flow: wrap;

button{
  padding-right: 1.5rem;
.cds--btn__icon{
    right: 0.3rem !important;
  }
}

@media(max-width: 768px){
  margin-top: 2rem;
}
`

export const TourStartModalFooter = styled.div`
margin-top:1rem;
display:flex;
align-items: center;
justify-content:space-between;
margin-top: 70px;
`

export const SkipTourButton = styled(Button)`
  height: 1.65rem !important;
  width: max-content !important;
  box-shadow: none !important;
  flex: unset !important;
`

export const StartTourButton = styled(Button)`
  width: 68px !important;
  max-width: 68px !important;
 
.cds--btn__icon {
  top: 0.4rem;
        right: 0.5rem !important;
  }
`

export const TourStartOverlay = styled.div<{ $background?: string }>`
    height: 100vh;
    width: 100vw;
    position: absolute;
    z-index: 6;
    overflow: hidden;
    background: ${(props) => (props.$background ?? 'transparent')};
`

export const CenterPointer = styled.div`
    position: absolute;
    left: 50%;
    pointer-events: none;
    background: transparent;
    top: 50%;
    transform: translate(-50%, -50%);
`
export const CustomPopover = styled(Popover) <{ $style?: ObjectType }>`
  ${(props) => (!!props.$style ? props.$style : '')};
  .cds--popover-caret{
    background: ${props => props.theme.main};
  }
`

export const CircleWrapper = styled.div<{ $style?: ReturnType<typeof css> }>`
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      ${(props) => (!!props.$style ? props.$style : '')};
`
export const OuterCircleDot = styled.div<{ $style?: ReturnType<typeof css> }>`
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    border: 2px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
    z-index: 1;
    ${(props) => (!!props.$style ? props.$style : '')};
`

export const InnerCircleDot = styled.div<{ $style?: ReturnType<typeof css> }>`
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    ${(props) => (props.$style && props.$style)};
    position: absolute;
    top: 50%;  
    left: 50%; 
    transform: translate(-50%, -50%);
    z-index: 1;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-delay: 0.2s;
    animation-direction: alternate;
    transform-origin: top left;
`

export const PopoverContentBox = styled(PopoverContent)`
padding:1rem;
background: ${props => props.theme.main};
min-width: 18rem;
width: 18rem;
@media(max-width: 768px){
  width: calc(100vw - 3rem);
  min-width: calc(100vw - 3rem);
  overflow: auto;
}
`
export const CurrentStepNumber = styled.p`
padding:0rem 0.5rem;
color:${props => props.theme.titleDesc};
font-size: 0.75rem;
font-weight: 400;
line-height: 1rem; 
letter-spacing: 0.02rem;
`

export const PopoverDescription = styled.p`
padding:0rem 0.5rem;
color:  ${props => props.theme.text};
font-size: 0.75rem;
font-weight: 400;
line-height: 1rem;
letter-spacing: 0.02rem;
margin-top:1rem;
`

export const SubStepsContainer = styled.div`
padding:0rem 0.5rem;
margin-top:1rem;
display:flex;
align-items:center;
justify-content: start;
`
export const SubStepsDots = styled.div`
  background:${(props) => (props.color)};
  margin-right:0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
`
export const ActionWrapper = styled.div`
margin-top:1rem;
display:flex;
align-items:center;
justify-content:space-between;
`
export const NextPreviousWrapper = styled.div`
.previous{
  margin-right: 0.5rem;
  svg{
    fill: ${props => props.theme.text};
  }
}
`

export const NextSubStepButton = styled(Button)`
height: 1.65rem !important;
  width: content-fit !important;
  box-shadow: none !important;
  flex: unset !important;
`

export const HighlightBox = styled.div<{ $style?: ObjectType }>`
  box-shadow: rgba(20, 20, 21, 0.84) 0px 0px 1px 2px, rgba(20, 20, 21, 0.84) 0px 0px 0px 1000vh;
  ${(props) => (!!props.$style ? props.$style : '')};
`

export const ClonedContainer = styled.div`
  pointer-events: none;
  padding: 0.5rem 0 0 0.5rem;
`