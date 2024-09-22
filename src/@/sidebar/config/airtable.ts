import Airtable from 'airtable';
import { SchoolStatsType } from '~/api/types';


const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appU5WGL7iucR55vv');

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
};