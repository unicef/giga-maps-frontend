import { Button, IconButton, Search } from '@carbon/react';
import styled, { css } from 'styled-components';

export const SearchContainer = styled(Search) <{ $isMobile: boolean }>`
/* .cds--search-input:focus{
  outline:none;
} */

input{
padding: 0 2.5rem 0 0.5rem !important;
border-bottom: 1px solid ${props => props.theme.main};
background: ${props => props.theme.main};
color: ${props => props.theme.text};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
}
input::placeholder{
  color: #6F6F6F;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
}
.cds--search-magnifier{
  
  svg{
    display: ${props => props.value ? 'none' : 'inline-block'};
    fill:${props => props.theme.text};
    left: 9.125rem
  }
}
.cds--search-close{
  svg{
    fill:${props => props.theme.text};
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
.cds--search-close
button{
  :hover{
    background: transparent;
  }
}
${props => props.$isMobile && css`
  /* .cds--search { */
    position: fixed;
    top: 0;
    left: 0;
  /* } */
  .cds--search-close--hidden {
    opacity: 1;
    visibility: visible;
  }
`}

`

export const SearchWrapper = styled.div`
display:flex;
/* flex-direction: row-reverse; */
align-items:center;
height:3.1rem;

.cds--btn--primary:hover{
    background-color: ${props => props.theme.main} !important; 
  }

  .cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
  .cds--popover-caret{
    background: ${props => props.theme.text};
  }
  
.search-icon{
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  fill:#fff;
}
svg{
    fill:${props => props.theme.text} !important ;
  }
@media (max-width:768px){
  position: fixed;
  /* width: calc(100% - 2rem); */
  width: auto;
  top: 0rem;
  z-index: 2;
  right: 0;
  flex-direction: row-reverse;
}

`

export const BackButton = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
    padding-left:0.5rem;
    `
export const CountrySearchIcon = styled(Button)`

/* background:rgb(0, 0, 0); */
background: ${props => props.theme.main};
padding-right: 0.5rem;
padding-left: 0.688rem;
.label-size {
  font-size: 0.75rem;
}
.cds--btn--primary:hover{
    background-color: ${props => props.theme.main} !important; 
  }
  .cds--btn--primary:active {
    background-color: ${props => props.theme.main} !important;
}

svg{
  margin-right: 0.20rem;
  fill:${props => props.theme.text};
}

@media (max-width:768px){
  background: ${props => props.theme.main};

  .cds--btn--primary:hover{
    background-color: ${props => props.theme.main} !important; 
  }
  .cds--btn--primary:active {
    background-color: ${props => props.theme.main} !important;
}

}
`