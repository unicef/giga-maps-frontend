import styled from "styled-components";

import { Link } from "~/lib/router";

export const TopMenuWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

/* .cds--btn--ghost:hover {
    background-color: transparent;
}
.cds--btn--ghost {
  color: transparent;
}
.cds--btn--ghost:focus {
    border-color: unset;
    box-shadow: unset;
} */

/* .cds--btn--ghost:hover, .cds--btn--ghost:active {
    color: transparent;
}
  .sidebar-menuIcon{
    left: -0.8rem !important;
    
    >svg {
      fill: #F5F5F5;
    }
  } */
   .cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
  .cds--popover-caret{
    background: ${props => props.theme.text};
  }
`

export const LogoName = styled(Link)`
  display: flex;
  color: ${props => props.theme.text};
  font-size: 1rem;
  font-weight: bolder;
  /* margin-left: -1rem; */
  img {
    height: 1rem;
    width: 4.75rem;
    margin-top: 0.3125rem;
  }
`

export const HamburgerWrapper = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
width: 100%;

  svg{
    fill:${props => props.theme.text} !important;
  }
@media (max-width: 768px) {
  position:fixed;
  top:0;
  background:${props => props.theme.main};
  padding: 0 0.5rem;
}
`