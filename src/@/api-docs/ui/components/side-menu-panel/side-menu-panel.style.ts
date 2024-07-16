import { styled } from "styled-components";

export const SidePanelWrapper = styled.div`
  width: 17rem;
  position: relative;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
  background: ${props => props.theme.main};
    color: #fff;
`
export const HamburgerMenu = styled.div`
padding-left: 0.5rem;
`

export const LoginSignupWrapper = styled.div`
  padding: 1.5rem 1rem 1.5rem 1rem;

  >button {
    width: 100%;
  }
`

export const BorderLine = styled.span`
  width: 100%;
  height: 0.0625rem;
  background: #E6E6E6;
  display: block;
`