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
  category: string
}

interface Filters { }