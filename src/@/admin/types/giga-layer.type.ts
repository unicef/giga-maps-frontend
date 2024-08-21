export type PublishedAtType = {
  first_name: string
}
export interface DataLayer {
  id: number
  code: string
  name: string
  icon: string
  description: string
  version: string;
  type: LayerTypeChoices;
  is_reverse: boolean;
  category: string
  applicable_countries: number[]
  legend_configs: LegendConfigType
  global_benchmark: GlobalBenchmark
  status: LayerStatusType
  published_by: null | CreatedBy
  published_at: PublishedAtType | null
  created: string
  last_modified_at: string
  data_sources_list: DataSource[]
  data_source_column: DataSourceColumn
  last_modified_by: LastModifiedBy
  created_by: CreatedBy
}

export enum LayerStatusType {
  DRAFT = 'DRAFT',
  READY_TO_PUBLISH = 'READY_TO_PUBLISH',
  PUBLISHED = 'PUBLISHED',
  DISABLED = 'DISABLED'
}

export interface GlobalBenchmark {
  value: string
  unit: string
  convert_unit: string;
}

export interface DataSource {
  id: number
  name: string
  description: string
  version: string
  data_source_type: string
  request_config: RequestConfig
  column_config: ColumnConfig[]
  status: string
  published_by: any
  published_at: any
  last_modified_at: string
  last_modified_by: number
  created: string
  created_by: number
}

export interface RequestConfig {
  url: string
  method: string
  query_params: QueryParams
  auth_token_required: boolean
  headers: Headers
}

export interface QueryParams {
  dayofyear: string
}

export interface Headers {
  "Content-Type": string
}

export interface ColumnConfig {
  name: string
  type: string
  on?: string
  unit?: string
  is_parameters: boolean
}

export interface DataSourceColumn {
  "1": N1
}

export interface N1 {
  name: string
  type: string
  unit: string
}

export interface LastModifiedBy {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
}

export interface CreatedBy {
  id: number
  first_name: string
  last_name: string
  user_name: string;
  email: string
}

export interface ApiConfig {
  API_CATEGORY_CHOICES: ApiCategoryChoices
  API_KEY_STATUS_CHOICES: ApiKeyStatusChoices
  DATA_SOURCE_TYPE_CHOICES: DataSourceTypeChoices
  DATA_SOURCE_STATUS_CHOICES: DataSourceStatusChoices
  LAYER_TYPE_CHOICES: LayerTypeChoices
  LAYER_CATEGORY_CHOICES: LayerCategoryChoices
  LAYER_STATUS_CHOICES: LayerStatusChoices
  MESSAGE_SEVERITY_TYPE_CHOICES: MessageSeverityTypeChoices
  MESSAGE_MODE_CHOICES: MessageModeChoices
  PERMISSION_CHOICES: Record<string, string>
}

export interface ApiCategoryChoices {
  public: string
  private: string
}

export interface ApiKeyStatusChoices {
  INITIATED: string
  APPROVED: string
  DECLINED: string
}

export interface DataSourceTypeChoices {
  SCHOOL_MASTER: string
  DAILY_CHECK_APP: string
  QOS: string
}

export interface DataSourceStatusChoices {
  DRAFT: string
  READY_TO_PUBLISH: string
  PUBLISHED: string
  DISABLED: string
}

export enum LayerTypeChoices {
  LIVE = "LIVE",
  STATIC = "STATIC"
}

export interface LayerCategoryChoices {
  CONNECTIVITY: string
  COVERAGE: string
}

export interface LayerStatusChoices {
  DRAFT: string
  READY_TO_PUBLISH: string
  PUBLISHED: string
  DISABLED: string
}

export interface MessageSeverityTypeChoices {
  HIGH: string
  LOW: string
  MEDIUM: string
  CRITICAL: string
}

export interface MessageModeChoices {
  SMS: string
  EMAIL: string
  NOTIFICATION: string
}

type ValuesType<T> = T[keyof T];
export type LegendConfigType = Record<string, { values: string[], labels: string, tooltip?: string }>;
export type GigaLayerFormType = {
  legendConfigs: LegendConfigType;
  isReverse: boolean;
  sourceType: DataSourceTypeChoices[];
  code: DataLayer['code'],
  name: DataLayer['name'],
  icon: string,
  description: DataLayer['description'],
  type: DataLayer['type'] | undefined,
  dataSource: number[],
  dataSourceColumn: DataLayer['data_source'] | null,
  applicableCountries: DataLayer['applicable_countries'],
  globalBenchmark: DataLayer['global_benchmark'] | null,
  benchmarkConvertUnit: string,
}

export type GigaLayerAllValueType = ValuesType<GigaLayerFormType>;


export interface PreviewDataType {
  liv_avg: number
  graph_data: GraphDaum[]
  info: Info[]
  map: Map[]

}

interface GraphDaum {
  group: string
  key: string
  value: number
}

interface Info {
  good: number
  moderate: number
  bad: number
  unknown: number
  school_with_realtime_data: number
  no_of_schools_measure: number
}

interface Map {
  id: number
  name: string
  connectivity: string
  connectivity_status: string
  field_status: string
  geopoint: Geopoint,
  coverageType: string;
  is_rt_connected: boolean;
  school_name: string;
  school_id_giga: number;
  latitude: number;
  longitude: number;
}

interface Geopoint {
  type: string
  coordinates: number[]
}

export interface InvalidateCache {
  message: string
}