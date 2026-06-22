import { createEffect } from 'effector';

import { CoverageStat, LayerType } from '~/@/sidebar/types';
import {
  AdvanceFilterType,
  APIListType,
  ConnectivityStat,
  Country,
  CountryBasic,
  EntitiesConnectivityStatsResponse,
  EntitiesGlobalStatsResponse,
  EntitiesLayerInfoResponse,
  GlobalStats,
  SchoolStatsType,
} from '~/api/types';
import { createRequestFx } from '~/lib/request-fx';
import type { Controller } from '~/lib/request-fx/types';

import { apiBaseUrl, request } from './request-setup';

const ensureCacheParam = (query = ''): string => {
  const normalized = query.startsWith('?') ? query.slice(1) : query;
  const params = new URLSearchParams(normalized);

  if (!params.has('cache')) {
    params.set('cache', 'False');
  }

  const nextQuery = params.toString();
  return nextQuery ? `?${nextQuery}` : '';
};

export const getDatasetUrl = (countryCode: string): string =>
  `${apiBaseUrl}api/locations/countries/${encodeURIComponent(countryCode)}/schools/export-csv-schools/`;

export const getBaseUrl = (url: string): string => `${apiBaseUrl}${url}`;

export const fetchCountryFx = createRequestFx(
  async (countryCode: string, controller?: Controller): Promise<Country> =>
    request({
      url: `api/v2/entities/countries/${encodeURIComponent(countryCode)}/`,
      signal: controller?.getSignal(),
    })
);

export const fetchCountriesFx = createRequestFx(
  async (_, controller?: Controller): Promise<CountryBasic[]> => request({
    url: 'api/v2/entities/countries/',
    signal: controller?.getSignal(),
  })
);

export const fetchLayerListFx = createRequestFx(
  async (_, controller?: Controller): Promise<APIListType<LayerType>> =>
    request({
      url: 'api/v2/entities/layers/PUBLISHED/?expand=created_by,last_modified_by,published_by&ordering=-last_modified_at',
      signal: controller?.getSignal()
    })
);

export const fetchSchoolPopupDataFx = createRequestFx(
  async ({ query, url }: { query: string; url: string }, controller?: Controller): Promise<SchoolStatsType[]> =>
    request({
      url: `${url}${query}`,
      signal: controller?.getSignal()
    })
);

// Fetch dublicate school info by IDs
export const fetchDublicateSchoolPopupDataFx = createRequestFx(
  async ({ query, url }: { query: string; url: string }, controller?: Controller): Promise<SchoolStatsType[]> =>
    request({
      url: `${url}${query}`,
      signal: controller?.getSignal()
    })
);

export const fetchGlobalStatsFx = createRequestFx(
  async ({ query = '' }, controller?: Controller): Promise<GlobalStats> => request({
    url: `api/statistics/global-stat/${query ?? ''}`,
    signal: controller?.getSignal()
  })
);

export const fetchEntityGlobalStatsFx = createRequestFx(
  async ({ query = '' }, controller?: Controller): Promise<EntitiesGlobalStatsResponse> => request({
    url: `api/v2/entities/global-stat/${query ?? ''}`,
    signal: controller?.getSignal()
  })
);

export const fetchAdvanceFilterFx = createRequestFx(
  async (countryId: number, controller?: Controller): Promise<APIListType<AdvanceFilterType>> => request({
    url: `api/v2/entities/filters/PUBLISHED/${countryId}/?expand=column_configuration&ordering=name`,
    signal: controller?.getSignal()
  })
);

export const fetchLayerInfoFx = createRequestFx(
  async (url: string, controller?: Controller): Promise<unknown> =>
    request<unknown>({
      url,
      signal: controller?.getSignal()
    })
);

export const fetchSchoolLayerInfoFx = createEffect(
  async ({ query, url }: { query: string; url: string }): Promise<SchoolStatsType[]> =>
    fetchLayerInfoFx(`${url}${query}`) as Promise<SchoolStatsType[]>
);

export const fetchEntitiesLayerInfoFx = createEffect(
  async ({
    query
  }: {
    query: string;
  }): Promise<EntitiesLayerInfoResponse> => {
    return fetchLayerInfoFx(
      `api/v2/entities/layers/info/${query}`
    ) as Promise<EntitiesLayerInfoResponse>
  }
);

export const fetchConnectivityLayerFx = createEffect(
  async ({
    query
  }: {
    query: string;
  },
  ): Promise<ConnectivityStat> => {
    return fetchLayerInfoFx(
      `api/statistics/connectivity/${query}`
    ) as Promise<ConnectivityStat>
  }
);

export const fetchEntitiesConnectivityStatsFx = createEffect(
  async ({
    query
  }: {
    query: string;
  },
  ): Promise<EntitiesConnectivityStatsResponse> => {
    return fetchLayerInfoFx(
      `api/v2/entities/connectivity-stat/${ensureCacheParam(query)}`
    ) as Promise<EntitiesConnectivityStatsResponse>
  }
);

export const fetchTimePlayerDataFx = createRequestFx(
  async (query: string, controller?: Controller): Promise<unknown[]> => {
    return request<unknown[]>({
      url: `/api/statistics/time-players/${query}`,
      signal: controller?.getSignal(),
    })
  }
);
