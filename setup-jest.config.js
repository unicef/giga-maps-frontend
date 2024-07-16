// @ts-nocheck
require('@testing-library/jest-dom/jest-globals');
require('jest-fetch-mock').enableMocks()
require('jest-styled-components')

jest.mock('@azure/msal-browser', () => {
  return {
    // ... other mocked members
    BrowserCrypto: jest.fn().mockImplementation(() => {
      return {
        randomUUID: jest.fn().mockReturnValue('your-mock-uuid')
      };
    })
  };
});