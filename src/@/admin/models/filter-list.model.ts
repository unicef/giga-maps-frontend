import { $notification } from '~/@/common/Toast/toast.model';
import { $appConfigValues } from '~/@/admin/models/admin-model';
import { createEvent, createStore, merge, restore, sample } from "effector";
import { addFilterFx, editFilterFx, filterColumnListFx, getFilterListFx, getFilterListIdFx, getFilterPublishedListFx } from "../effects/filter-fx";
import { setPayload, setPayloadResults } from "~/lib/effector-kit";
import { FilterConfiguration, FilterListType } from "../types/filter-list.type";
import { FilterAllValueType, FilterValueType } from '../types/filter-list-type';
import { addAdminFilter, editAdminFilter } from '~/core/routes';

const defaultFilterData = {
  code: '',
  name: '',
  column_configuration: '',
  type: '',
  description: '',
  query_param_filter: '',
  placeholder: '',
  options: {
    live_choices: true,
    range_auto_compute: true,
  }
}

export const $filterListResponse = createStore<FilterListType[]>([]);
export const $filterListCount = createStore(0);

export const onReloadFilterList = createEvent<object>();
export const $reloadFiler = restore(onReloadFilterList, null);

$filterListResponse.on(getFilterListFx.doneData, setPayloadResults);
$filterListCount.on(getFilterListFx.doneData, (_, response) => response?.count || 0);

export const $filterColumnList = createStore<FilterConfiguration[]>([]);
$filterColumnList.on(filterColumnListFx.doneData, setPayloadResults);

export const $filterPublishedList = createStore<FilterListType[]>([]);
$filterPublishedList.on(getFilterPublishedListFx.doneData, setPayloadResults);

export const onGetFilterList = createEvent<{ page: number; pageSize: number; }>();

export const $filterTypeChoices = $appConfigValues.map((config) => {
  return {
    typeChoices: config?.FILTER_TYPE_CHOICES ?? {},
    typeChoicesList: Object.entries(config?.FILTER_TYPE_CHOICES ?? {}).map(([value, label]) => ({ label, value }))
  }
})

export const $filterQueryParamsChoices = $appConfigValues.map((config) => {
  return {
    queryParamsChoices: config?.FILTER_QUERY_PARAM_CHOICES ?? {},
    queryParamsList: Object.entries(config?.FILTER_QUERY_PARAM_CHOICES ?? {}).map(([value, label]) => ({ label, value }))
  }
})

export const $filterStatusChoices = $appConfigValues.map((config) => {
  return {
    statusChoices: config?.FILTER_STATUS_CHOICES ?? {},
    statusChoicesList: Object.entries(config?.FILTER_STATUS_CHOICES ?? {}).map(([value, label]) => ({ label, value }))
  }
})

export const onSetFilterForm = createEvent();
export const onUdpateFilterForm = createEvent<[string, FilterValueType]>();
export const $formFilterData = createStore<FilterAllValueType>(defaultFilterData);
$formFilterData.on(onUdpateFilterForm, (state, payload: [string, FilterValueType]) => {
  const [name, value] = payload;
  return {
    ...state,
    [name]: value
  }
});
$formFilterData.on(onSetFilterForm, setPayload);

sample({
  clock: onGetFilterList,
  target: getFilterListFx,
})

sample({
  clock: merge([addAdminFilter.visible, editAdminFilter.visible]),
  filter: (visible) => !visible,
  fn: () => defaultFilterData,
  target: onSetFilterForm
})

// sample({
//   clock: editAdminFilter.params,
//   filter: (params) => !!params?.id,
//   fn: (params) => ({ id: params?.id ?? 0 }),
//   target: getFilterListIdFx
// })

sample({
  clock: getFilterListIdFx.doneData,
  filter: (data) => !!data?.results?.[0],
  fn: (data) => data.results[0],
  target: onSetFilterForm
})

sample({
  clock: editFilterFx.done,
  fn: () => ({ title: 'Updated!', kind: 'success', subtitle: 'Filter updated successfully' }),
  target: $notification
})

sample({
  clock: addFilterFx.done,
  fn: () => ({ title: 'Created!', kind: 'success', subtitle: 'Filter created successfully' }),
  target: $notification
})