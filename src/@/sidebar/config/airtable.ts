import { SchoolStatsType } from '~/api/types';
import { NOCODB_API_URL, NOCODB_API_TOKEN, NOCODB_TABLE_ID } from '~/env';

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
  'connectivity_govt',
  'computer_availability',
  'num_students_girls',
  'num_students_boys',
  'num_students_other',
  'num_teachers_female',
  'num_teachers_male',
  'teachers_trained',
  'sustainable_business_model',
  'device_availability',
  'num_tablets',
  'num_robotic_equipment'
];
export type CountryConfig = {
  countryCode: number;
  enabledStatistics: Array<keyof SchoolStatsType['statistics']>;
};

export const fetchConfig = async (): Promise<CountryConfig[]> => {
  if (!NOCODB_API_URL || !NOCODB_API_TOKEN || !NOCODB_TABLE_ID) {
    console.warn('NocoDB config not provided. Returning empty config.');
    return [];
  }

  try {
    const response = await fetch(
      `${NOCODB_API_URL}/tables/${NOCODB_TABLE_ID}/records?limit=200`,
      {
        headers: {
          'xc-token': NOCODB_API_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NocoDB API error: ${response.status}`);
    }

    const data = await response.json();
    const records = data?.list ?? [];

    const getFieldValue = (record: any, key: string) => {
      // NocoDB shapes can differ slightly by version:
      // - record[key]
      // - record.fields[key]
      if (record?.[key] !== undefined) return record[key];
      if (record?.fields?.[key] !== undefined) return record.fields[key];
      return undefined;
    };

    const isEnabled = (value: unknown) => {
      // Some NocoDB versions return booleans, others return 1/0.
      return value === true || value === 1 || value === '1' || value === 'true';
    };

    const config: CountryConfig[] = records
      .map((record: any) => {
        const countryCodeRaw = getFieldValue(record, 'Country Code');
        const countryCode = Number(countryCodeRaw);
        if (!Number.isFinite(countryCode)) return null;

        const enabledStatistics = statisticsKeys.filter((statKey) => {
          const value = getFieldValue(record, statKey as string);
          return isEnabled(value);
        });

        return { countryCode, enabledStatistics };
      })
      .filter((row: CountryConfig | null): row is CountryConfig => row !== null);

    return config;
  } catch (error) {
    console.error('Error fetching config from NocoDB:', error);
    return [];
  }
};