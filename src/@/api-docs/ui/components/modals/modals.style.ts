import { ComboBox, DatePicker, FilterableMultiSelect } from "@carbon/react";
import { css, styled } from "styled-components";

export const $dowloadApiModalContainerStyle = css`
   width: 38rem;
   height: auto;
   background:#fff;
   button{
    svg{
      fill:#222 !important;
    }
  }
  .cds--modal-close:hover {
      background-color: transparent !important;
  }
`

export const $modalHeadingStyle = css`
   color: var(--text-text-primary, #161616);
   font-family: Open Sans;
   font-size: 1.25rem;
   font-style: normal;
   font-weight: 500;
   line-height: 1.75rem;
`

export const $modalBodyStyle = css`
   margin-bottom: 1.5rem;
`

export const $modalFooterStyle = css`
   height: 3rem;

  button {
    height: 2.75rem !important;
    flex: 1 !important;
    box-shadow: none !important;
  }
`
export const ModalDescription = styled.p`
    color: var(--primary-black-80-giga-dark-grey);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
    letter-spacing: 0.01rem;
`

export const TextInputWrapper = styled.div`
   margin-top: 1.5rem;
 
   >.explore-api-text {
     color: var(--text-text-secondary, #525252);
     font-size: 0.75rem;
     font-style: normLorem ipsum dolor sit lorem a amet, consectetur adipiscing elital;
     font-weight: 400;
     line-height: 1rem;
     letter-spacing: 0.02rem;
   }
 
   >.explore-text-input {
     margin-top: 0.5rem;
   }
 `

export const DontHaveAccountContainer = styled.div`
   margin-top: 0.75rem;
   display: flex;
   flex-direction: row;
   align-items: center;
 
   >p {
     color: var(--text-text-primary, #161616);
     font-family: Open Sans;
     font-size: 0.875rem;
     font-style: normal;
     font-weight: 400;
     line-height: 1.25rem;
     letter-spacing: 0.01rem;
   }
 
   >button {
     margin-left: 0.5rem;
   }
 `

export const SelectCountry = styled(ComboBox)`
    margin-top: 1.5rem;
    .cds--list-box {
      background: white;
    }
    .cds--list-box__menu{
      height:${(props) => props.height} !important;
      max-height: 10rem !important; 
    overflow-y: auto;
    }
 `

export const CountryMultiSelect = styled(FilterableMultiSelect)`
    margin-top: 1.5rem;
    .cds--list-box {
      background: white;
    }
    .cds--list-box__menu{
      height:${(props) => props.height} !important;
      max-height: 10rem !important; 
    overflow-y: auto;
    }
    .cds--list-box__field .cds--tag button svg {
      fill: #fff !important;
    }
 `

export const SelectContainer = styled(FilterableMultiSelect)`
margin-top: 1.5rem;
`

export const DatePickerContainer = styled(DatePicker)`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  >.cds--date-picker.cds--date-picker--range {
      width: 100%;
      gap: 1rem;

      >.cds--date-picker-container {
        width: 50%;

        >.cds--date-picker-input__wrapper {
          >input {
            width: 100%;
            color: var(--text-text-tertiary, #6F6F6F);
            font-family: Open Sans;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.25rem;
            letter-spacing: 0.01rem;
          }
        }
      }
    }
 `

export const SucccessMessageContainer = styled.div`
  >h3 {
    color: var(--text-text-primary, #161616);
    text-align: center;
    font-family: Open Sans;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.375rem;
    margin-top: 1rem;
  }

  >p {
    color: var(--text-text-secondary, #474747);
    text-align: center;
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    margin-top: 0.5rem;
  }
`

export const TopLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  span {
    position: relative;
  }
  .cloud-protect-icon {
    color: #595959;
  }
  .check-mark-icon {
    color: #46C66D; 
  }
  svg:nth-child(2) {
    position: absolute;
    top: 1.2rem;
    left: 1.2rem;
  }
`
export const ExtensionDateWrapper = styled.div`
  margin-top:1.5rem;
`

export const NumberPickerContainer = styled.div`
  width:100%;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  >div:nth-child(1) {
    width:48%;
  }
  >div:nth-child(2) {
    width:48%;
  }
`