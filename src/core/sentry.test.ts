import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/react';

import { normalizeSentryEnvironment } from '~/env';
import {
  addSentryBreadcrumb,
  captureApiError,
  captureComponentError,
  clearSentryUser,
  initSentry,
  setSentryUser,
} from './sentry';

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  withScope: vi.fn((callback) => {
    const scope = {
      setTag: vi.fn(),
      setContext: vi.fn(),
      setLevel: vi.fn(),
    };
    return callback(scope);
  }),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
}));

describe('Sentry Environment Normalization', () => {
  it('normalizes canonical environments strictly according to standards', () => {
    expect(normalizeSentryEnvironment('production')).toBe('production');
    expect(normalizeSentryEnvironment('prod')).toBe('production');
    expect(normalizeSentryEnvironment('live')).toBe('production');

    expect(normalizeSentryEnvironment('staging')).toBe('staging');
    expect(normalizeSentryEnvironment('stage')).toBe('staging');
    expect(normalizeSentryEnvironment('stg')).toBe('staging');
    expect(normalizeSentryEnvironment('uat')).toBe('staging');

    expect(normalizeSentryEnvironment('development')).toBe('development');
    expect(normalizeSentryEnvironment('dev')).toBe('development');

    expect(normalizeSentryEnvironment('local')).toBe('local');
    expect(normalizeSentryEnvironment('localhost')).toBe('local');

    expect(normalizeSentryEnvironment('test')).toBe('test');
    expect(normalizeSentryEnvironment('testing')).toBe('test');
    expect(normalizeSentryEnvironment('ci')).toBe('test');

    expect(normalizeSentryEnvironment(null)).toBe('development');
    expect(normalizeSentryEnvironment(undefined)).toBe('development');
  });
});

describe('Sentry Core Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('captures component errors with component tag and details', () => {
    const error = new Error('Test component failure');
    captureComponentError(error, 'MapCanvas', { zoom: 5 });

    expect(Sentry.withScope).toHaveBeenCalled();
  });

  it('captures API errors with http status and endpoint info', () => {
    const error = new Error('500 Server Error');
    captureApiError(error, {
      url: 'https://api.giga.org/schools',
      method: 'GET',
      status: 500,
    });

    expect(Sentry.withScope).toHaveBeenCalled();
  });

  it('sets and clears Sentry user context', () => {
    setSentryUser({
      id: '123',
      email: 'user@example.com',
      username: 'testuser',
      role: 'Admin',
    });

    expect(Sentry.setUser).toHaveBeenCalledWith({
      id: '123',
      email: 'user@example.com',
      username: 'testuser',
      role: 'Admin',
    });

    clearSentryUser();
    expect(Sentry.setUser).toHaveBeenCalledWith(null);
  });

  it('records custom breadcrumbs', () => {
    addSentryBreadcrumb({
      category: 'navigation',
      message: 'Navigated to /map',
    });

    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: 'Navigated to /map',
    });
  });
});
