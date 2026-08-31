import { isProd } from './lib/utils/index';
// See: https://vitejs.dev/guide/env-and-mode
// You can reference vars from .env as "import.meta.env.VITE_VAR_NAME"

enum Enviroment {
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production',
}

export const API_MAPBOX_ACCESS_TOKEN =
  import.meta.env.VITE_API_MAPBOX_ACCESS_TOKEN ?? '';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://uni-ooi-giga-maps-backend-dev.azurewebsites.net/';

export const GIGA_MERTER_API_HOST = import.meta.env.VITE_GIGA_METER_API_HOST ?? 'https://uni-ooi-giga-meter-backend-dev.azurewebsites.net';

export const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY ?? '';

// export const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_KEY ?? '';

export const B2C_CLIENT_ID = import.meta.env.VITE_B2C_CLIENT_ID ?? ''

export const POSTHOG_KEY = process.env.POSTHOG_KEY ?? '';

export const POSTHOG_HOST =
  process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com';

export const ENV = import.meta.env.VITE_ENV;

export const isDevelopment = ENV === Enviroment.development;
export const isStaging = ENV === Enviroment.staging;
export const isProduction = ENV === Enviroment.production;
