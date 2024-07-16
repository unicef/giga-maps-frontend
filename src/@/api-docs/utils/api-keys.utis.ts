import { ApiKeysType } from "../types/api-keys.type";


export const getApiKeysProps = (apiKey: ApiKeysType) => {
  if (!apiKey) return {};
  return {
    isApproved: apiKey.status.toLowerCase() == "approved",
    isDeclined: apiKey.status.toLowerCase() == "declined",
    inProgress: apiKey.status.toLowerCase() == "initiated",
    isExpired: apiKey.status.toLowerCase() == "approved" && !apiKey.is_active,
    hasExtensionRequest: apiKey.has_active_extension_request,
    extensionInProgress: apiKey.extension_status?.toLowerCase() === 'initiated',
    extensionDeclined: apiKey.extension_status?.toLowerCase() === 'declined',
    extensionApproved: apiKey.extension_status?.toLowerCase() === 'approved',
  }
}