import { createEvent, createStore, sample } from "effector";

import { setPayload } from "~/lib/effector-kit";

import { getAppConfigValuesFx, getInvalidateCacheFx } from "../effects/admin-main-fx";
import { ApiConfig, InvalidateCache } from "../types/giga-layer.type";

export const getAppConfigValues = createEvent<void>()
export const $appConfigValues = createStore<ApiConfig | null>(null)
$appConfigValues.on(getAppConfigValuesFx.doneData, setPayload);


sample({
  clock: getAppConfigValues,
  source: $appConfigValues,
  filter: (values: ApiConfig | null) => {
    return !values;
  },
  target: getAppConfigValuesFx,
})

export const $inValidateCacheResponse = createStore<InvalidateCache | null>(null)
$inValidateCacheResponse.on(getInvalidateCacheFx.doneData, setPayload);