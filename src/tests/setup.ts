import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

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
