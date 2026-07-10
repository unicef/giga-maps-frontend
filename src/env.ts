import { isProd } from './lib/utils/index';
// See: https://www.npmjs.com/package/dotenv-webpack
// You can reference vars from .env as "process.env.VAR_NAME" (no destructuring)

enum Enviroment {
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production',
}

export const API_MAPBOX_ACCESS_TOKEN =
  process.env.API_MAPBOX_ACCESS_TOKEN ?? '';

export const API_BASE_URL =
  process.env.API_BASE_URL ?? 'https://uni-ooi-giga-maps-backend-dev.azurewebsites.net/';

export const GIGA_MERTER_API_HOST = process.env.GIGA_METER_API_HOST ?? 'https://uni-ooi-giga-meter-backend-dev.azurewebsites.net';

export const B2C_CLIENT_ID = process.env.B2C_CLIENT_ID ?? ''

export const POSTHOG_KEY = process.env.POSTHOG_KEY ?? '';

export const POSTHOG_HOST =
  process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com';

export const ENV = process.env.ENV;

export const isDevelopment = ENV === Enviroment.development;
export const isStaging = ENV === Enviroment.staging;
export const isProduction = ENV === Enviroment.production;
