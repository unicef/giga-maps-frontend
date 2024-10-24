/* eslint-disable no-param-reassign */

import { Config, ConfigFn, ConfigNoFn, Url } from './types';
import { getBlob, getJson, getResource } from './utils';

const RESPONSE_ERROR = 'ResponseError';

export const isResponseError = (error: Error): boolean =>
  error.name === RESPONSE_ERROR;

const contentTypeJson = { 'Content-Type': 'application/json' };

export const createRequest = <
  T = unknown,
  BaseConfig extends ConfigFn<T> | ConfigNoFn<T> = ConfigFn<T> | ConfigNoFn<T>
>(
  baseConfig?: BaseConfig
): {
  <R1 = unknown>(customConfig: ConfigFn<R1>): Promise<R1>;
  <R2 = unknown>(customConfig: ConfigNoFn<T> | Url): Promise<
    BaseConfig extends ConfigFn<infer X> ? X : R2
  >;
} => async <R = unknown>(
  customConfig: ConfigFn<R> | ConfigNoFn<T> | Url
): Promise<R | (BaseConfig extends ConfigFn<infer X> ? X : R) | undefined> => {
    if (typeof customConfig === 'string') {
      // noinspection AssignmentToFunctionParameterJS
      customConfig = { url: customConfig };
    }

    let initPromise = Promise.resolve();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    let config = { ...baseConfig, ...customConfig } as Config<R>;

    if (config.onBeforeRequest) {
      try {
        config = await config.onBeforeRequest({ config });
      } catch (error: unknown) {
        initPromise = Promise.reject(error);
      }
    }

    const {
      url,
      baseUrl,
      params,
      data,
      fn,
      silent,
      isDownloadable,
      onBeforeRequest,
      onRequestError,
      onBeforeResponse,
      onResponseError,
      ...init
    } = config;

    if (data) {
      Object.assign(init, {
        headers: { ...contentTypeJson, ...init.headers },
        body: JSON.stringify(data),
      });
    }

    const request = new Request(getResource({ url, baseUrl, params }), init);

    const handleResponseErrors = async (response: Response) => {
      if (!response.ok) {
        const error = new Error(response.statusText);
        error.name = RESPONSE_ERROR;
        const responseJson = await response.json();
        error.response = {
          status: response.status,
          data: responseJson
        }
        if (onResponseError) {
          return onResponseError({ config, request, response, error });
        }

        return Promise.reject(error);
      }

      return response;
    };

    let promise = initPromise.then(async () => fetch(request));

    if (onRequestError) {
      promise = promise.catch((error: unknown) => {
        return onRequestError({ config, request, error });
      });
    }

    if (onBeforeResponse) {
      promise = promise.then((response) => {
        return onBeforeResponse({ config, request, response });
      });
    }

    if (!silent) {
      promise = promise.then(handleResponseErrors);
    }

    return promise.then(async (response) => {
      let reponseData = null;
      if (config.isDownloadable) {
        reponseData = await getBlob<R>(response)
      } else {
        reponseData = await getJson<R>(response);
      }
      return fn
        ? fn({
          config: config as ConfigFn<R>,
          request,
          response,
          data: reponseData,
        })
        : reponseData;
    });
  };

export const request = createRequest();
