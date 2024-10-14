import Airtable from 'airtable';
import { SchoolStatsType } from '~/api/types';
import { AIRTABLE_API_KEY } from '~/env';

let base: Airtable.Base | null = null;

try {
  if (AIRTABLE_API_KEY) {
    base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base('appU5WGL7iucR55vv');
  } else {
    console.warn('Airtable API key not provided. Some features may be unavailable.');
  }
} catch (error) {
  console.error('Error initializing Airtable:', error);
}

// Define the statistics keys based on SchoolStatsType
const statisticsKeys: Array<keyof SchoolStatsType['statistics']> = [
  'num_students',
  'num_teachers',
  'num_classroom',
  'num_latrines',
  'running_water',
  'electricity_availability',
  'computer_lab',
  'num_computers',
  'connectivity',
  'connectivity_status',
  'connectivity_type',
  'connectivity_speed',
  'connectivity_latency',
  'coverage_availability',
  'coverage_type',
  'created',
  'modified'
];
export type CountryConfig = {
  countryCode: number;
  enabledStatistics: Array<keyof SchoolStatsType['statistics']>;
};

export const fetchConfig = async (): Promise<CountryConfig[]> => {
  if (!base) {
    console.warn('Airtable base not initialized. Returning empty config.');
    return [];
  }

  try {
    const records = await base('Country Configs').select().all();
    const config: CountryConfig[] = records.map(record => {
      const countryCode = record.get('Country Code') as number;
      // console.log("statisticsKeys", statisticsKeys)
      const enabledStatistics: CountryConfig['enabledStatistics'] = statisticsKeys.filter(stat =>
        record.get(stat) === true
      );
      return { countryCode, enabledStatistics };
    });

    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    return [];
  }
};