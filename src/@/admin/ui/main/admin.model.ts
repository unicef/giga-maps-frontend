import { combine } from "effector";

import { downloadCountryDataFx } from "~/@/api-docs/effects/explore-api-fx";

import { getAboutusContentFx, getImagesListFx, updateAboutusContentFx, uploadImagesFx } from "../../effects/about-us-fx";
import { createOrUpdateCountryFx, deleteCountryDailySummaryFx, deleteCountryFx, deleteCountrySummaryFx, getCountryDailySummaryListFx, getCountryListFx, getCountrySummaryListFx } from "../../effects/api-country-fx";
import { deleteSchoolDailyFx, deleteSchoolFx, deleteSchoolSummaryFx, getCsvImportListFx, getSchoolDailyListFx, getSchoolListFx, getSchoolSummaryListFx, importCsvFx } from "../../effects/api-school-fx";
import { deleteBackgroundTaskFx, getBackgroundTaskListFx } from "../../effects/background-task-fx";
import { deleteContactMessageFx, getContactMessageListFx } from "../../effects/contact-message-fx";
import { getRecentActionListFx } from "../../effects/recent-action-fx";
import { getAllUserListFx } from "../../effects/user-management-fx";
import { getSchoolMasterListFx, publishAllSchoolMasterFx, publishSchoolMasterFx, updateSchoolMasterFx } from "../../effects/data-source.fx";
import { addFilterFx, deleteFilterFx, editFilterFx, getFilterListFx, publishFilterFx } from "../../effects/filter-fx";


export const $adminAllLoader = combine([
  getAboutusContentFx.pending,
  updateAboutusContentFx.pending,
  getSchoolListFx.pending,
  deleteSchoolFx.pending,
  getSchoolSummaryListFx.pending,
  deleteSchoolSummaryFx.pending,
  getSchoolDailyListFx.pending,
  deleteSchoolDailyFx.pending,
  getCsvImportListFx.pending,
  importCsvFx.pending,
  getCountryListFx.pending,
  getCountrySummaryListFx.pending,
  getCountryDailySummaryListFx.pending,
  deleteCountrySummaryFx.pending,
  deleteCountryFx.pending,
  deleteCountryDailySummaryFx.pending,
  getBackgroundTaskListFx.pending,
  getContactMessageListFx.pending,
  getRecentActionListFx.pending,
  deleteContactMessageFx.pending,
  deleteBackgroundTaskFx.pending,
  uploadImagesFx.pending,
  getImagesListFx.pending,
  getAllUserListFx.pending,
  downloadCountryDataFx.pending,
  getSchoolMasterListFx.pending,
  updateSchoolMasterFx.pending,
  publishSchoolMasterFx.pending,
  publishAllSchoolMasterFx.pending,
  createOrUpdateCountryFx.pending,
  getFilterListFx.pending,
  addFilterFx.pending,
  editFilterFx.pending,
  deleteFilterFx.pending,
  publishFilterFx.pending
], (allLoaders) => allLoaders.some(Boolean))