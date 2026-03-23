import styled from "styled-components";

import { Link } from "~/lib/router";

export const TopMenuWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 0.25rem;
  min-height: 2.75rem;
  padding: 0.25rem 0.875rem 0.125rem;

  .cds--btn--icon-only {
    min-inline-size: 2rem;
    min-block-size: 2rem;
    padding: 0;
  }

  .sidebar-menuIcon {
    margin-right: 0;
    align-items: center;
  }

  .cds--btn--ghost,
  .cds--btn--ghost:hover,
  .cds--btn--ghost:active,
  .cds--btn--ghost:focus {
    background: transparent;
  }

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
  align-items: center;
  color: #f4f4f4;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.5rem;
  text-decoration: none;
  outline: none;
  box-shadow: none;

  &:visited,
  &:hover,
  &:focus,
  &:active {
    color: #f4f4f4;
    text-decoration: none;
    outline: none;
    box-shadow: none;
  }
`

export const HamburgerWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  width: 100%;
  background: #161616;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  svg{
    fill:#f4f4f4 !important;
  }
`
