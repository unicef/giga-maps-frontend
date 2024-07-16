import { createEvent, createStore, merge, restore, sample } from "effector";
import { createGate } from "effector-react";

import { $notification } from "~/@/common/Toast/toast.model";
import { APIListType } from "~/api/types";
import { addAdminCountry, addCountryDailySummary, addCountrySummary } from "~/core/routes";
import { setPayload, setPayloadFirst, setPayloadResults } from "~/lib/effector-kit";

import { defaultCountryDailySummaryForm, defaultCountryForm, defaultCountrySummaryForm } from "../constants/country-summary.constant";
import { deleteCountryDailySummaryFx, deleteCountryFx, deleteCountrySummaryFx, getCountryDailySummaryIdFx, getCountryDailySummaryListFx, getCountryIdFx, getCountryListFx, getCountrySummaryIdFx, getCountrySummaryListFx, getPublishDataLayerListFx } from "../effects/api-country-fx";
import { CountryDailySummaryType, CountrySummaryType, CountryType } from "../types/country.type";
import { DataLayer } from "../types/giga-layer.type";

export const onChangeAdminCountryTab = createEvent<number>();
export const $adminCountryTab = createStore(0)
$adminCountryTab.on(onChangeAdminCountryTab, setPayload);

export const $countryListAdmin = createStore<APIListType<CountryType> | null>(null);
$countryListAdmin.on(getCountryListFx.doneData, setPayload);

export const $countrySummaryList = createStore<APIListType<CountrySummaryType> | null>(null);
$countrySummaryList.on(getCountrySummaryListFx.doneData, setPayload);

export const $countryDailySummaryList = createStore<APIListType<CountryDailySummaryType> | null>(null);
$countryDailySummaryList.on(getCountryDailySummaryListFx.doneData, setPayload);

export const setToasterWarning = createEvent<string>()
export const $showMessage = restore(setToasterWarning, '');

export const CountryListGate = createGate<{ page: number; }>();
export const $countryListPageNo = CountryListGate.state.map((state) => state.page);

export const CountrySummaryListGate = createGate<{ page: number; }>();
export const $countrySummaryListPageNo = CountrySummaryListGate.state.map((state) => state.page);

export const CountryDailySummaryListGate = createGate<{ page: number; }>();
export const $countryDailySummaryListPageNo = CountryDailySummaryListGate.state.map((state) => state.page);


export const $publishDataLayerListResponce = createStore<DataLayer[]>([]);
$publishDataLayerListResponce.on(getPublishDataLayerListFx.doneData, setPayloadResults);

export const onUdpateCountrySummaryForm = createEvent<[]>();
export const onUdpateCountryDailySummaryForm = createEvent<[]>();
export const onUdpateCountryForm = createEvent<any[]>();

export const $formDataCountry = createStore(defaultCountryForm);
export const $formDataCountrySummary = createStore(defaultCountrySummaryForm);
export const $formDataCountryDailySummary = createStore(defaultCountryDailySummaryForm);


$formDataCountryDailySummary.on(onUdpateCountryDailySummaryForm, (state, payload) => {
  const [name, value] = payload;
  return {
    ...state,
    [name]: value
  }
});

$formDataCountrySummary.on(onUdpateCountrySummaryForm, (state, payload) => {
  const [name, value] = payload;
  return {
    ...state,
    [name]: value
  }
});

$formDataCountry.on(onUdpateCountryForm, (state, payload) => {
  const [name, value] = payload;
  return {
    ...state,
    [name]: value
  }
});

sample({
  clock: merge([deleteCountrySummaryFx.done, deleteCountryDailySummaryFx.done, deleteCountryFx.done]),
  fn: () => ({
    title: `Record Deleted.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})

$formDataCountrySummary.on(getCountrySummaryIdFx.doneData, setPayload)
$formDataCountryDailySummary.on(getCountryDailySummaryIdFx.doneData, setPayload)
$formDataCountry.on(getCountryIdFx.doneData, setPayload)

$formDataCountrySummary.reset(addCountrySummary.visible)
$formDataCountryDailySummary.reset(addCountryDailySummary.visible)
$formDataCountry.reset(addAdminCountry.visible)
