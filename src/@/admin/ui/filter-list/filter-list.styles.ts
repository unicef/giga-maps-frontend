import styled from "styled-components";
import { Scroll } from "~/@/scroll";
import { MultiSelect, TextInput } from '@carbon/react';

export const FilterScroll = styled(Scroll)`
  max-height: calc(100vh - 11rem);
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