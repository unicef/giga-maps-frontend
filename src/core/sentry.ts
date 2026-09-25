import * as Sentry from '@sentry/react';

import {
  isSentryEnabled,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  SENTRY_RELEASE,
  SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE,
  SENTRY_REPLAY_SAMPLE_RATE,
  SENTRY_TRACES_SAMPLE_RATE,
} from '~/env';

let isInitialized = false;

/**
 * Initialize Sentry SDK according to Giga Maps Sentry Standards & Best Practices.
 * - Single DSN for frontend component: giga-maps-frontend
 * - Canonical environment naming: production | staging | development | local | test
 * - Release tracking: SENTRY_RELEASE
 * - Rich context with component, product, and platform tags
 */
export const initSentry = (): void => {
  if (isInitialized) return;

  if (!isSentryEnabled || !SENTRY_DSN) {
    if (import.meta.env.DEV) {
      console.info(
        '[Sentry] SDK initialization skipped (DSN not configured or environment disabled)',
        { environment: SENTRY_ENVIRONMENT }
      );
    }
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
      replaysSessionSampleRate: SENTRY_REPLAY_SAMPLE_RATE,
      replaysOnErrorSampleRate: SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE,
      initialScope: {
        tags: {
          component: 'frontend',
          product: 'giga-maps',
          project: 'giga-maps-frontend',
        },
      },
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Ignore known benign noise
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
        'CancelationError',
        'AbortError',
      ],
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome-extension:\/\//i,
        /^moz-extension:\/\//i,
      ],
      beforeSend(event, hint) {
        // Redact any potential auth headers or secret tokens from URLs/headers
        if (event.request?.headers) {
          delete event.request.headers.Authorization;
          delete event.request.headers.authorization;
          delete event.request.headers.Cookie;
          delete event.request.headers.cookie;
        }

        return event;
      },
    });

    isInitialized = true;
    if (import.meta.env.DEV) {
      console.info('[Sentry] Initialized successfully with environment:', SENTRY_ENVIRONMENT);
    }
  } catch (error) {
    console.error('[Sentry] Failed to initialize SDK:', error);
  }
};

/**
 * Capture an error from a specific UI component with rich diagnostic context.
 */
export const captureComponentError = (
  error: unknown,
  componentName: string,
  extraContext?: Record<string, unknown>
): string => {
  if (import.meta.env.DEV) {
    console.error(`[Sentry Component Error] [${componentName}]:`, error, extraContext);
  }

  return Sentry.withScope((scope) => {
    scope.setTag('component', 'frontend');
    scope.setTag('ui_component', componentName);
    scope.setContext('component_details', {
      name: componentName,
      timestamp: new Date().toISOString(),
      ...extraContext,
    });

    const errorToCapture =
      error instanceof Error ? error : new Error(typeof error === 'string' ? error : JSON.stringify(error));

    return Sentry.captureException(errorToCapture);
  });
};

/**
 * Capture an API / network failure with request context.
 */
export const captureApiError = (
  error: unknown,
  apiContext: {
    url?: string;
    method?: string;
    status?: number;
    params?: Record<string, unknown>;
    data?: unknown;
  }
): string => {
  return Sentry.withScope((scope) => {
    scope.setTag('component', 'frontend');
    scope.setTag('error_type', 'api_error');
    if (apiContext.status) {
      scope.setTag('http_status', String(apiContext.status));
      scope.setLevel(apiContext.status >= 500 ? 'error' : 'warning');
    }
    if (apiContext.url) {
      scope.setTag('api_url', apiContext.url);
    }

    scope.setContext('api_request', {
      url: apiContext.url,
      method: apiContext.method,
      status: apiContext.status,
      params: apiContext.params,
    });

    const errorToCapture =
      error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'API Request Failed');

    return Sentry.captureException(errorToCapture);
  });
};

/**
 * Set user context in Sentry when authenticated.
 */
export const setSentryUser = (user: {
  id?: string | number | null;
  email?: string | null;
  username?: string | null;
  role?: string | null;
  [key: string]: unknown;
} | null): void => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id ? String(user.id) : undefined,
    email: user.email ?? undefined,
    username: user.username ?? undefined,
    role: user.role ?? undefined,
  });
};

/**
 * Clear user context on logout.
 */
export const clearSentryUser = (): void => {
  Sentry.setUser(null);
};

/**
 * Add a breadcrumb for navigation or user actions.
 */
export const addSentryBreadcrumb = (breadcrumb: {
  category: string;
  message: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, unknown>;
}): void => {
  Sentry.addBreadcrumb(breadcrumb);
};

export { Sentry };
