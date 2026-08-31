import { isProd } from './lib/utils/index';
// See: https://vitejs.dev/guide/env-and-mode
// You can reference vars from .env as "import.meta.env.VITE_VAR_NAME"

export enum Environment {
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production',
  local = 'local',
}

/**
 * Canonical Sentry Environments according to Sentry Standards & Best Practices:
 * 'production' | 'staging' | 'development' | 'local' | 'test'
 */
export type CanonicalSentryEnvironment =
  | 'production'
  | 'staging'
  | 'development'
  | 'local'
  | 'test';

export const normalizeSentryEnvironment = (
  env?: string | null
): CanonicalSentryEnvironment => {
  if (!env) return 'development';
  const cleanEnv = env.trim().toLowerCase();
  switch (cleanEnv) {
    case 'production':
    case 'prod':
    case 'live':
      return 'production';
    case 'staging':
    case 'stage':
    case 'stg':
    case 'uat':
      return 'staging';
    case 'development':
    case 'dev':
      return 'development';
    case 'test':
    case 'testing':
    case 'ci':
      return 'test';
    case 'local':
    case 'localhost':
      return 'local';
    default:
      return 'development';
  }
};

export const API_MAPBOX_ACCESS_TOKEN =
  import.meta.env.VITE_API_MAPBOX_ACCESS_TOKEN ?? '';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://uni-ooi-giga-maps-backend-dev.azurewebsites.net/';

export const GIGA_MERTER_API_HOST =
  import.meta.env.VITE_GIGA_METER_API_HOST ??
  'https://uni-ooi-giga-meter-backend-dev.azurewebsites.net';

export const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY ?? '';

// export const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_KEY ?? '';

export const B2C_CLIENT_ID = import.meta.env.VITE_B2C_CLIENT_ID ?? '';

export const ENV = import.meta.env.VITE_ENV;

export const isDevelopment = ENV === Environment.development;
export const isStaging = ENV === Environment.staging;
export const isProduction = ENV === Environment.production;

// Sentry SDK Configuration (conforming to Sentry Standards)
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';

export const SENTRY_ENVIRONMENT = normalizeSentryEnvironment(
  import.meta.env.VITE_SENTRY_ENVIRONMENT ?? ENV ?? (import.meta.env.DEV ? 'local' : 'production')
);

export const SENTRY_RELEASE =
  import.meta.env.VITE_SENTRY_RELEASE ?? 'giga-maps-frontend@0.0.0';

export const SENTRY_TRACES_SAMPLE_RATE = Number(
  import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ??
    (SENTRY_ENVIRONMENT === 'production' ? 0.2 : 1.0)
);

export const SENTRY_REPLAY_SAMPLE_RATE = Number(
  import.meta.env.VITE_SENTRY_REPLAY_SAMPLE_RATE ?? 0.1
);

export const SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE = Number(
  import.meta.env.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE ?? 1.0
);

export const isSentryEnabled =
  import.meta.env.VITE_SENTRY_ENABLED !== 'false' &&
  Boolean(SENTRY_DSN) &&
  SENTRY_ENVIRONMENT !== 'test';
