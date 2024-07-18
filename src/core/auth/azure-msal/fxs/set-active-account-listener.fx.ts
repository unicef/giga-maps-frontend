import { AccountInfo, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser'
import { createEffect } from "effector";

import { accessTokenRequest } from '../config';
import { clearLoginProcessing, onLoginSuccessWithToken, setAuthtoken } from '../model';
import { waitFor } from '~/lib/utils';

const sessionExpireHandling = ({ eventType, error }: EventMessage, msalInstance: PublicClientApplication) => {
  if (eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
    if (error && (error.errorMessage.includes('AADB2C90077') || error.errorMessage.includes('AADB2C90006') || error.errorMessage.includes('AADB2C90080'))) {
      void msalInstance.clearCache();
      clearLoginProcessing(false);
    }
  }
}

const handleLoginRedirect = async (msalInstance: PublicClientApplication) => {
  try {
    const resp = await msalInstance.handleRedirectPromise();
    if (resp !== null) {
      msalInstance.setActiveAccount(resp.account);
    } else {
      // need to call getAccount here?
      const currentAccounts = msalInstance.getAllAccounts();
      const activeAccount = currentAccounts[0];
      msalInstance.setActiveAccount(activeAccount);
    }
  } catch (e) {
    console.error(e);
  }
}

const acquireAuthToken = async (msalInstance: PublicClientApplication) => {
  const account = msalInstance.getActiveAccount();
  if (!account) return;
  let authToken = null;
  try {
    const accessTokenResponse = await msalInstance
      ?.acquireTokenSilent(accessTokenRequest(account))
    authToken = accessTokenResponse.accessToken;

  } catch (e) {
    console.log(e);
  }

  return authToken;
}

const setAccountListener = async (msalInstance: PublicClientApplication) => {
  msalInstance.addEventCallback((event: EventMessage) => {
    console.log(event, 'listeners');
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) && event.payload
    ) {
      const { idToken } = event.payload as AccountInfo;
      if (idToken) {
        setAuthtoken(idToken);
        onLoginSuccessWithToken();
        clearLoginProcessing(false);
      }
    }
    void sessionExpireHandling(event, msalInstance);
    //   if (event.eventType === EventType.LOGIN_FAILURE) {
    //     if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
    //       const resetPasswordRequest = {
    //         authority: b2cPolicies.authorities.forgotPassword.authority,
    //         scopes: [],
    //       }
    //       msalInstance.loginRedirect(resetPasswordRequest)
    //     }
    //   }
  })
}

export const setUpActiveAccountFx = createEffect(async (msalInstance: PublicClientApplication | null) => {
  if (!msalInstance) return;
  await msalInstance.initialize();
  void setAccountListener(msalInstance);
  // This will update account state if a user signs in from another tab or window
  msalInstance.enableAccountStorageEvents();

  await handleLoginRedirect(msalInstance);

  void acquireAuthToken(msalInstance);
  const account = msalInstance.getActiveAccount();
  if (!account) {
    clearLoginProcessing(false);
  }
})

export const clearUserSession = createEffect(async (msalInstance?: PublicClientApplication | null) => {
  if (!msalInstance) return
  void msalInstance.clearCache();
  clearLoginProcessing(false);
  const account = msalInstance.getActiveAccount();
  // wait to read error message;
  await waitFor(1000);
  try {
    await msalInstance.logoutRedirect({ account, postLogoutRedirectUri: `${window.location.origin}/docs/explore-api` });
  } catch (e) {
    console.error(e);
  }
})