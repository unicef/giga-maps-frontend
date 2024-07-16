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

// export const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY ?? '';

export const B2C_CLIENT_ID = process.env.B2C_CLIENT_ID ?? ''

export const ENV = process.env.ENV;

export const isDevelopment = ENV === Enviroment.development;
export const isStaging = ENV === Enviroment.staging;
export const isProduction = ENV === Enviroment.production;
