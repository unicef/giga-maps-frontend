export type SortType =
  | 'number'
  | 'date'
  | 'integration_status'
  | 'schools_with_data_percentage';

export type SortKey =
  | 'amountOfDataAvailable'
  | 'dateOfJoining'
  | 'countryProgress'
  | 'percentSchoolWithConnectivity';

export type Tabs = 'map' | 'content' | 'controls';

export type CoverageStat = {
  "total_schools": number,
  "connected_schools": {
    "5g_4g": number,
    "3g_2g": number,
    "no_coverage": number,
    "unknown": number,
  }
};
export type MultischoolSelectionStats = {
  countryId: number,
  schoolIds: number[]
}

export type SelectedSchool = {
  countryId: number,
  schoolIds: number
}

export interface ConnectivityConfig {
  week: Week;
  month: Week;
  years: number[]
}
interface Week {
  start_date: string;
  end_date: string;
}

export interface GlobalBenchmark {
  value: string
  unit: string
  convert_unit: string;
  connectivity_type?: string
}

export enum LayerTypeChoices {
  LIVE = "LIVE",
  STATIC = "STATIC"
}
export interface LayerType {
  id: number
  name: string
  description: string
  icon: string;
  version: string;
  type: LayerTypeChoices;
  category: string
  applicable_countries: number[]
  global_benchmark: GlobalBenchmark
  created_by: null | string
  is_reverse: boolean;
  active_countries_list: { country: number, is_default: boolean }[]
  benchmark_metadata: {
    base_benchmark: string;
    benchmark_unit: string;
    benchmark_value: string;
    parameter_column_unit: string;
    round_unit_value: string;
  },
  legend_configs: Record<string, { values: string[], labels: string }>
}