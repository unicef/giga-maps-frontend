import { fetchConfig } from './airtable';
import { SchoolStatsType } from '~/api/types';

export type StatisticConfig = {
  key: keyof SchoolStatsType['statistics'];
  label: string;
  icon?: React.ComponentType;
  group: string;
};

export const groupOrder = [
  'Technology',
  'Other',
  'Teachers',
  'Students',
  'Infrastructure',
  'General',
  'Connectivity',
];

const allStatistics: StatisticConfig[] = [
  { key: 'num_students', label: 'Number of students', group: 'General' },
  { key: 'num_teachers', label: 'Number of teachers', group: 'General' },
  { key: 'num_classroom', label: 'Number of classrooms', group: 'Infrastructure' },
  { key: 'num_latrines', label: 'Number of latrines', group: 'Infrastructure' },
  { key: 'running_water', label: 'Running water', group: 'Infrastructure' },
  { key: 'electricity_availability', label: 'Electricity', group: 'Infrastructure' },
  { key: 'computer_lab', label: 'Computer lab', group: 'Technology' },
  { key: 'num_computers', label: 'Number of computers', group: 'Technology' },
  { key: 'connectivity', label: 'Connectivity', group: 'Connectivity' },
  { key: 'connectivity_status', label: 'Connectivity status', group: 'Connectivity' },
  { key: 'connectivity_type', label: 'Connectivity type', group: 'Connectivity' },
  { key: 'connectivity_speed', label: 'Connectivity speed', group: 'Connectivity' },
  { key: 'connectivity_latency', label: 'Connectivity latency', group: 'Connectivity' },
  { key: 'coverage_availability', label: 'Coverage availability', group: 'Connectivity' },
  { key: 'coverage_type', label: 'Coverage type', group: 'Connectivity' },
  { key: 'connectivity_govt', label: 'Government connectivity', group: 'Connectivity' },
  { key: 'computer_availability', label: 'Computer availability', group: 'Technology' },
  { key: 'num_students_girls', label: 'Number of female students', group: 'Students' },
  { key: 'num_students_boys', label: 'Number of male students', group: 'Students' },
  { key: 'num_students_other', label: 'Number of other students', group: 'Students' },
  { key: 'num_teachers_female', label: 'Number of female teachers', group: 'Teachers' },
  { key: 'num_teachers_male', label: 'Number of male teachers', group: 'Teachers' },
  { key: 'teachers_trained', label: 'Number of trained teachers', group: 'Teachers' },
  { key: 'sustainable_business_model', label: 'Sustainable business model', group: 'Other' },
  { key: 'device_availability', label: 'Device availability', group: 'Technology' },
  { key: 'num_robotic_equipment', label: 'Number of robotic equipment', group: 'Technology' },
  { key: 'num_tablets', label: 'Number of tablets', group: 'Technology' },
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


