import React from 'react';
import styled from 'styled-components';

import { Children } from '~/lib/types';

const AppStyle = styled.div`
.app {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  width: 100%;
  height: 100%;
  }
`

export const Layout = ({ children }: Children) => (
  <AppStyle >
    {children}
  </AppStyle>
);
