import { GeoJSONGeometry, GeoJSONPoint } from "~/core/global-types";

export type ConnectionStatus = 'no' | 'moderate' | 'good' | 'unknown';

export type GlobalStats = {
  no_of_countries: number;
  schools_connected: number;
  connectivity_global_benchmark: {
    value: number;
    unit: string;
  };
  connected_schools: {
    connected: number;
    not_connected: number;
    unknown: number;
  };
}

export type GraphData = {
  group: string;
  key: string;
  value: number;
}
export type defaultLegendValuesType = {
  good: number;
  moderate: number;
  no_internet: number;
  unknown: number;
}
export type ConnectivityStat = {
  live_avg: number;
  no_of_schools_measure: number;
  school_with_realtime_data: number;
  is_data_synced: boolean;
  real_time_connected_schools: defaultLegendValuesType;
  graph_data: GraphData[];
  live_avg_connectivity: string;
  benchmark_metadata: {
    base_benchmark: string;
    benchmark_unit: string;
    benchmark_value: string;
    parameter_column_unit: string;
    round_unit_value: string;
  }
};
export type SchoolInfoStats = {
  num_students: number;
  num_teachers: number;
  num_classroom: number;
  num_latrines: number;
  running_water: boolean;
  electricity_availability: boolean;
  computer_lab: boolean;
  num_computers: number;
  connectivity: boolean;
  connectivity_status: string;
  connectivity_type: string;
  connectivity_speed: number;
  connectivity_latency: number;
  coverage_availability: boolean;
  coverage_type: string;
  created: string;
  modified: string;
}
export type SchoolStatsType = {
  is_rt_connected: boolean;
  week_connectivity: string;
  id: number;
  name: string;
  field_status?: string;
  field_value?: string;
  coverage_status?: string;
  country_name: string;
  coverage_type: string;
  external_id: string;
  environment: string;
  admin1_name?: string;
  admin2_name?: string;
  admin1_code?: string;
  giga_id_school?: string;
  live_avg_connectivity: string;
  education_level?: string;
  connectivity_speed: number;
  live_avg: number;
  connectivity_status: string;
  connectivity_latency: number;
  admin1_description_ui_label?: string;
  admin2_description_ui_label?: string;
  connectivity_uptime: number;
  statistics: SchoolInfoStats;
  graph_data: GraphData[];
  geopoint: GeoJSONPoint
};


export type IntegrationStatus = 0 | 1 | 2 | 3 | 4 | 5;
export type ConnectivityAvailability =
  | 'no_connectivity'
  | 'connectivity'
  | 'static_speed'
  | 'realtime_speed';

export type CoverageAvailability =
  | 'no_coverage'
  | 'coverage_availability'
  | 'coverage_type';

export type CountryBasic = {
  id: number;
  name: string;
  code: string;
  flag: string;
  map_preview: string;
  description: string;
  data_source: string;
  integration_status: IntegrationStatus;
  date_of_join: string;
  schools_with_data_percentage: number;
  schools_total: number;
  connectivity_availability: ConnectivityAvailability;
  coverage_availability: CoverageAvailability;
  date_schools_mapped: string;
  connectivity_benchmark: number;
  connectivity_benchmark_unit: string;
  latency_benchmark: number;
  latency_benchmark_unit: string;
  uptime_benchmark: number;
  uptime_benchmark_unit: string;
  admin_metadata: AdminMetadataType;
};
export type CoverageBasic = {
  total_coverage_schools: number,
  coverage_schools: {
    "5g_4g": number,
    "3g_2g": number,
    No_coverage: number,
    Unknown: number,
  }
};

export type AdminMetadataType = {
  id: number
  layer_name: string
  name: string
  name_en: string
  description: string
  giga_id_admin: string
  mapbox_id: string
  centroid: number[]
  bbox: number[]
}
export type Country = {
  id: number;
  name: string;
  code: string;
  flag: string;
  map_preview: string;
  description: string;
  data_source: string;
  date_schools_mapped: string;
  statistics: CountryWeeklyStats;
  geometry: GeoJSONGeometry;
  benchmark_metadata: {
    live_layer: Record<string, string>
    default_national_benchmark: Record<string, boolean>
  }
  data_status: {
    week: {
      start_date: string;
      end_date: string;
    },
    month: {
      start_date: string;
      end_date: string;
    }
  }
  admin_metadata: AdminMetadataType;
  admin1_metadata: AdminMetadataType[];
};

export type CountryWeeklyStats = {
  schools_total: number;
  schools_connected: number;
  schools_connectivity_unknown: number;
  schools_connectivity_no: number;
  schools_connectivity_moderate: number;
  schools_connectivity_good: number;
  schools_coverage_unknown: number;
  schools_coverage_no: number;
  schools_coverage_moderate: number;
  schools_coverage_good: number;
  connectivity_speed: number;
  integration_status: IntegrationStatus;
  avg_distance_school: number;
  created: string;
  modified: string;
  connectivity_availability: ConnectivityAvailability;
  coverage_availability: CoverageAvailability;
};

export type CountryGeometry = {
  id: number;
  code: string;
  geometry_simplified: GeoJSONGeometry;
};

export type SchoolSimplified = {
  geopoint: GeoJSONGeometry;
  country_id: number;
  country_integration_status: IntegrationStatus;
};

export type School = {
  id: number;
  name: string;
  geopoint: GeoJSONPoint;
  statistics: {
    num_students: number;
    num_teachers: number;
    num_classroom: number;
    num_latrines: number;
    running_water: boolean;
    electricity_availability: boolean;
    computer_lab: boolean;
    num_computers: number;
    connectivity: boolean | null;
    connectivity_type: string;
    connectivity_speed: number;
    connectivity_latency: number;
    connectivity_availability: number;
    created: string;
    modified: string;
    coverage_type: string;
    coverage_availability: boolean | null;
  };
  gps_confidence: string | null;
  address: string;
  postal_code: string;
  admin1_name: string;
  admin2_name: string;
  timezone: string | null;
  altitude: number;
  email: string | null;
  education_level: string;
  environment: string;
  school_type: string;
  connectivity_status: ConnectionStatus;
  coverage_status: ConnectionStatus;
  is_verified: boolean;
};

export type DailyStats = {
  connectivity_latency: number;
  connectivity_speed: number;
  date: string;
  week: number;
  weekday: WeekDay;
  year: number;
};

export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;


export type APIListType<ResultType> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultType[];
}


export interface AdvanceFilterType {
  name: string
  type: string
  description: string
  column_configuration: ColumnConfiguration
  options?: {
    choices?: Choice[]
    placeholder?: string;
    minPlaceholder?: string;
    maxPlaceholder?: string;
    include_none_filter?: boolean
    active_range?: {
      min_value: number
      max_value: number
      min_place_holder: string
      max_place_holder: string
      include_none_filter?: boolean
    }
  }
  query_param_filter: string
}

export interface Choice {
  label: string
  value: string
}

export interface ColumnConfiguration {
  name: string
  label: string
  type: string
  table_name: string
  table_alias: string
  table_label: string
  options?: {
    downcast_aggr_str?: string;
    upcast_aggr_str?: string;
  }
}