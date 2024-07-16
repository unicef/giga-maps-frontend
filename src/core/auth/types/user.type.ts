export interface UserInfoType {
  id: number
  first_name: string
  last_name: string
  email: string
  role: Role
  permissions: Permissions
  permission_slugs: string[]
  last_login: any
  is_active: boolean
  is_superuser: boolean
}

export interface Role {
  id: number
  name: string
  category: string
  description: string
  created: string
  last_modified_at: string
  permission_slugs: string[]
}

export interface Permissions {
  can_view_country: boolean
  can_view_all_roles: boolean
  can_view_role_configurations: boolean
  can_view_app_config: boolean
}