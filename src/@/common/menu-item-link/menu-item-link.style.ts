import { ContainedListItem, SideNavLink } from '@carbon/react';
import styled, { css } from 'styled-components';


export const MenuItemBlank = styled(SideNavLink)`
display: flex;
align-items: center;
padding: 0.8rem 1rem 0.8rem 1rem !important;
cursor: pointer; 
color: ${props => props.theme.main};
&:hover {
   background: ${props => props.theme.text} !important;
  .cds--side-nav__link-text {
    color:  ${props => props.theme.main} !important;
    font-weight: normal;
  }
}

>span.cds--side-nav__link-text {
  color:  ${props => props.theme.text};
  font-weight: normal;
}
>.cds--side-nav__icon {
  margin-right: 0.7rem;
}
.cds--side-nav__icon svg{
  fill: ${props => props.theme.text};
}
&:hover .cds--side-nav__icon svg {
  fill: ${props => props.theme.main};
}
`

export const MenuItem = styled(ContainedListItem) <{ $active?: boolean }>`
  .cds--contained-list-item__content:not(:disabled):hover {
    color: ${props => props.theme.main};
    background:${props => props.theme.text};
  }

.cds--contained-list-item__content {
display: flex;
align-items: center;
padding: 0.8rem 1rem 0.8rem 1rem !important;
cursor: pointer;
${(props) => props.$active && css`
  color: ${props => props.theme.main} !important;
  background:${props => props.theme.text};
`}
}
>.cds--contained-list-item__icon, >.cds--side-nav__icon {
  margin-right: 0.7rem;
}

>.cds--contained-list-item__content, >.cds--side-nav__link {
  color: ${props => props.theme.text};
  font-family: Open Sans;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  
}
`

export const SideBarMenuList = styled.div<{ $style?: ReturnType<typeof css> }>`
background: ${props => props.theme.main};
height: calc(100% - 3rem);
top:3rem;
width:100%;
    position: absolute;
    z-index: 6;
.cds--contained-list-item:not(:last-of-type)::before {
  background-color: ${props => props.theme.main}  !important;
}

@media (max-width:768px){
  position: fixed;
}
${props => props.$style}
`
export const MobileFooterContainer = styled.div`
position: fixed;
    bottom: 0;
    padding: 1rem;
    display: flex;
    align-items: center;

     .link {
    font-size: 0.75rem;
    margin-left: 0.75rem;
    text-transform: none;
  }

  a {
    margin-left: .5rem;
  }

  p{
    font-size: 0.75rem;
    color: ${props => props.theme.text};
  }
  svg{
    fill: ${props => props.theme.text};
  }
`
