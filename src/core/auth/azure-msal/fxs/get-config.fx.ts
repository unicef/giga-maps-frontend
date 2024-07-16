import { createEffect } from "effector";

import { B2C_CLIENT_ID } from "~/env";

export const getAuthConfigFx = createEffect((): Promise<{ clientId: string }> => {
  return Promise.resolve({ clientId: B2C_CLIENT_ID });
})