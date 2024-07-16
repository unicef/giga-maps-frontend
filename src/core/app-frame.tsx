import { Children } from '~/lib/types';

import { ScrollStyle } from '@/scroll';

import { GlobalStyle } from './global-style';

export const AppFrame = ({ children }: Children) => (
  <>
    <GlobalStyle />
    <ScrollStyle />
    {children}
  </>
);
