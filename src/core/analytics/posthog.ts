import posthog from 'posthog-js';

import { ENV, isProduction, isStaging, POSTHOG_HOST, POSTHOG_KEY } from '~/env';

import { UserInfoType } from '../auth/types/user.type';

// Only track staging and production. Local dev is intentionally excluded to
// keep test traffic out of the analytics data (a missing POSTHOG_KEY would
// also disable it, but this guards even when a dev key is configured).
export const isPostHogEnabled = Boolean(POSTHOG_KEY) && (isStaging || isProduction);

// Analytics must never break the app. Every PostHog interaction is wrapped so
// that a failure (script blocked by an ad-blocker, network error, SDK throw)
// is logged and swallowed rather than propagated to the caller.
const safely = (label: string, fn: () => void): void => {
  if (!isPostHogEnabled) return;

  try {
    fn();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[analytics] PostHog ${label} failed`, error);
  }
};

export const initPostHog = (): void => {
  safely('init', () => {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
    });

    // Stamp every event with the environment so staging and prod stay
    // distinguishable even within a single PostHog project.
    posthog.register({ environment: ENV ?? 'unknown' });
  });
};

export const capturePageview = (pathname: string): void => {
  safely('capturePageview', () => {
    posthog.capture('$pageview', {
      $current_url: `${window.location.origin}${pathname}${window.location.search}`,
    });
  });
};

export const identifyUser = (user: UserInfoType): void => {
  if (!user?.id) return;

  safely('identifyUser', () => {
    posthog.identify(String(user.id), {
      email: user.email,
      name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
      role: user.role?.name,
      is_superuser: user.is_superuser,
    });
  });
};

export const resetUser = (): void => {
  safely('reset', () => {
    posthog.reset();
  });
};
