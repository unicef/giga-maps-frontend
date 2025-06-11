import { ApiCategoryType } from "~/@/admin/types/api-request.type"

export interface ApiKeysType {
  id: number
  api_key: string
  valid_from: string
  valid_to: string
  user: number
  api: Api
  filters: Filters
  status: string
  extension_status: string
  status_updated_by: unknown
  created: string
  last_modified_at: string
  is_active: boolean
  extension_valid_to: string
  has_active_extension_request: string;
  active_api_categories_list: ApiCategoryType[]
  active_countries_list: {
    id: number
    name: string;
  }[]
}

export interface Api {
  id: number
  name: string
  category: string
}

export interface Filters { }