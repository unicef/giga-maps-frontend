import styled from "styled-components";
import { Scroll } from "~/@/scroll";
import { MultiSelect, Select, TextInput } from '@carbon/react';

export const FilterScroll = styled(Scroll)`
  max-height: calc(100vh - 13.1rem);
`

export const FilterFormScroll = styled(Scroll)`
  max-height: calc(100vh - 3.1rem);
`

export const ViewFilterWrapper = styled.div`
  padding: 0rem 1rem;
`

export const FilterHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  h6 {
    font-size: 0.875rem;
    color: #f5f5f5;
    padding-top: 1rem;
  }
`

export const FilterInputLabel = styled.div`
  color: #c0c0c0;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;

  &.center-items {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cds--radio-button:checked + .cds--radio-button__label .cds--radio-button__appearance::before {
    background-color: #c0c0c0;
  }
  .cds--checkbox-label::before, .cds--radio-button__appearance, .cds--radio-button:checked + .cds--radio-button__label .cds--radio-button__appearance {
    border-color: #c0c0c0;
  }
  .cds--label {
    color: #c0c0c0;
  }
  .cds--btn--ghost.cds--btn--icon-only .cds--btn__icon path:not([data-icon-path]):not([fill=none]), .cds--btn--ghost.cds--btn--icon-only .cds--btn__icon {
    fill: #c0c0c0;
  }
`

export const SelectDropdown = styled(Select)`
  margin-top: 0.5rem;
  .cds--label{
    color: #c0c0c0
  }
  .cds--select-input {
    background: #333333;
    color: #f5f5f5;
  }
  .cds--list-box__label{
    color: #f5f5f5;
  }
  svg{
    fill: #f5f5f5;
  }
`
export const MultiSelectConfig = styled(MultiSelect)`
  margin-top: 0.5rem;
  .cds--label{
    color: #c0c0c0
  }
  .cds--list-box__field--wrapper{
    background: #333333;
  }
  .cds--list-box__label{
    color: #f5f5f5;
  }
  .cds--list-box__menu-icon{
    svg{
      fill: #f5f5f5;
    }
  }
`

export const FilterTextInput = styled(TextInput)`
  .cds--text-input{
    background: #333333;
    color: #f5f5f5;
  }

  .cds--text-input::placeholder{
    color: #f5f5f5
  }
  .cds--text-input:disabled { 
    color: #f5f5f5; // disable color
    -webkit-text-fill-color: #f5f5f5;
    opacity: 0.4;
  }
  input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus {
    box-shadow: 0 0 0 1000px #333333 inset;
    -webkit-text-fill-color: #f5f5f5
  }
`

export const FilterForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const FormFieldsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const FormFieldsContainer = styled.div`
  width: 90%;
`

export const ButtonWrapper = styled.div`
  Button{
    width: 50%;
  }
`