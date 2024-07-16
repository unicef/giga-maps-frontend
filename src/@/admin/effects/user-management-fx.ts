import { createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { PAGE_SIZE } from "../admin-constants"
import { Role, User } from "../types/user-management-type"

export const getAllUserListFx = createEffect(({ page, pageSize, search = '' }: { page: number; pageSize: number; search: string; }) => {
  return createRequestAuthFx({
    url: `auth/users/?page_size=${pageSize}&page=${page}&ordering=first_name,last_name${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<User>>
})

export const getUserByIdFx = createEffect(({ userId }: { userId: number }) => {
  return createRequestAuthFx({
    url: `auth/users/${userId}/`
  }) as Promise<User>
})

export const updateUserFx = createEffect(({ userId, body }: any) => {
  return createRequestAuthFx({
    url: `auth/users/${userId}/`,
    method: 'PUT',
    data: body,
  }) as Promise<User>
})

export const getRolesListFx = createEffect(({ page, pageSize }: { page?: number; pageSize?: number; }) => {
  const dynamicPageSize = typeof pageSize === 'number' && pageSize > 0 ? pageSize : PAGE_SIZE;
  return createRequestAuthFx({
    url: `auth/roles/?page_size=${dynamicPageSize}&page=${page}&ordering=name`
  }) as Promise<APIListType<Role>>;
});

export const getRoleByIdFx = createEffect(({ roleId }: { roleId: number }) => {
  return createRequestAuthFx({
    url: `auth/roles/${roleId}/`
  }) as Promise<Role>
})

export const createRoleFx = createEffect(({ body }: any) => {
  return createRequestAuthFx({
    method: 'POST',
    url: `auth/roles/`,
    data: body
  }) as Promise<Role>
})

export const updateRoleFx = createEffect(({ body, roleId }: { body: any; roleId: number; }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `auth/roles/${roleId}/`,
    data: body
  }) as Promise<Role>
})

export const deleteRoleFx = createEffect(({ roleId }: { roleId: number; }) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `auth/roles/${roleId}/`,
  }) as Promise<APIListType<User>>
})
