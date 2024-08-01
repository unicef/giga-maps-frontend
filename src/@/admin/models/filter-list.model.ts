import { createEvent, createStore, sample } from "effector";
import { filterColumnListFx, getFilterListFx } from "../effects/filter-fx";
import { setPayloadResults } from "~/lib/effector-kit";
import { FilterConfiguration, FilterListType } from "../types/filter-list.type";

export const $filterListResponse = createStore<FilterListType[]>([]);
export const $filterListCount = createStore(0);
$filterListResponse.on(getFilterListFx.doneData, setPayloadResults);
$filterListCount.on(getFilterListFx.doneData, (_, response) => response?.count || 0);

export const $filterColumnList = createStore<FilterConfiguration[]>([]);
$filterColumnList.on(filterColumnListFx.doneData, setPayloadResults);

export const onGetFilterList = createEvent<{ page: number; pageSize: number; }>();

sample({
  clock: onGetFilterList,
  target: getFilterListFx,
})