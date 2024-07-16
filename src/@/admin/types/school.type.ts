export interface SchoolType {
  id: number;
  external_id: string;
  giga_id_school: string;
  name: string;
  address: string;
  education_level: string;
  education_level_regional: string;
  school_type: string;
  country: null;
  admin1_name: string;
  admin2_name: string;
  gps_confidence: null;
  altitude: null;
  postal_code: null;
  email: string;
  timezone: string,
  geopoint: any,
}

export interface SchoolSummaryType {
  computer_lab: boolean;
  connectivity: boolean;
  connectivity_latency: any;
  connectivity_speed: any;
  connectivity_type: string;
  coverage_availability: any;
  coverage_type: string;
  created: string;
  date: string;
  download_speed_contracted: any;
  electricity_availability: boolean;
  electricity_type: any;
  fiber_node_distance: any;
  id: any;
  microwave_node_distance: any;
  modified: string;
  nearest_gsm_distance: any;
  nearest_lte_distance: any;
  nearest_umts_distance: any;
  num_adm_personnel: any;
  num_classroom: any;
  num_computers: any;
  num_computers_desired: any;
  num_latrines: any;
  num_students: any;
  num_teachers: any;
  pop_within_1km: any;
  pop_within_2km: any;
  pop_within_3km: any;
  running_water: boolean;
  school: any;
  schools_within_1km: any;
  schools_within_2km: any;
  schools_within_3km: any;
  week: any;
  year: any
}

export interface SchoolDailyType {
  connectivity_latency: number
  connectivity_speed: number;
  created: string;
  date: string;
  id: number;
  modified: string;
  school: number;
  week: number;
  weekday: number;
  year: number;
}

export interface CsvImport {
  id: number;
  created: string;
  modified: string;
  uploaded_file: string;
  status: string;
  errors: string,
  statistic: string;
  country: 299,
  uploaded_by: number
}

export interface AdminType {
  id: number;
  name: string;
  name_en: string;
  description: string;
}