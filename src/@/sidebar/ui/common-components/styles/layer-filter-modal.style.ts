import { PopoverContent } from "@carbon/react";
import styled, { css } from "styled-components";

export const $layerFilterModalStyle = css`
background: ${props => props.theme.main};
@media (min-width: 769px) { /* Adjust 768px to your desktop breakpoint */
display: grid;
overflow: hidden;
grid-template-columns: 100%;
grid-template-rows: auto 1fr auto;
outline: 3px solid transparent;
outline-offset: -3px;
transform-origin: top center;
width: 288px;
max-height: 100%;
position: absolute;
left: 0.5rem;
height: calc(100vh - 8.4rem);
bottom: 1.8rem;
top: auto;
}
`

export const $layerFilterHeadingStyle = css` 
color:  ${props => props.theme.text};
font-size: 1rem;
font-weight: 600;
line-height: 1.5rem; 

`

export const $layerFilterFooterStyle = css`
  display: flex;
  height: 3rem;
  justify-content: flex-end;
  margin-top: auto;
  grid-column: 1/-1;
  grid-row: -1/-1;

  .cds--btn.cds--btn--secondary{
    padding: 0.75rem;
    color:  #fff;
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    height: 3rem;
    box-shadow: none;
    background: #616161;
  }
  .cds--btn.cds--btn--primary {
    padding: 0.75rem;
    color:  #fff;
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    height: 3rem;
    box-shadow: none;
  }
`

export const MoreLayerPopOver = styled(PopoverContent)`
background:${props => props.theme.main};
padding: 1rem;
width:19rem;
height: 13rem;

@media (max-width:768px){
padding: 0.5rem;
padding-left: 1rem;
overflow-y: auto;
max-height: 25rem;
}
`

export const PopoverFilterContentConnectivitytype = styled.div`

.filter-popover-title {
    color: ${props => props.theme.text};
    font-family: "Open Sans";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    margin-bottom: 0.25rem;
  }
  
  .filter-popover-explanation {
    margin-bottom: 0.75rem;
    color:${props => props.theme.grey60};
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
  }

.cds--form-item {
  margin-top: 0.5rem;
}

.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right>.cds--radio-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
}

.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right>.cds--radio-button-wrapper>.cds--radio-button__label {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.75rem;

  >.cds--radio-button__appearance {
    width: 1.25rem;
    height: 1.25rem;
    border-color: ${props => props.theme.text};
  }

  .cds--radio-button__appearance::before {
    background-color:  ${props => props.theme.text};
  }

  >span:last-child {
    color: ${props => props.theme.text};
    font-family: "Open Sans";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }
}
`

export const PopoverFilterContentBenchmark = styled.div`
margin-top:1.5rem;
.filter-popover-title {
  color: ${props => props.theme.text};
  font-family: "Open Sans";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  margin-bottom: 0.25rem;
}

.filter-popover-explanation {
  margin-bottom: 0.75rem;
  color:${props => props.theme.grey60};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
}

.cds--form-item {
  margin-top: 0.5rem;
}
.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right>.cds--radio-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  // margin-left: 0.5rem;
  margin-bottom: 0.3125rem;
}
.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right>.cds--radio-button-wrapper>.cds--radio-button__label {
  font-size: 0.75rem;
  display: flex;
  align-items: center;

  >.cds--radio-button__appearance {
    width: 1.25rem;
    height: 1.25rem;
    border-color: ${props => props.theme.text};
  }

  .cds--radio-button__appearance::before {
    background-color: ${props => props.theme.text};
  }

  >span:last-child {
    color: ${props => props.theme.text};
    font-family: "Open Sans";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }
}

`

export const PopoverFilterContentSpeed = styled.div`
  margin-top: 1.5rem;
  .cds--checkbox-label-text{
    padding-left: 0px;
  color: ${props => props.theme.text};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
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

  .filter-popover-title {
    color: ${props => props.theme.text};
    font-family: "Open Sans";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    margin-bottom: 0.25rem;
  }
  
  .filter-popover-explanation {
    margin-bottom: 0.75rem;
    color:${props => props.theme.grey60};
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
  }
  
  >.cds--fieldset {
    padding: 0 0 0.625em 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.5rem;

    >.cds--form-item.cds--checkbox-wrapper {
      margin-bottom: 0;

      >.cds--checkbox-label {
        font-size: 0.6rem;
        align-items: center;

        >.cds--checkbox-label-text {
          margin-left: 0.5rem;
        }
      }

      >.cds--checkbox-label::before {
        height: 1.25rem;
        width: 1.25rem;
      }

      >.cds--checkbox-label::after {
        top: 0.5rem;
        left: 0.5rem;
      }

    }
  }

`

export const PopoverFilterContentCoverageConnectivityStatus = styled.div`
margin-top: 0rem;

.cds--checkbox-label-text{
  padding-left: 0px;
color: ${props => props.theme.text};
font-size: 0.75rem;
font-weight: 400;
line-height: 1rem;
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

.filter-popover-title {
  color: ${props => props.theme.text};
  font-family: "Open Sans";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  margin-bottom: 0.25rem;
}

.filter-popover-explanation {
  margin-bottom: 0.75rem;
  color:${props => props.theme.grey60};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
}
  >.cds--fieldset {
    padding: 0 0 0.625em 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.5rem;

    >.cds--form-item.cds--checkbox-wrapper {
      margin-bottom: 0;

      >.cds--checkbox-label {
        font-size: 0.6rem;
        align-items: center;

        >.cds--checkbox-label-text {
          margin-left: 0.5rem;
        }
      }

      >.cds--checkbox-label::before {
        height: 1.25rem;
        width: 1.25rem;
      }

      >.cds--checkbox-label::after {
        top: 0.5rem;
        left: 0.5rem;
      }

    }
  }
`