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
import { TooltipProvider } from '~/components/ui/tooltip';

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
        families: [
          'Open Sans:100,200,300,400,500,600,700,800,900',
          'Manrope:200',
        ],
      },
    });
    // trigger set app load flag
    appLoadEvent(true);
  }, []);

  // Sync Effector theme → Tailwind CSS (data-theme + class on <html>)
  useEffect(() => {
    const root = document.documentElement;
    // Set data-theme attribute for [data-theme="..."] selectors
    root.setAttribute('data-theme', theme);
    // Set class for .light / .accessible selectors
    root.classList.remove('dark', 'light', 'accessible');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Suspense fallback={<Loading withOverlay={true} />}>
      <ThemeProvider theme={themeData[theme]}>
        <TooltipProvider>
          {useRoute(map) && <MapPage />}
          {(apiDocsRoute || adminRoute) && <AuthRoot />}
          {useRoute(aboutus) && <AboutPage />}
          {useStore(router.noMatches) && <PageNotFound />}
        </TooltipProvider>
      </ThemeProvider>
    </Suspense>
  );
};
