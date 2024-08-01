import { combine, createEvent, createStore, sample } from "effector";

import { getApiKeyListFx, requestForApiKeyFx, requestForExtensionFx } from '~/@/api-docs/effects/api-keys-fx';
import { APIListType } from "~/api/types";
import { $loggedInUser } from "~/core/auth/models";
import { setPayload } from "~/lib/effector-kit";

import { ApiKeysType } from "../types/api-keys.type";

export const $apiKeysListResponse = createStore<null | APIListType<ApiKeysType>>(null);

$apiKeysListResponse.on(getApiKeyListFx.doneData, setPayload);

export const $apiKeysData = $apiKeysListResponse.map((resp) => resp?.results ?? []);
export const onRequestApiKey = createEvent<number>()
sample({
  clock: onRequestApiKey,
  fn: (api) => {
    return { api }
  },
  target: requestForApiKeyFx
})

// sample({
//   source: requestForApiKeyFx.failData,
//   fn: () => ({
//     title: 'The API is already available.',
//     kind: 'error',
//     subtitle: 'Please check the API keys section.'
//   }),
//   target: $notification
// })


sample({
  clock: requestForExtensionFx.done,
  source: combine({
    user: $loggedInUser
  }),
  fn: ({ user }) => {
    void getApiKeyListFx({ userId: user?.id })
  }
})

