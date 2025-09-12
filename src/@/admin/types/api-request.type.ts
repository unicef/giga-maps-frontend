export interface ApiKeysAdminRequestType {
  id: number
  api_key: string
  valid_from: string
  valid_to: string
  user: User
  api: Api
  filters: Filters
  status: string
  extension_status: string
  extension_valid_to: string;
  status_updated_by: unknown
  created: string
  last_modified_at: string
  is_active: boolean
  active_api_categories_list: ApiCategoryType[]
  active_countries_list: {
    id: number
    name: string;
  }[]
}

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface Api {
  id: number
  name: string
  code: string
  category: string
}

interface Filters { }

export interface ApiCategoryType {
  id: number
  code: string
  name: string
  description: string
  api: Api
  is_default: boolean
  created_by: string | null
  last_modified_by: string | null
  api_category_code: string
  api_category_name: string
  api_category_description: string
  api_category_id: number
  api_category_is_default: boolean
}