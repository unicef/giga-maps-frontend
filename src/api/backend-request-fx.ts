import { ToastNotificationProps } from '@carbon/react';
import { createEffect } from 'effector';

import { onCreateNotification } from '~/@/common/Toast/toast.model';
import { onResetLogin } from '~/core/auth/azure-msal/model';
import { addSentryBreadcrumb, captureApiError } from '~/core/sentry';
import { ConfigNoFn } from '~/lib/request/types';

import { apiBaseUrl, request } from './request-setup';
import { errorToasterHandler } from './utils';

export type ApiRequestType = ConfigNoFn;

export const backendRequestFx = createEffect(
  async ({ options, token }: { options: ApiRequestType; token?: string | null }) => {
    const { headers, baseUrl = `${apiBaseUrl}api/`, url, method = 'GET', ...rest } = options;

    addSentryBreadcrumb({
      category: 'api.request',
      message: `HTTP ${method} ${baseUrl}${url ?? ''}`,
      data: {
        method,
        url: `${baseUrl}${url ?? ''}`,
      },
    });

    return request({
      baseUrl,
      url,
      method,
      onResponseError: ({ error }) => {
        const notification = errorToasterHandler(error);
        const response = error.response as { status?: number };
        onCreateNotification(notification as ToastNotificationProps);

        captureApiError(error, {
          url: `${baseUrl}${url ?? ''}`,
          method,
          status: response?.status,
        });

        if (response?.status === 401) {
          onResetLogin();
        }
        return Promise.reject(error);
      },
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...rest,
    });
  }
);
