import { Dropdown, Popover, MultiSelect, Checkbox } from "@carbon/react";
import { styled } from "styled-components";
import { Scroll } from "~/@/scroll";

export const FilterPopover = styled(Popover)`
    /* position: absolute; */
    /* right: 20.5rem; */
    /* bottom: 33.5rem; */
    .cds--popover-content{
        background:${props => props.theme.main};
    }
    .cds--popover-caret{
        background-color: ${props => props.theme.main}
      }

      @media (max-width: 768px) {
        .filter-popover-content { 
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          max-inline-size: none;
          height: 100%;
          display: block;
          transform: none;
        }
      }
`

export const FilterWrapper = styled.div<{ $zIndex: number, $bottom: boolean }>`
  z-index: 99;
  background: ${props => props.theme.main};
  right: .5rem;
  border-radius: 62.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`
export const Tag = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #A2191F;
`
export const FilterButtonWrapper = styled.div<{ $iconColor?: string }>`
  position: relative;
  .cds--btn--primary, .cds--btn--primary:hover, .cds--btn--primary:active, .cds--btn--primary:focus {
    background: ${props => props.theme.main};
  }
  .cds--btn--icon-only{ 
    transform: rotate(90deg);
    border-radius: 50%;
    border: 1px solid ${props => props.theme.main};
  }
  .cds--btn--primary:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.main};
  }
  svg{
    fill: ${props => props.theme.text};
  }
  .cds--popover{
    position:relative;
    z-index:6001;
    top:-1rem;
  }
  .cds--tooltip-content {
    background: ${props => props.theme.text} !important;
    color: ${props => props.theme.main}!important;
  }
  .cds--popover-caret{
    background: ${props => props.theme.text} !important;
  }
`

export const FilterHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  @media (min-width: 769px) {
    min-width: 23rem;
  }
  >h3{
    color: ${props => props.theme.filterText};
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

export const FilterActionButtonWrapper = styled.div`
  width:100%;
  button{
    width: 50%;
    padding-right: 0;
  }
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`

export const StyledDropdownSingleSelect = styled(Dropdown)`
  padding: 0.5rem 1rem;
  .cds--list-box__field{
    background: ${props => props.theme.grey80};
    border-bottom: 1px solid ${props => props.theme.text};
  }

  .cds--list-box__label{
    color: ${props => props.theme.filterGrey};
  }

  .cds--list-box__menu-icon{
    svg{
      fill:${props => props.theme.text};
    }
  }
  
  // Style for the titleText
  .cds--list-box__label {
    color: ${props => props.theme.filterText}; 
  }

  .cds--label{
    color: ${props => props.theme.filterGrey}
  }

  .cds--list-box__menu{
    background: ${props => props.theme.grey80};
  }

  .cds--list-box__menu-item__option{
    color: ${props => props.theme.filterGrey}
  }

  .cds--list-box__menu-item--active .cds--list-box__menu-item__option {
    background: ${props => props.theme.grey90};
    color: #222;
  }
`

export const ScrollableContainer = styled(Scroll)`
  max-height: calc(100vh - 20.5rem);
  padding-bottom: 2rem;
  @media (max-width: 768px) {
    max-height: calc(100vh - 13rem);
  }
`

export const StyledApplyFilter = styled.div`
  display: flex;
  flex-direction: column;
`
export const StyledApplyFilterDropdown = styled(Dropdown)`
  padding: 1rem;
  .cds--label{
    color: ${props => props.theme.filterGrey}; 
  }

  .cds--list-box__field{
    background: ${props => props.theme.grey80};
  }

  .cds--list-box__label{
    color: ${props => props.theme.filterText}; 
  }

  .cds--list-box__menu-icon{
    svg{
      fill: ${props => props.theme.text};
    }
  }

  button {
    width: 100%;
  }
`

export const StyledTextInputContainer = styled.div`
  padding: 0.5rem 1rem;
  .group-input {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0;
  }

  .cds--label{
    color: ${props => props.theme.filterGrey};
    margin-bottom: 0.5rem;
  }
`

export const StyledMultiSelectFilterConfig = styled(MultiSelect)`
  padding: 0.5rem 1rem;

  .cds--multi-select .cds--list-box__field--wrapper {
    background-color: ${props => props.theme.grey80};
  }

  .cds--label {
    color: ${props => props.theme.filterGrey}
  }

  .cds--list-box__label{
    color: ${props => props.theme.filterText}
  }

  .cds--list-box__field--wrapper{
    border-bottom: 1px solid var(--cds-border-strong);
  }

  .cds--list-box__menu-icon{
    svg{
      fill: ${props => props.theme.text};
    }
  }
  .cds--list-box--expanded.cds--list-box--lg .cds--list-box__menu {
    max-block-size: 20rem;
    background: ${props => props.theme.grey80};
  }
  .cds--list-box__menu-item__option{
    color: ${props => props.theme.filterGrey};
    /* background: ${props => props.theme.grey90}; */
  }

  .cds--list-box__menu-item--active .cds--list-box__menu-item__option {
    /* background: ${props => props.theme.grey90}; */
    color: #222;
  }

  .cds--checkbox-label-text {
    font-size: 0.75rem;
    color: ${props => props.theme.filterText}; 
  }
  .cds--checkbox:checked + .cds--checkbox-label::before, .cds--checkbox:indeterminate + .cds--checkbox-label::before, .cds--checkbox-label[data-contained-checkbox-state=true]::before {
    background: ${props => props.theme.text};
  }
  .cds--checkbox-label::before {
    /* border-color: ${props => props.theme.filterText}; */
    background: ${props => props.theme.text};
  } 
  .cds--checkbox-label::after {
    border-block-color: ${props => props.theme.main};
    border-inline-color: ${props => props.theme.main};
  }
`

export const StyledTextInputWrapper = styled.div`
  padding: 0.5rem 1rem;
  input::placeholder{
    color: ${props => props.theme.filterText}
  }

  .cds--text-input{
    background: ${props => props.theme.grey80}
  }

  .cds--label{
    color: ${props => props.theme.filterGrey}
  }

  .cds--text-input{
    color: ${props => props.theme.filterText}
  }
`

export const StyledCheckbox = styled(Checkbox)`
  margin: 0.5rem 0;
  .cds--checkbox-label-text {
    font-size: 0.75rem;
    color: ${props => props.theme.filterText}; 
  }
  .cds--checkbox:checked + .cds--checkbox-label::before, .cds--checkbox:indeterminate + .cds--checkbox-label::before, .cds--checkbox-label[data-contained-checkbox-state=true]::before {
    background: ${props => props.theme.text};
  }
  .cds--checkbox-label::before {
    /* border-color: ${props => props.theme.filterText}; */
    background: ${props => props.theme.text};
  } 
  .cds--checkbox-label::after {
    border-block-color: ${props => props.theme.main};
    border-inline-color: ${props => props.theme.main};
  }
`

export const FilterTagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  z-index: 1;
  pointer-events: none;
  /* background: red; */
  .cds--tag {
    pointer-events: all;
  }
`