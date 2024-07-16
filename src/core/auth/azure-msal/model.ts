import { PublicClientApplication } from "@azure/msal-browser";
import { createEvent, restore, sample } from "effector";

import { createInstanceFx, getAuthConfigFx } from "./fxs";
import { loginSignupHandlerFx, logoutFx } from "./fxs/login-signup-fx";
import { clearUserSession, setUpActiveAccountFx } from "./fxs/set-active-account-listener.fx";

export const onMsalInstance = createEvent<PublicClientApplication | null>();
export const $msalInstance = restore(onMsalInstance, null);

export const setAuthtoken = createEvent<string | null | undefined>();
export const $authToken = restore(setAuthtoken, null);

export const clearLoginProcessing = createEvent<boolean>();
export const $isLoginProcessing = restore(clearLoginProcessing, true);

export const onLoadEvent = createEvent<boolean>();

export const onLoginSignup = createEvent<void>();

export const onLogout = createEvent();

export const onLogoutSuccess = createEvent();

export const onLoginSuccess = createEvent();
export const onLoginSuccessWithToken = createEvent();

export const onResetLogin = createEvent();

$authToken.reset(onLogoutSuccess);

// trigger page load
sample({
  clock: onLoadEvent,
  target: getAuthConfigFx
})


sample({
  clock: getAuthConfigFx.doneData,
  target: createInstanceFx
})

sample({
  clock: $msalInstance,
  target: setUpActiveAccountFx
})

sample({
  clock: onLoginSignup,
  source: $msalInstance,
  target: loginSignupHandlerFx,
})

sample({
  clock: onLogout,
  source: $msalInstance,
  target: logoutFx,
})

sample({
  clock: onResetLogin,
  source: $msalInstance,
  target: clearUserSession
})
// on load app get the config and login;
onLoadEvent(true);
