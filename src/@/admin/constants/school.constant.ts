export const defaultSchoolForm = {
  external_id: "",
  giga_id_school: "",
  name: "",
  address: "",
  education_level: "",
  education_level_regional: "",
  school_type: "",
  country: '',
  admin1: "",
  admin2: "",
  gps_confidence: null,
  altitude: null,
  postal_code: null,
  email: "",
  timezone: "",
  geopoint: { type: 'point', coordinates: [] }
}

export const defaultSchoolSummaryForm = {
  computer_lab: false,
  connectivity: false,
  connectivity_latency: null,
  connectivity_speed: null,
  connectivity_type: "",
  coverage_availability: null,
  coverage_type: "",
  created: "",
  date: "",
  download_speed_contracted: null,
  electricity_availability: false,
  electricity_type: null,
  fiber_node_distance: null,
  id: null,
  microwave_node_distance: null,
  modified: "",
  nearest_gsm_distance: null,
  nearest_lte_distance: null,
  nearest_umts_distance: null,
  num_adm_personnel: null,
  num_classroom: null,
  num_computers: null,
  num_computers_desired: null,
  num_latrines: null,
  num_students: null,
  num_teachers: null,
  pop_within_1km: null,
  pop_within_2km: null,
  pop_within_3km: null,
  running_water: false,
  school: null,
  schools_within_1km: null,
  schools_within_2km: null,
  schools_within_3km: null,
  week: null,
  year: null,
  download_speed_benchmark: null,
  connectivity_upload_speed: null
}

export const defaultSchoolDailyForm = {
  connectivity_latency: null,
  connectivity_speed: null,
  created: "",
  date: "",
  id: null,
  modified: "",
  school: null,
  week: null,
  weekday: null,
  year: null,
}