import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Wrap global Request to strip AbortSignal in tests (prevents JSDOM compatibility issues)
const NativeRequest = globalThis.Request;
// @ts-ignore
globalThis.Request = class extends NativeRequest {
  constructor(input, init) {
    if (init && init.signal) {
      const { signal, ...rest } = init;
      super(input, rest);
    } else {
      super(input, init);
    }
  }
};

import createFetchMock from 'vitest-fetch-mock';
import { createEffect } from 'effector';

const fetchMock = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks();

import 'jest-styled-components';

vi.mock('@azure/msal-browser', () => {
  return {
    BrowserCrypto: vi.fn().mockImplementation(() => {
      return {
        randomUUID: vi.fn().mockReturnValue('your-mock-uuid')
      };
    })
  };
});

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// mapbox-gl mock
vi.mock('mapbox-gl/dist/mapbox-gl', () => ({
  GeolocateControl: vi.fn(),
  Map: vi.fn(() => ({
    addControl: vi.fn(),
    on: vi.fn(),
    remove: vi.fn(),
    addSource: vi.fn(),
    removeLayer: vi.fn(),
    removeSource: vi.fn(),
    getSource: vi.fn(),
    off: vi.fn(),
  })),
  NavigationControl: vi.fn(),
}));

window.URL.createObjectURL = function () {};

// webfontloader mock
vi.mock('webfontloader', () => ({
  default: {
    load: vi.fn(),
  },
  load: vi.fn(),
}));

// Scroll effects mocks
vi.mock('~/@/scroll', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/@/scroll')>();
  return {
    ...actual,
    scrollToHashFx: createEffect(() => {}),
    instantScrollFx: createEffect(() => {}),
  };
});



afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});
