import { request } from '~/api/request-setup';
import { SchoolStatsType } from '~/api/types';

export type CountryConfig = {
  countryCode: number;
  enabledStatistics: Array<keyof SchoolStatsType['statistics']>;
};

export const fetchConfig = async (): Promise<CountryConfig[]> => {
  try {
    const config = await request<CountryConfig[]>({
      url: 'api/locations/country-config/',
      params: { t: String(Date.now()) },
    });

    return config ?? [];
  } catch (error) {
    console.error('Error fetching country config:', error);
    return [];
  }
};
