import { createEffect } from "effector"

import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { ApiConfig, InvalidateCache } from "../types/giga-layer.type"

export const getAppConfigValuesFx = createEffect(() => {
  return createRequestAuthFx({
    url: `accounts/app_configs/`
  }) as Promise<ApiConfig>
})

export const getInvalidateCacheFx = createEffect((data: object) => {
  return createRequestAuthFx({
    url: `accounts/invalidate-cache-patterns/`,
    method: 'DELETE',
    data
  }) as Promise<InvalidateCache>
})