export interface FilterListType {
  id: number
  code: string
  name: string
  description: any
  type: string
  options: FilterOptionsField
  query_param_filter: string
  column_configuration: ColumnConfiguration
  status: string
  published_by: null | { id: number; first_name: string }
  active_countries_list: number[]
}

export interface FilterOptionsField {
  live_choices?: boolean
  choices?: { label: string; value: string }[]
  placeholder?: string
  range_auto_compute?: boolean
  minPlaceholder?: string
  maxPlaceholder?: string
}

export interface ColumnConfiguration {
  name: string
  label: string
  type: string
  table_name: string
  table_alias: string
  table_label: string
}

export interface FilterConfiguration {
  id: number
  name: string
  label: string
  type: string
  description: any
  table_name: string
  table_alias: string
  table_label: string
  is_filter_applicable: boolean
  options?: {
    active_countries_filter: string
  }
  last_modified_at: string
  last_modified_by: any
  created: string
  created_by: any
}


export enum FilterStatusType {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DISABLED = 'DISABLED'
}