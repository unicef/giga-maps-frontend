export interface ExploreApiType {
  id: number
  name: string
  category: string
  description: string
  country_filter_applicable: boolean
  school_filter_applicable: boolean
  giga_id_filter_applicable: boolean
  indicator_filter_applicable: boolean
  date_range_filter_applicable: boolean
  documentation_url: string
  download_url: string
  report_title: string
  default_filters: DefaultFilters
  is_unlocked: boolean
  created: string
  last_modified_at: string
}

interface DefaultFilters {
  country_id?: string
  school_id?: string
  giga_id_school?: string
  country_has_schools?: boolean
}


export interface SchoolListType {
  name: string;
  id: string;
}

export interface DownloadDataType {
  pageSize: number;
  pageNo: number;
  countryId?: number;
  schoolIds?: string[],
  apiKey: string;
}
