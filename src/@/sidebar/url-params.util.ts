// URL Parameter keys (short keys to keep URLs compact)
import { $entityRegistry } from '../entities/models/entity.model';
import type { EntityType } from '../entities/types/base-entity.type';

export const URL_PARAM_KEYS = {
  LAYER_ID: 'layer',
  HEALTH_LAYER: 'healthlayer',
  SCHOOL_STATUS_LAYER: 'status',
  // Connectivity speed filters (c = connectivity)
  SPEED_GOOD: 'cG',
  SPEED_MODERATE: 'cM',
  SPEED_NO_INTERNET: 'cN',
  SPEED_UNKNOWN: 'cU',
  // Coverage filters (s = static/coverage)
  COVERAGE_5G4G: 'sG',
  COVERAGE_3G2G: 'sM',
  COVERAGE_NO: 'sN',
  COVERAGE_UNKNOWN: 'sU',
  // School status legends (ss = school status)
  SS_CONNECTED: 'ssC',
  SS_NOT_CONNECTED: 'ssN',
  SS_UNKNOWN: 'ssU',
  ENTITY: 'entity',
  LANGUAGE: 'lng',
} as const;

// Helper to parse URL params
export const getUrlParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

// Helper to parse boolean from URL param (0 or 'false' = false, anything else or null = default)
export const parseBoolParam = (value: string | null, defaultValue: boolean): boolean => {
  if (value === null) return defaultValue;
  return value !== '0' && value !== 'false';
};

// Helper to parse number from URL param
export const parseNumberParam = (value: string | null): number | null => {
  if (value === null) return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

// Helper to set or delete URL param based on boolean value (false = set, true = delete)
export const setBoolParam = (searchParams: URLSearchParams, key: string, value: boolean) => {
  if (!value) {
    searchParams.set(key, '0');
  } else {
    searchParams.delete(key);
  }
};

// Helper to set or delete URL param based on nullable number
export const setNumberParam = (searchParams: URLSearchParams, key: string, value: number | null | string) => {
  if (value !== null) {
    searchParams.set(key, String(value));
  } else {
    searchParams.delete(key);
  }
};