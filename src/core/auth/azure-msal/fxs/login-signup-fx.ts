import { PublicClientApplication } from "@azure/msal-browser";
import { createEffect } from "effector";

import { loginRequest } from "../config";
import { onLoginSuccess, onLogoutSuccess } from "../model";

export const loginSignupHandlerFx = createEffect(async (instance: PublicClientApplication): Promise<void> => {
  try {
    const resp = await instance.loginPopup(loginRequest);
    instance.setActiveAccount(resp.account);
    onLoginSuccess();
  } catch (e) {
    console.log('login error', e);
  }
});

export const logoutFx = createEffect(async (instance?: PublicClientApplication): Promise<void> => {
  if (!instance) return;
  try {
    await instance.logoutPopup();
    onLogoutSuccess();
  } catch (e) {
    console.error('logout error', e);
  }
})