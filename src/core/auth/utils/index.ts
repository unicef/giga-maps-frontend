import { onLoginSignup } from "../azure-msal/model";
import { $isLoggedIn } from "../models"

export const AuthCheckWrapper = (callback: () => void) => () => {
  if ($isLoggedIn.getState()) {
    callback();
  } else {
    onLoginSignup();
  }
}

export const permisionsList = {
  //CAN_ACCESS_USERS_TAB: "can_access_users_tab",
  CAN_VIEW_USER: "can_view_user",
  CAN_ADD_USER: "can_add_user",
  CAN_UPDATE_USER: "can_update_user",
  CAN_DELETE_USER: "can_delete_user",
  CAN_VIEW_ALL_ROLES: "can_view_all_roles",
  CAN_UPDATE_USER_ROLE: "can_update_user_role",
  CAN_CREATE_ROLE_CONFIGURATIONS: "can_create_role_configurations",
  CAN_UPDATE_ROLE_CONFIGURATIONS: "can_update_role_configurations",
  CAN_DELETE_ROLE_CONFIGURATIONS: "can_delete_role_configurations",
  CAN_VIEW_DATA_LAYER: "can_view_data_layer",
  CAN_ADD_DATA_LAYER: "can_add_data_layer",
  CAN_UPDATE_DATA_LAYER: "can_update_data_layer",
  CAN_PUBLISH_DATA_LAYER: "can_publish_data_layer",
  CAN_PREVIEW_DATA_LAYER: "can_preview_data_layer",
  CAN_VIEW_SCHOOL_MASTER_DATA: "can_view_school_master_data",
  CAN_UPDATE_SCHOOL_MASTER_DATA: "can_update_school_master_data",
  CAN_PUBLISH_SCHOOL_MASTER_DATA: "can_publish_school_master_data",
  //CAN_VIEW_API_KEY: "can_view_api_key",
  CAN_DELETE_API_KEY: "can_delete_api_key",
  CAN_APPROVE_REJECT_API_KEY: "can_approve_reject_api_key",
  CAN_VIEW_COUNTRY: "can_view_country",
  CAN_ADD_COUNTRY: "can_add_country",
  CAN_UPDATE_COUNTRY: "can_update_country",
  CAN_DELETE_COUNTRY: "can_delete_country",
  CAN_VIEW_SCHOOL: "can_view_school",
  CAN_ADD_SCHOOL: "can_add_school",
  CAN_UPDATE_SCHOOL: "can_update_school",
  CAN_DELETE_SCHOOL: "can_delete_school",
  CAN_VIEW_UPLOADED_CSV: "can_view_uploaded_csv",
  CAN_IMPORT_CSV: "can_import_csv",
  CAN_DELETE_CSV: "can_delete_csv",
  CAN_VIEW_BACKGROUND_TASK: "can_view_background_task",
  CAN_ADD_BACKGROUND_TASK: "can_add_background_task",
  CAN_UPDATE_BACKGROUND_TASK: "can_update_background_task",
  CAN_DELETE_BACKGROUND_TASK: "can_delete_background_task",
  CAN_VIEW_CONTACT_MESSAGE: "can_view_contact_message",
  CAN_UPDATE_CONTACT_MESSAGE: "can_update_contact_message",
  CAN_DELETE_CONTACT_MESSAGE: "can_delete_contact_message",
  CAN_VIEW_RECENT_ACTIONS: "can_view_recent_actions",
  CAN_VIEW_NOTIFICATION: "can_view_notification",
  CAN_CREATE_NOTIFICATION: "can_create_notification",
  CAN_DELETE_NOTIFICATION: "can_delete_notification",
  CAN_VIEW_ADVANCE_FILTER: "can_view_advance_filter",
  CAN_ADD_ADVANCE_FILTER: "can_add_advance_filter",
  CAN_UPDATE_ADVANCE_FILTER: "can_update_advance_filter",
  CAN_PUBLISH_ADVANCE_FILTER: "can_publish_advance_filter"

} satisfies Record<string, string>

type PermissionKeyType = keyof typeof permisionsList;
export const createPermission = (permissions: string[]) => {
  const permissionMapping = {} as Record<PermissionKeyType, boolean>;
  Object.entries(permisionsList).forEach(([name, key]) => {
    permissionMapping[name as PermissionKeyType] = permissions.includes(key)
  })
  return permissionMapping;
}