import { createEffect, sample } from 'effector';

import { getUserDetailFx } from '~/core/auth/effects/auth-api-fx';
import { onLogoutSuccess } from '~/core/auth/azure-msal/model';
import { router } from '~/core/routes';

import {
  capturePageview,
  identifyUser,
  initPostHog,
  resetUser,
} from './posthog';

initPostHog();

const trackPageviewFx = createEffect((pathname: string) => {
  capturePageview(pathname);
});

const identifyUserFx = createEffect((user: Parameters<typeof identifyUser>[0]) => {
  identifyUser(user);
});

const resetUserFx = createEffect(() => {
  resetUser();
});

// Capture the landing pageview. A `source`-only sample fires on store
// *updates* only, so the initial pathname would otherwise be missed.
trackPageviewFx(router.pathname.getState());

sample({
  source: router.pathname,
  target: trackPageviewFx,
});

sample({
  clock: getUserDetailFx.doneData,
  target: identifyUserFx,
});

sample({
  clock: onLogoutSuccess,
  target: resetUserFx,
});
