import { API_BASE_URL } from '~/env';
import { createRequest } from "~/lib/request";

export const apiBaseUrl = API_BASE_URL;

export const request = createRequest({
  baseUrl: apiBaseUrl,
});