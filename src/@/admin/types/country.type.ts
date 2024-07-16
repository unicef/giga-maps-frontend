export interface CountryType {
  id: number;
  name: string;
  code: string;
  flag: string;
  map_preview: string;
  description: string;
  data_source: string;
  date_schools_mapped?: any;
  integration_status: number;
  date_of_join?: any;
  schools_with_data_percentage?: any;
  schools_total: number;
  connectivity_availability: string;
  coverage_availability: string;
  connectivity_benchmark?: any;
  connectivity_benchmark_unit?: any;
  latency_benchmark?: any;
  latency_benchmark_unit?: any;
  uptime_benchmark?: any;
  uptime_benchmark_unit?: any;
}

export interface CountrySummaryType {
  avg_distance_school: any;
  connectivity_availability: string;
  connectivity_latency: any;
  connectivity_speed: any;
  country: number;
  coverage_availability: string;
  created: string;
  date: string;
  global_schools_connectivity_good: number;
  global_schools_connectivity_moderate: number;
  global_schools_connectivity_no: number;
  global_schools_connectivity_unknown: number;
  id: number;
  integration_status: number;
  modified: string;
  schools_connected: number;
  schools_connectivity_good: number;
  schools_connectivity_moderate: number;
  schools_connectivity_no: number;
  schools_connectivity_unknown: number;
  schools_coverage_good: number;
  schools_coverage_moderate: number;
  schools_coverage_no: number;
  schools_coverage_unknown: number;
  schools_total: number;
  schools_with_data_percentag: string;
  week: number;
  year: number;

}

export interface CountryDailySummaryType {
  connectivity_latency: any;
  connectivity_speed: any;
  country: number;
  date: string;
}