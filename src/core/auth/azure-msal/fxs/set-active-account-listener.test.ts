import { onMsalInstance, onResetLogin } from '../model'

// create jest mock of EventType
jest.mock('@azure/msal-browser', () => ({
  EventType: {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    ACQUIRE_TOKEN_FAILURE: 'ACQUIRE_TOKEN_FAILURE',
  }
}));

describe('setUpActiveAccountFx', () => {

  let msalInstance: any;

  beforeEach(() => {
    msalInstance = {
      initialize: jest.fn(),
      setAccountListener: jest.fn(),
      setActiveAccount: jest.fn(),
      enableAccountStorageEvents: jest.fn(),
      getActiveAccount: jest.fn().mockImplementation(() => null),
      handleRedirectPromise: jest.fn().mockImplementation(() => null),
      getAllAccounts: jest.fn().mockImplementation(() => []),
      clearCache: jest.fn(),
      logoutPopup: jest.fn(),
      addEventCallback: function (callback: any) {
        callback({
          eventType: '',
          payload: {}
        })
      }
    } as any;
  });


  it('should initialize msal instance', async () => {
    await onMsalInstance(msalInstance);

    expect(msalInstance.initialize).toHaveBeenCalled();
  });

  it('should not initialize msal instance', async () => {
    await onMsalInstance(null);

    expect(msalInstance.initialize).not.toHaveBeenCalled();
  });

  it('should set active account', async () => {
    await onMsalInstance({
      ...msalInstance, addEventCallback: function (callback: any) {
        callback({
          eventType: 'LOGIN_SUCCESS',
          payload: { idToken: "XLK" }
        })
      }
    });

    expect(msalInstance.enableAccountStorageEvents).toHaveBeenCalled();
  });

  it('should not set active account', async () => {
    await onMsalInstance({
      ...msalInstance, addEventCallback: function (callback: any) {
        callback({
          eventType: 'LOGIN_SUCCESS',
          payload: { idToken: null }
        })
      }
    });

    expect(msalInstance.enableAccountStorageEvents).toHaveBeenCalled();

  });

  it('should failed to get token: ', async () => {
    const errorCodes = ["AADB2C90080"]
    const props = {
      ...msalInstance,
      addEventCallback: function (callback: any) {
        callback({
          eventType: 'ACQUIRE_TOKEN_FAILURE',
          payload: null,
          error: {
            errorMessage: errorCodes
          }
        })
      }
    }
    await onMsalInstance(props);
    expect(msalInstance.clearCache).toHaveBeenCalled();
    // remove 
    msalInstance.clearCache.mockRestore();
    errorCodes[0] = '';
    await onMsalInstance({ ...props });
    expect(msalInstance.clearCache).not.toHaveBeenCalled();
  });

  it('should called handleRedirectPromise', async () => {
    const handleRedirectPromise = jest.fn().mockImplementation(() => {
      return {
        account: {
          homeAccountId: 'test'
        }
      }
    });
    await onMsalInstance({ ...msalInstance, handleRedirectPromise });
    expect(handleRedirectPromise).toHaveBeenCalled();

    msalInstance.getAllAccounts.mockRestore();
    await onMsalInstance({ ...msalInstance, getAllAccounts: null })
    expect(msalInstance.getAllAccounts).not.toHaveBeenCalled();
  });

  it('should called acquireAuthToken', async () => {
    const getActiveAccount = jest.fn().mockImplementation(() => {
      return {
        homeAccountId: 'test'
      }
    })
    await onMsalInstance({
      ...msalInstance, getActiveAccount
    })
    expect(getActiveAccount).not.toHaveBeenCalled();

    await onMsalInstance({
      ...msalInstance,
      getActiveAccount,
      acquireTokenSilent: jest.fn().mockImplementation(() => {
        return {
          accessToken: 'test'
        }
      })
    })
  });

  it('clearUserSession: should clear cache', async () => {
    onMsalInstance(null)
    onResetLogin();
    expect(msalInstance.clearCache).not.toHaveBeenCalled();
  });

  it('clearUserSession: should get active account', async () => {
    onMsalInstance(msalInstance);
    onResetLogin();
    expect(msalInstance.getActiveAccount).toHaveBeenCalled();
  });


  it('should handle error on logoutPopup', async () => {
    onMsalInstance({ ...msalInstance, logoutPopup: null });
    onResetLogin();

    expect(msalInstance.logoutPopup).not.toHaveBeenCalled();
  });
});
