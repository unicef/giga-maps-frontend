import { combine, createEvent, createStore, merge, restore, sample } from "effector";

import { APIListType } from "~/api/types";
import { setPayload, setPayloadResults } from "~/lib/effector-kit";

import { changeApiKeyRequestFx, deleteApiKeyRequestFx, getAllApiKeyRequest, getApiCategoryFx, getCountryApiFx, updateApiCategoryFx, updateApiKeyExtensionFx } from "../effects/api-request-fx";
import { ApiCategoryType, ApiKeysAdminRequestType } from "../types/api-request.type";
import { CountryListType } from "~/@/api-docs/types/country-list.type";
import { $notification } from "~/@/common/Toast/toast.model";

export const onChangeApiKeyPage = createEvent<{ page: number; pageSize: number; }>();
export const $apiRequestPageNo = restore(onChangeApiKeyPage, { page: 1, pageSize: 20 });

export const reloadApiRequest = createEvent();
export const $apiRequestListResponse = createStore<APIListType<ApiKeysAdminRequestType> | null>(null);
$apiRequestListResponse.on(getAllApiKeyRequest.doneData, setPayload);

export const $apiCategoryList = createStore<ApiCategoryType[]>([]);
$apiCategoryList.on(getApiCategoryFx.doneData, setPayloadResults);

export const $gigaMeterApiCategories = $apiCategoryList.map(items => items.filter((item) => {
  return item.api.code === 'DAILY_CHECK_APP'
}))

export const $countryApiKeyList = createStore<CountryListType[]>([]);
$countryApiKeyList.on(getCountryApiFx.doneData, setPayload);

export const onChangeApiKeyRequest = createEvent<{ id: number; body: { status: string; } }>();

sample({
  clock: onChangeApiKeyRequest,
  target: changeApiKeyRequestFx
})


// on delete udate list;
sample({
  clock: deleteApiKeyRequestFx.done,
  source: $apiRequestListResponse,
  fn: (apiRequestList, { params }) => {
    const { results, ...rest } = apiRequestList as APIListType<ApiKeysAdminRequestType>;
    const list = results.filter((item: ApiKeysAdminRequestType) => item.id !== params.id);
    rest.count -= 1;
    return { ...rest, results: [...list] }
  },
  target: $apiRequestListResponse
})

// update updated status
sample({
  clock: merge([changeApiKeyRequestFx.doneData, updateApiKeyExtensionFx.doneData]),
  source: $apiRequestListResponse,
  target: reloadApiRequest
})

sample({
  clock: merge([reloadApiRequest, $apiRequestPageNo]),
  source: combine($apiRequestPageNo, ({ page, pageSize }) => ({ page, pageSize })),
  target: getAllApiKeyRequest
});

sample({
  clock: updateApiCategoryFx.doneData,
  fn: () => ({
    title: `Category updated successfully`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})
