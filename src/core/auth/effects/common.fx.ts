import { attach } from "effector";

import { ApiRequestType, backendRequestFx } from "~/api/backend-request-fx";

import { $authToken } from "../azure-msal/model";

export const createRequestAuthFx = attach({
  effect: backendRequestFx,
  source: $authToken,
  mapParams: (options: ApiRequestType, token) => ({ options, token }),
});

export const createRequestFx = (options: ApiRequestType) =>
  attach({
    effect: backendRequestFx,
    mapParams: _ => ({ options }),
  })