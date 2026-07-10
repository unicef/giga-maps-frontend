import posthog from 'posthog-js';

import { POSTHOG_HOST, POSTHOG_KEY } from '~/env';

import { UserInfoType } from '../auth/types/user.type';

export const isPostHogEnabled = Boolean(POSTHOG_KEY);

export const initPostHog = (): void => {
  if (!isPostHogEnabled) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  });
};

export const capturePageview = (pathname: string): void => {
  if (!isPostHogEnabled) return;

  posthog.capture('$pageview', {
    $current_url: `${window.location.origin}${pathname}${window.location.search}`,
  });
};

export const identifyUser = (user: UserInfoType): void => {
  if (!isPostHogEnabled) return;

  posthog.identify(String(user.id), {
    email: user.email,
    name: `${user.first_name} ${user.last_name}`.trim(),
    role: user.role.name,
    is_superuser: user.is_superuser,
  });
};

export const resetUser = (): void => {
  if (!isPostHogEnabled) return;

  posthog.reset();
};
