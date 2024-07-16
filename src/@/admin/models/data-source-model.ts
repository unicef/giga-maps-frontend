import { $notification, onCreateNotification } from '~/@/common/Toast/toast.model';
import { combine, createEvent, createStore, merge, sample } from "effector";

import { setPayload, setPayloadResults } from "~/lib/effector-kit";

import { deleteSchoolMasterFx, getCountryDataSourceFx, getSchoolMasterListFx, publishAllSchoolMasterFx, publishSchoolMasterFx } from "../effects/data-source.fx";
import { previewDataSourceFx } from "../effects/preview-data-source-fx";
import { DataSourceType } from "../types/data-source.type";
import { $adminMap } from "~/@/common/admin-map-preview/admin-map.model";
import { deleteSourceAndLayers } from "~/@/map/utils";
import { CountryListType } from '~/@/api-docs/types/country-list.type';

export const $schoolMasterCount = createStore(0)
$schoolMasterCount.on(getSchoolMasterListFx.doneData, (_, payload) => payload?.count);

export const $schoolMasterData = createStore<DataSourceType[]>([])
$schoolMasterData.on(getSchoolMasterListFx.doneData, setPayloadResults);

export const clearDataSourcePreview = createEvent();

export const onPreviewDataSource = createEvent<DataSourceType[]>()

export const $countryDataSourceList = createStore<CountryListType[]>([]);
$countryDataSourceList.on(getCountryDataSourceFx.doneData, setPayload);
sample({
  clock: onPreviewDataSource,
  source: combine({ map: $adminMap }),
  filter: ({ map }) => {
    return !!map;
  },
  fn: ({ map }, mapData) => {
    return { map, mapData }
  },
  target: previewDataSourceFx
})

sample({
  clock: clearDataSourcePreview,
  source: $adminMap,
  fn: (map) => {
    if (map) {
      deleteSourceAndLayers({ map });
    }
    return null;
  }
})

sample({
  clock: merge([publishAllSchoolMasterFx.doneData, publishSchoolMasterFx.doneData]),
  fn: () => {
    return onCreateNotification({
      title: 'School master data',
      subtitle: 'Published selected records.',
      kind: 'info',
    })
  },
  target: onCreateNotification
})
sample({
  clock: deleteSchoolMasterFx.doneData,
  fn: () => {
    return onCreateNotification({
      title: 'School master data',
      subtitle: 'Discarded selected records.',
      kind: 'info',
    })
  },
  target: onCreateNotification
})