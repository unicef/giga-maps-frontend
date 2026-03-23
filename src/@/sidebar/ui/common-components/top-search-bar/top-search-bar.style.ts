import { IconButton, Search } from '@carbon/react';
import styled, { css } from 'styled-components';

export const SearchContainer = styled(Search) <{ $isMobile: boolean }>`
  width: 100%;

  .cds--search {
    display: flex;
    align-items: center;
    min-block-size: 2.625rem;
    background: #f4f4f4;
    border-radius: 0 0.5rem 0.5rem 0;
    overflow: hidden;
  }

input{
border-bottom: none;
background: #f4f4f4;
color: #161616;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0 !important;
  padding-left: 2.875rem !important;
  text-align: left;
}
input::placeholder{
  color: #6F6F6F;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  text-align: left;
}
.cds--search-magnifier{
  left: 0.875rem;
  z-index: 1;
  color: #161616;
  svg{
    fill:#161616 !important;
    width: 1rem;
    height: 1rem;
  }
}
.cds--search-close{
  color: #161616;
  svg{
    fill:#161616 !important;
  }
  :hover{
    background: transparent;
    border-block-end:1px solid transparent
  }

}
.cds--search-close::before{
  background-color: transparent;
  block-size: 0;
}
.cds--search-close:hover, .cds--search-button:hover {
  background-color:  transparent;
}
.cds--search-magnifier {
  background: #f4f4f4;
}
.cds--search-close
button{
  :hover{
    background: transparent;
  }
}
${props => props.$isMobile && css`
  .cds--search-close--hidden {
    opacity: 1;
    visibility: visible;
  }
`}

`

export const SearchWrapper = styled.div`
display:flex;
align-items:center;
gap: 0;
padding: 0.5rem 0.875rem 0;
background: #161616;

.cds--btn--primary:hover{
    background-color: #f4f4f4 !important; 
  }

 .cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
 .cds--popover-caret{
   background: ${props => props.theme.text};
  }
  
.search-icon{
  height: 1rem;
  width: 1rem;
  fill:#f4f4f4;
  flex-shrink: 0;
}
svg{
    fill:#f4f4f4 !important ;
  }
@media (max-width:768px){
  width: 100%;
}

`

export const BackButton = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
    padding-left:0.5rem;
    `
export const CountrySearchIcon = styled(IconButton)`
background: #dfdfdf;
border-radius: 0.5rem 0 0 0.5rem;
overflow: hidden;

.cds--popover,
.cds--tooltip-content,
.cds--popover-caret {
  display: none !important;
}

.cds--btn,
.cds--btn--primary,
.cds--btn--primary:hover,
.cds--btn--primary:active,
.cds--btn--primary:focus,
.cds--btn--primary:focus-visible {
  background: #dfdfdf;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: none;
  outline: none;
}

.cds--btn::before {
  display: none;
}

.cds--btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  min-inline-size: 3.25rem;
  min-block-size: 2.625rem;
  padding-inline: 0.625rem;
}

svg{
  fill:#161616 !important;
}
`
