import { combine, createEvent, createStore, merge, restore, sample } from "effector";

import { APIListType } from "~/api/types";
import { setPayload } from "~/lib/effector-kit";

import { changeApiKeyRequestFx, deleteApiKeyRequestFx, getAllApiKeyRequest, updateApiKeyExtensionFx } from "../effects/api-request-fx";
import { ApiKeysAdminRequestType } from "../types/api-request.type";

export const onChangeApiKeyPage = createEvent<{ page: number; pageSize: number; }>();
export const $apiRequestPageNo = restore(onChangeApiKeyPage, { page: 1, pageSize: 20 });

export const reloadApiRequest = createEvent();
export const $apiRequestListResponse = createStore<APIListType<ApiKeysAdminRequestType> | null>(null);
$apiRequestListResponse.on(getAllApiKeyRequest.doneData, setPayload);

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
