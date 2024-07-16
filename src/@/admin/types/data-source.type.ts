export interface DataSourceType {
  id: number
  created: string
  modified: string
  country_iso3_format: string
  school_id_giga: string
  school_id_gov: string
  school_name: string
  school_establishment_year: number | null
  latitude: number
  longitude: number
  education_level: string
  download_speed_contracted: number | null
  connectivity_type_govt: string
  admin1: string
  admin2: string
  school_area_type: string | null
  school_funding_type: string
  num_computers: number
  num_computers_desired: number | null
  num_teachers: number
  num_adm_personnel: number | null
  num_students: number | null
  num_classroom: number | null
  num_latrines: number | null
  computer_lab: number | null
  electricity_availability: number | null
  electricity_type: string | null
  water_availability: string | null
  school_data_source: string | null
  school_data_collection_year: number | null
  school_data_collection_modality: number | null
  cellular_coverage_availability: string
  cellular_coverage_type: string
  fiber_node_distance: number
  microwave_node_distance: number
  schools_within_1km: number
  schools_within_2km: number
  schools_within_3km: number
  nearest_LTE_distance: number
  nearest_UMTS_distance: number
  nearest_GSM_distance: number
  pop_within_1km: number
  pop_within_2km: number
  pop_within_3km: number
  school_location_ingestion_timestamp: string | null
  connectivity_govt: string
  connectivity: string
  connectivity_RT: string
  connectivity_RT_datasource: string
  connectivity_RT_ingestion_timestamp: string
  connectivity_govt_ingestion_timestamp: string | null
  connectivity_govt_collection_year: number | null
  disputed_region: string | null
  nearest_NR_id: string | null
  nearest_NR_distance: string | null
  connectivity_static: string
  version: number
  status: string
  status_verbose: string
  modified_by: string | null
  school: School | null
  modified_fields: ModifiedFields
}

export interface School {
  id: number
  name: string
  name_lower: string
  admin1_name: string
  admin2_name: string
  giga_id_school: string
}

export type ModifiedFields = DataSourceType
