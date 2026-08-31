import { createEvent, createStore, sample } from "effector";

import { setPayload } from "~/lib/effector-kit";

import { getAppConfigValuesFx, getEntityTypesFx, getInvalidateCacheFx } from "../effects/admin-main-fx";
import { ApiConfig, EntityMeta, InvalidateCache } from "../types/giga-layer.type";

export const getAppConfigValues = createEvent<void>()
export const $appConfigValues = createStore<ApiConfig | null>(null)
$appConfigValues.on(getAppConfigValuesFx.doneData, setPayload);

export const onGetEntityTypes = createEvent();
export const $entityTypes = createStore<EntityMeta[] | []>([]);
$entityTypes.on(getEntityTypesFx.doneData, (_, response) => {
  const entityTypes = Object.values(response || {});
  return entityTypes.toSorted((a, b) => a.display_order - b.display_order);
});

sample({
  clock: onGetEntityTypes,
  target: getEntityTypesFx,
})

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