import { combine, createEvent, createStore, merge, restore, sample } from "effector";
import { createGate } from "effector-react";

import { APIListType } from "~/api/types";
import { editRoles, userList } from "~/core/routes";
import { debounce, setPayload } from "~/lib/effector-kit";

import { getAllUserListFx, getRoleByIdFx, getRolesListFx, getUserByIdFx } from "../effects/user-management-fx";
import { Role, User } from "../types/user-management-type";

export const UserListGate = createGate<{ page: number; }>();

export const setUserPageList = createEvent<{ page: number; pageSize: number; }>();
export const $userListPageNo = createStore({ page: 1, pageSize: 20 });
$userListPageNo.on(setUserPageList, (_, payload) => payload);

export const reloadUserList = createEvent();
export const reloadRolesList = createEvent();
export const $userListResponse = createStore<APIListType<User> | null>(null);
export const getRoleList = createEvent<void>();
export const $roleListResponse = createStore<APIListType<Role> | null>(null);

export const $roleByIdResponse = createStore<Role | null>(null);


export const $userByIdResponse = createStore<User | null>(null);

export const setSearchUserValue = createEvent<string>();
export const $searchUser = restore(setSearchUserValue, '');
const $searchUserMax = $searchUser.map((value) => value.length > 0 ? value : '')

$userListResponse.on(getAllUserListFx.doneData, setPayload);

$roleListResponse.on(getRolesListFx.doneData, setPayload);
$roleByIdResponse.on(getRoleByIdFx.doneData, setPayload);

$userByIdResponse.on(getUserByIdFx.doneData, setPayload);

sample({
  clock: getRoleList,
  target: getRolesListFx,
})

sample({
  clock: merge([reloadUserList, $userListPageNo, debounce($searchUserMax, { timeout: 300 })]),
  source: combine({ userListPage: $userListPageNo, search: $searchUser }, ({ userListPage: { page, pageSize }, search }) => ({
    page,
    pageSize,
    search
  })),
  target: getAllUserListFx
});

$roleByIdResponse.reset(editRoles.visible);
$searchUser.reset(userList.visible)