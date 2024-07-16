import { APIListType } from './../../../api/types';
import { createEffect } from "effector";

import { createRequestAuthFx } from "~/core/auth/effects/common.fx";

import { RecentAction } from "../types/recent-action.type";


export const getRecentActionListFx = createEffect(({ page, pageSize}: { page?: number; pageSize?: number }) => {
  return createRequestAuthFx({
    url: `accounts/recent_action_log/?page=${page}&page_size=${pageSize}`
  }) as Promise<APIListType<RecentAction>>
})