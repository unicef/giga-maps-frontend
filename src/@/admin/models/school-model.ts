import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";

import { $notification } from "~/@/common/Toast/toast.model";
import { APIListType } from "~/api/types";
import { addAdminSchools, addSchoolDailySummary, addSchoolSummary } from "~/core/routes";
import { setPayload, setPayloadResults } from "~/lib/effector-kit";

import { defaultSchoolDailyForm, defaultSchoolForm, defaultSchoolSummaryForm } from "../constants/school.constant";
import { deleteSchoolDailyFx, deleteSchoolFx, deleteSchoolSummaryFx, getAdmin1ListFx, getAdmin2ListFx, getCsvImportListFx, getSchoolDailyIdFx, getSchoolDailyListFx, getSchoolIdFx, getSchoolListFx, getSchoolSummaryIdFx, getSchoolSummaryListFx, importCsvFx } from "../effects/api-school-fx";
import { AdminType, CsvImport, SchoolDailyType, SchoolSummaryType, SchoolType } from "../types/school.type";

export const onChangeAdminSchoolTab = createEvent<number>();
export const $adminSchoolTab = createStore(0)
$adminSchoolTab.on(onChangeAdminSchoolTab, setPayload);



export const $schoolListAdmin = createStore<APIListType<SchoolType> | null>(null);
$schoolListAdmin.on(getSchoolListFx.doneData, setPayload);

export const $schoolSummaryListAdmin = createStore<APIListType<SchoolSummaryType> | null>(null);
$schoolSummaryListAdmin.on(getSchoolSummaryListFx.doneData, setPayload);

export const $schoolDailyListAdmin = createStore<APIListType<SchoolDailyType> | null>(null);
$schoolDailyListAdmin.on(getSchoolDailyListFx.doneData, setPayload);

export const $importCsvList = createStore<APIListType<CsvImport> | null>(null);
$importCsvList.on(getCsvImportListFx.doneData, setPayload);

export const SchoolListGate = createGate<{ page: number; }>();
export const $schoolListPageNo = SchoolListGate.state.map((state) => state.page);

export const SchoolSummaryListGate = createGate<{ page: number; }>();
export const $schoolSummaryListPageNo = SchoolSummaryListGate.state.map((state) => state.page);

export const SchoolDailyListGate = createGate<{ page: number; }>();
export const $schoolDailyListPageNo = SchoolDailyListGate.state.map((state) => state.page);

export const onUdpateSchoolForm = createEvent<string[]>();
export const $formSchool = createStore(defaultSchoolForm);
$formSchool.on(onUdpateSchoolForm, (state, payload) => {
  const [name, value, arrayName] = payload;

  if (arrayName === "coordinates") {
    return {
      ...state,
      [name]: {
        ...state[name],
        [arrayName]: value
      }
    }
  }
  else {
    return {
      ...state,
      [name]: value
    }
  }
});

export const $admin1Values = createStore<AdminType[]>([])
$admin1Values.on(getAdmin1ListFx.doneData, setPayloadResults)

export const onChangeAdmin1 = createEvent<AdminType[]>();
$admin1Values.on(onChangeAdmin1, setPayload);

export const $admin2Values = createStore<AdminType[]>([])
$admin2Values.on(getAdmin2ListFx.doneData, setPayloadResults)

export const onChangeAdmin2 = createEvent<AdminType[]>();
$admin2Values.on(onChangeAdmin2, setPayload);


export const onUdpateSchoolSummaryForm = createEvent<string[]>();
export const $formSchoolSummary = createStore(defaultSchoolSummaryForm);
$formSchoolSummary.on(onUdpateSchoolSummaryForm, (state, payload) => {
  const [name, value] = payload;
  return {
    ...state,
    [name]: value
  }
});

export const onUdpateSchoolDailyForm = createEvent<[]>();
export const $formSchoolDaily = createStore(defaultSchoolDailyForm);
$formSchoolDaily.on(onUdpateSchoolDailyForm, (state, payload) => {
  const [name, value] = payload;
  return {
    ...state,
    [name]: value
  }
});

sample({
  clock: deleteSchoolFx.done,
  fn: ({ params }) => ({
    title: `Record Deleted.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})

sample({
  clock: deleteSchoolSummaryFx.done,
  fn: ({ params }) => ({
    title: `Record Deleted.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})

sample({
  clock: deleteSchoolDailyFx.done,
  fn: ({ params }) => ({
    title: `Record Deleted.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})

sample({
  clock: importCsvFx.done,
  fn: ({ params }) => ({
    title: `file uploaded.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})


$formSchool.on(getSchoolIdFx.doneData, setPayload)
$formSchoolSummary.on(getSchoolSummaryIdFx.doneData, setPayload)
$formSchoolDaily.on(getSchoolDailyIdFx.doneData, setPayload)

$formSchool.reset(addAdminSchools.visible)
$admin1Values.reset(addAdminSchools.visible)
$admin2Values.reset(addAdminSchools.visible)
// $admin1Values.reset(editAdminSchools.visible)
// $admin2Values.reset(editAdminSchools.visible)
$formSchoolSummary.reset(addSchoolSummary.visible)
$formSchoolDaily.reset(addSchoolDailySummary.visible)
