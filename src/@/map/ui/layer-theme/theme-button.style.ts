import { Checkbox, CheckboxGroup, IconButton, Popover, RadioButton, RadioButtonGroup } from "@carbon/react";
import { styled } from "styled-components";

export const ThemeWrapper = styled.div<{ $zIndex: number, $bottom: boolean }>`
    z-index: ${(props) => (props.$zIndex)};
    background: ${props => props.theme.main};
    border-radius: 62.5rem;
    margin-top:0.5rem;
    @media (max-width:768px){
        bottom:${(props) => props.$bottom ? "calc(60vh + 0.5rem)" : "calc(40vh + 0.5rem)"}
    }
`
export const ZoomButtonWrapper = styled.div`
    z-index: 1;
    margin-bottom:.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .cds--popover{
    position:relative;
    z-index:6001;
    top:-1rem;
  }
  .cds--tooltip-content {
      background: ${props => props.theme.text} !important;
      color: ${props => props.theme.main}!important;
    }
    .cds--btn:not(.cds--btn--disabled) {
    background: ${props => props.theme.main};
  }
`

export const ButtonWrapper = styled(IconButton)`
    width: 100%;
    background: ${props => props.theme.main};
    min-height: 1.3rem;
    max-height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem;
    width: 1.5rem;
    cursor:pointer;
    svg{
        fill:${props => props.theme.text} !important;
    }
    .cds--popover-caret{
        background: ${props => props.theme.text};
    }
`
export const ButtonWrapperUp = styled(ButtonWrapper)`
    border-top-right-radius: 62.5rem;
    border-top-left-radius: 62.5rem;
`
export const ButtonWrapperDown = styled(ButtonWrapper)`
    border-bottom-right-radius: 62.5rem;
    border-bottom-left-radius: 62.5rem;
`

export const CustomePopover = styled(Popover)`
    .cds--popover-content{
        background:${props => props.theme.main};
    }
    .cds--popover-caret{
        background-color: ${props => props.theme.main}
      }
`

export const ThemeHeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 17rem;
    justify-content: space-between;
    padding: 1rem;

    >h3{
        color: ${props => props.theme.text};
        font-family: Open Sans;
        font-size: 1rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.5rem; 
    }
    button {
        svg {
           fill: ${props => props.theme.text} !important ;
        }
    }
`

export const CustomRadioButton = styled(RadioButton)`
    padding: 0.5rem 0rem 0rem 0rem ;

    label{
        font-size: 0.75rem;
    } 
    .capitalize {
      text-transform: capitalize;  
    }
    .cds--radio-button__appearance{
        border-color: var(--cds-icon-primary, ${props => props.theme.text}) !important;
    }
    .cds--radio-button__label-text{
        color:${props => props.theme.text};
        font-size: 0.75rem;
    }
    .cds--radio-button:checked+.cds--radio-button__label .cds--radio-button__appearance::before {
        background-color: var(--cds-icon-primary, ${props => props.theme.text}) !important;
    }
`

export const CustomCheckbox = styled(Checkbox)`
    padding: 0.5rem 0rem 0rem 0rem ;

    label{
        font-size: 0.75rem;

        .cds--checkbox-label-text{
            margin-left:0.5rem;
        }
    }
`

export const ThemeActionButtonWrapper = styled.div`
    width:100%;
    Button{
        width:50%;
    }
`

export const RadioButtonGroupWrapper = styled(RadioButtonGroup)`
    
    padding: 0rem 1rem ;
    margin-bottom: 1.5rem;
    fieldset{
        flex-direction: column;
        align-items: flex-start;
    }

    .cds--label{
        color:#9E9E9E;
    }
`

export const CheckboxGroupWrapper = styled(CheckboxGroup)`
    padding: 0rem 1rem ;
    margin-bottom: 1.5rem;
    .cds--label{
        color:#9E9E9E;
    }
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
    fieldset{
            flex-direction: column;
            align-items: flex-start;
        }
        .cds--checkbox-label-text{
            color:${props => props.theme.text};
        }
        .cds--checkbox:checked+.cds--checkbox-label::before,.cds--checkbox-label::before {
            border: 1px solid ${props => props.theme.text};
        }
`

export const BroadcastButton = styled.div`
position:fixed;
z-index:10;
top:1rem;
display: flex;
align-items: center;
flex-direction: column;
right: 0.5rem;

@media (max-width:768px){
    top:6.5rem;
}
`
export const TakeTourWrapper = styled.div<{ $bottom: boolean }>`
z-index: 1;
position:fixed;
right:.5rem;
bottom:2.5rem;

 @media (max-width:768px){
     bottom:${props => props.$bottom ? "calc(60vh + 1rem)" : "calc(40vh + 0.5rem)"};
 }
`

export const TakeTour = styled.div`
width: 2rem;
height: 2rem;
border-radius: 1.25rem;
background:  #474747;
cursor: pointer;
display: flex;
    align-items: center;
    justify-content: center;

.takeTour{
    fill:#fff;
}
`