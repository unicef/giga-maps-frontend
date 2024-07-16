import { PublicClientApplication } from '@azure/msal-browser'
import { createEffect } from "effector";

import { getMsalConfig } from '../config';
import { onMsalInstance } from '../model';

export const createInstanceFx = createEffect(({ clientId }: { clientId: string }) => {

  const msalInstance = new PublicClientApplication(getMsalConfig({ clientId }))
  onMsalInstance(msalInstance);
})