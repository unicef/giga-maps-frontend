import { fetchConfig } from './airtable';
import { SchoolStatsType } from '~/api/types';

export type StatisticConfig = {
  key: keyof SchoolStatsType['statistics'];
  label: string;
  icon?: React.ComponentType;
};

const allStatistics: StatisticConfig[] = [
  { key: 'num_students', label: 'Number of students' },
  { key: 'num_teachers', label: 'Number of teachers' },
  { key: 'num_classroom', label: 'Number of classrooms' },
  { key: 'num_latrines', label: 'Number of latrines' },
  { key: 'running_water', label: 'Running water' },
  { key: 'electricity_availability', label: 'Electricity' },
  { key: 'computer_lab', label: 'Computer lab' },
  { key: 'num_computers', label: 'Number of computers' },
  { key: 'connectivity', label: 'Connectivity' },
  { key: 'connectivity_status', label: 'Connectivity status' },
  { key: 'connectivity_type', label: 'Connectivity type' },
  { key: 'connectivity_speed', label: 'Connectivity speed' },
  { key: 'connectivity_latency', label: 'Connectivity latency' },
  { key: 'coverage_availability', label: 'Coverage availability' },
  { key: 'coverage_type', label: 'Coverage type' },
];

const defaultStatistics: (keyof SchoolStatsType['statistics'])[] = [

];

export type CountryConfig = {
  countryCode: number;
  enabledStatistics: (keyof SchoolStatsType['statistics'])[];
};

let dynamicConfig: CountryConfig[] | null = null;

export const getStatisticsConfig = async (countryCode: number): Promise<StatisticConfig[]> => {
  if (dynamicConfig === null) {
    dynamicConfig = await fetchConfig();
  }

  const countryConfig = dynamicConfig.find(config => config.countryCode === countryCode);
  const enabledKeys = countryConfig ? countryConfig.enabledStatistics : defaultStatistics;

  return allStatistics.filter(stat => enabledKeys.includes(stat.key));
};