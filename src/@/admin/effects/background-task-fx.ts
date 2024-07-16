import { createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { BackgroundTask } from "../types/background-task.type";


export const getBackgroundTaskListFx = createEffect(({ page, pageSize, search }: { page?: number; pageSize?: number; search?: string }) => {
  return createRequestAuthFx({
    url: `background/backgroundtask/?page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<BackgroundTask>>
})

export const deleteBackgroundTaskFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `background/backgroundtask/`,
    data: body
  }) as Promise<BackgroundTask>
})

export const getBackgroundTaskIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `background/backgroundtask/${id + '/'}`
  }) as Promise<BackgroundTask>
})