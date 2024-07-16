import { createEffect } from 'effector'

import { onCreateNotification } from '~/@/common/Toast/toast.model';
import { onResetLogin } from '~/core/auth/azure-msal/model';
import { ConfigNoFn } from '~/lib/request/types';

import { apiBaseUrl, request } from './request-setup'
import { errorToasterHandler } from './utils';
import { ToastNotificationProps } from '@carbon/react';

export type ApiRequestType = ConfigNoFn

export const backendRequestFx = createEffect(async ({ options, token }: { options: ApiRequestType, token?: string | null; }) => {
  const { headers, baseUrl = `${apiBaseUrl}api/`, ...rest } = options;
  return request({
    baseUrl,
    method: 'GET',
    onResponseError: ({ error }) => {
      const notification = errorToasterHandler(error);
      const response = error.response as { status?: number }
      onCreateNotification(notification as ToastNotificationProps);
      if (response?.status === 401) {
        onResetLogin();
      }
      return Promise.reject(error);
    },
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...rest
  })
});
