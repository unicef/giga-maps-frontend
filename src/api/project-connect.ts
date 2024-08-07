import { createEffect } from 'effector';

import { CoverageStat, LayerType } from '~/@/sidebar/types';
import {
  APIListType,
  AdvanceFilterType,
  ConnectivityStat,
  Country,
  CountryBasic,
  GlobalStats,
  SchoolStatsType,
} from '~/api/types';
import { createRequestFx } from '~/lib/request-fx';
import Controller from '~/lib/request-fx/types';

import { apiBaseUrl, request } from './request-setup';


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

export const fetchGlobalStatsFx = createRequestFx(
  async ({ query = '' }, controller?: Controller): Promise<GlobalStats> => request({
    url: `api/statistics/global-stat/${query ?? ''}`,
    signal: controller?.getSignal()
  })
);

export const fetchAdvanceFilterFx = createRequestFx(
  async (countryId: number, controller?: Controller): Promise<APIListType<AdvanceFilterType>> => request({
    url: `api/accounts/adv_filters/PUBLISHED/${countryId}/?cache=false&expand=column_configuration&ordering=name`,
    signal: controller?.getSignal()
  })
);

export const fetchLayerInfoFx = createRequestFx(
  async (url: string, controller?: Controller): Promise<any> =>
    request({
      url,
      signal: controller?.getSignal()
    })
);

export const fetchSchoolLayerInfoFx = createEffect(
  async ({ query, url }: { query: string; url: string }): Promise<SchoolStatsType[]> =>
    fetchLayerInfoFx(`${url}${query}`)
);

export const fetchCountryLiveLayerInfo = createEffect(
  async ({ query, id }: { query: string; id: number | null }): Promise<ConnectivityStat> =>
    fetchLayerInfoFx(`api/accounts/layers/${id}/info/${query}`)
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
    )
  }
);

export const fetchCountryStaticLayerInfo = createEffect(
  async ({ query, id }: { query: string; id: number | null }): Promise<CoverageStat> =>
    fetchLayerInfoFx(`api/accounts/layers/${id}/info/${query}`)
);

export const fetchCoverageLayerFx = createRequestFx(
  async ({ query }: { query: string },
  ): Promise<CoverageStat> => {
    return fetchLayerInfoFx(
      `api/statistics/coverage/${query}`,
    )
  }
);

export const fetchTimePlayerDataFx = createRequestFx(
  async (query: string, controller?: Controller): Promise<any[]> => {
    return request({
      url: `/api/statistics/time-players/${query}`,
      signal: controller?.getSignal(),
    })
  }
);