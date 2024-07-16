import { styled } from "styled-components";

import { Scroll } from "~/@/scroll";

export const ApiRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const RightSectonPanel = styled(Scroll)`
    width: calc(100vw - 17rem);
    padding-bottom: 0.3rem;
`