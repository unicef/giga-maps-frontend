import { combine, createStore, merge, sample } from "effector";

import { $notification } from "~/@/common/Toast/toast.model";
import { errorToasterHandler, errorToastFilter } from "~/api/utils";
import { setPayload } from "~/lib/effector-kit";

import { $isLoginProcessing, onLoginSuccess, onLoginSuccessWithToken, onLogoutSuccess } from "../azure-msal/model";
import { getUserDetailFx } from "../effects/auth-api-fx";
import { UserInfoType } from "../types/user.type";
import { createPermission } from '../utils';

export const $loggedInUser = createStore<null | UserInfoType>(null)
$loggedInUser.reset(onLogoutSuccess);
$loggedInUser.on(getUserDetailFx.doneData, setPayload);

export const $isLoggedIn = $loggedInUser.map((user) => !!user);
export const $userFullName = $loggedInUser.map((user) => `${user?.first_name || ''} ${user?.last_name || ''}`.trim())
export const $userShortName = $userFullName.map((userName = '') => userName?.split(' ').map((name) => name[0]).join(''))
export const $isAdmin = $loggedInUser.map((user) => user && user?.role.name !== "Read Only");
export const $isAdminUser = $loggedInUser.map((user) => user && ((user?.role.name === "Admin" && user?.role.category === 'system') || user?.is_superuser));
export const $isSuperAdmin = $loggedInUser.map(user => user?.is_superuser);
export const $userPermissions = $loggedInUser.map((user) => createPermission(user?.role?.permission_slugs || []))

export const $isCheckingAuthentication = sample({
  source: combine([
    $isLoginProcessing,
    getUserDetailFx.pending
  ]),
  fn: (states) => states.some(Boolean),
});

sample({
  clock: onLoginSuccessWithToken,
  target: getUserDetailFx,
})

sample({
  clock: onLoginSuccess,
  fn: () => ({
    title: 'Login successfully',
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})

sample({
  clock: onLogoutSuccess,
  fn: () => ({
    title: 'Logout successfully',
    kind: 'info',
    subtitle: ''
  }),
  target: $notification
})

sample({
  source: merge([getUserDetailFx.failData]),
  fn: errorToasterHandler,
  filter: errorToastFilter,
  target: $notification
})