import { ComposedModal, ModalBody as ModalBodyNative, ModalFooter as ModalFooterNative, ModalHeader as ModalHeaderNative } from "@carbon/react";
import { css, styled } from "styled-components";

export const Modal = styled(ComposedModal) <{ $containerStyle?: ReturnType<typeof css> }>`
  > .cds--modal-container {
    background: ${props => props.theme.schoolListBack};
    ${props => props.$containerStyle}
  }
`
export const ModalHeader = styled(ModalHeaderNative) <{ $headingStyle?: ReturnType<typeof css> }>`
  > h3 {
    ${props => props.$headingStyle}
  }
  button{
  svg{
    fill:${props => props.theme.text};
  }
}
.giga-text{
  display: flex;
  color: ${props => props.theme.text};
  font-size: 2.4rem;
  font-weight: bolder;
  span:first-child {
    font-weight: 100;
  }
}

.cds--modal-close:hover {
    background-color: ${props => props.theme.main};
}
`

export const ModalBody = styled(ModalBodyNative) <{ $style?: ReturnType<typeof css> }>`
  ${props => props.$style}

  .field-wrapper{
    span{
      color:  ${props => props.theme.text};
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
    }
    input{
      background:${props => props.theme.graphWeekMonthBorder};
      color:${props => props.theme.text};
      border: none;
    }
  }
  .share-icons-container{
    span{
      color:${props => props.theme.text};
    }
    .social-share-icons{
  svg{
      fill:${props => props.theme.text};
    }
    }
  }
`

export const ModalFooter = styled(ModalFooterNative) <{ $style?: ReturnType<typeof css> }>`
  ${props => props.$style}
`


