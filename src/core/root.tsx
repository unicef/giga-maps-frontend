import '@carbon/styles/css/styles.css';

import { Loading } from '@carbon/react';
import { useStore } from 'effector-react';
import { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import WebFont from 'webfontloader';

import { aboutus, admin, apiDocs, map, router } from '~/core/routes';
import { useRoute } from '~/lib/router';

import { appLoadEvent } from './init';
import PageNotFound from './page-no-found';
import { $theme, themeData } from './theme.model';

const AboutPage = lazy(async () => import('~/@/about-giga-map/ui'));
const MapPage = lazy(async () => import('@/map/ui'));
const AuthRoot = lazy(async () => import('./auth-root'));


export const Root = () => {
  const theme = useStore($theme);
  const apiDocsRoute = useRoute(apiDocs);
  const adminRoute = useRoute(admin);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Open Sans:100,200,300,400,500,600,700,800,900&display=swap'],
      },
    });
    // trigger set app load flag
    appLoadEvent(true);
  }, []);

  return (
    <Suspense fallback={<Loading withOverlay={true} />}>
      <ThemeProvider theme={themeData[theme]}>
        <>
          {useRoute(map) && <MapPage />}
          {(apiDocsRoute || adminRoute) && <AuthRoot />}
          {useRoute(aboutus) && <AboutPage />}
          {useStore(router.noMatches) && <PageNotFound />}
        </>
      </ThemeProvider>
    </Suspense>
  );
};
