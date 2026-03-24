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

export const normalizeSchoolGlobalStats = (response: EntitiesGlobalStatsResponse): GlobalStats => {
  const school = response.school!;

  return {
    no_of_countries: school.no_of_countries,
    schools_connected: school.schools_connected!,
    countries_with_connectivity_status_mapped: school.countries_with_connectivity_status_mapped,
    schools_with_connectivity_status_mapped: school.schools_with_connectivity_status_mapped!,
    connectivity_global_benchmark: school.connectivity_global_benchmark,
    connected_schools: school.connected_schools!,
  };
};

export const normalizeSchoolConnectivityStats = (response: EntitiesConnectivityStatsResponse): ConnectivityStat => {
  const school = response.school!;

  return {
    live_avg: school.live_avg,
    no_of_schools_measure: school.no_of_schools_measure!,
    school_with_realtime_data: school.school_with_realtime_data!,
    is_data_synced: school.is_data_synced,
    real_time_connected_schools: school.real_time_connected_schools!,
    graph_data: school.graph_data,
    live_avg_connectivity: school.live_avg_connectivity,
    countries_with_realtime_data: school.countries_with_realtime_data,
    benchmark_metadata: school.benchmark_metadata,
  };
};


export const getDatasetUrl = (countryCode: string): string =>
  `${apiBaseUrl}api/locations/countries/${encodeURIComponent(countryCode)}/schools/export-csv-schools/`;

export const getBaseUrl = (url: string): string => `${apiBaseUrl}${url}`;

export const fetchCountryFx = createRequestFx(
  async (countryCode: string, controller?: Controller): Promise<Country> =>
    request({
      url: `api/locations/countries/${encodeURIComponent(countryCode)}/`,
      signal: controller?.getSignal(),
    })
);

export const fetchCountriesFx = createRequestFx(
  async (_, controller?: Controller): Promise<CountryBasic[]> => request({
    url: 'api/locations/countries/',
    signal: controller?.getSignal(),
  })
);

export const fetchLayerListFx = createRequestFx(
  async (_, controller?: Controller): Promise<APIListType<LayerType>> =>
    request({
      url: 'api/accounts/layers/PUBLISHED/?expand=created_by,last_modified_by,published_by&ordering=-last_modified_at',
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
  async ({ query = '' }, controller?: Controller): Promise<EntitiesGlobalStatsResponse> => request({
    url: `api/v2/entities/global-stat/${query ?? ''}`,
    signal: controller?.getSignal()
  })
);

export const fetchAdvanceFilterFx = createRequestFx(
  async (countryId: number, controller?: Controller): Promise<APIListType<AdvanceFilterType>> => request({
    url: `api/accounts/adv_filters/PUBLISHED/${countryId}/?expand=column_configuration&ordering=name`,
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

export const fetchCountryLiveLayerInfo = createEffect(
  async ({ query, id }: { query: string; id: number | null }): Promise<ConnectivityStat> =>
    fetchLayerInfoFx(`api/accounts/layers/${id}/info/${query}`) as Promise<ConnectivityStat>
);

export const fetchConnectivityLayerFx = createEffect(
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

export const fetchCountryStaticLayerInfo = createEffect(
  async ({ query, id }: { query: string; id: number | null }): Promise<CoverageStat> =>
    fetchLayerInfoFx(`api/accounts/layers/${id}/info/${query}`) as Promise<CoverageStat>
);

export const fetchTimePlayerDataFx = createRequestFx(
  async (query: string, controller?: Controller): Promise<unknown[]> => {
    return request<unknown[]>({
      url: `/api/statistics/time-players/${query}`,
      signal: controller?.getSignal(),
    })
  }
);
