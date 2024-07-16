import { combine, createEvent, createStore, merge, restore, sample } from "effector";

import { getCountryList } from "~/@/api-docs/models/explore-api.model";
import { cancelAnimation } from "~/@/map/effects/add-layers-utils";
import { deleteSourceAndLayers } from "~/@/map/utils";
import { addGigaLayer, editGigaLayer, viewGigaLayer } from "~/core/routes";
import { setPayload, setPayloadFirst, setPayloadResults } from "~/lib/effector-kit";

import { DataSourceName, DataSourceType, defaultGigaLayerForm, LayerDataSource, LayerType } from "../constants/giga-layer.constant";
import { createDataLayerFx, getApiSourceValuesFx, getDataLayerByIdFx, getDataLayerListFx, getDataPreviewFx } from "../effects/giga-layer-fx";
import { clearAdminMapData, previewDataLayerFx } from "../effects/preview-giga-layer-fx";
import { DataLayer, DataSource, GigaLayerAllValueType, PreviewDataType } from "../types/giga-layer.type";
import { $adminMap } from "~/@/common/admin-map-preview/admin-map.model";

const onLoadPage = createEvent(); // one time call;

export const $dataLayerListResponce = createStore<DataLayer[]>([]);
export const $dataListLayerCount = createStore(0);
$dataLayerListResponce.on(getDataLayerListFx.doneData, setPayloadResults);
$dataListLayerCount.on(getDataLayerListFx.doneData, (_, response) => response?.count || 0);

export const onGetDataLayerList = createEvent<{ page: number; pageSize: number; }>();

export const createDataLayer = createEvent<void>()

export const getApiSourceValues = createEvent<{ type: string }>()
export const $apiSourceValues = createStore<DataSource[]>([])
$apiSourceValues.on(getApiSourceValuesFx.doneData, setPayloadResults)

export const onSetGigaLayerForm = createEvent();
export const onUdpateGigaLayerForm = createEvent<[string, GigaLayerAllValueType]>();
export const $formData = createStore(defaultGigaLayerForm);
$formData.on(onUdpateGigaLayerForm, (state, payload: [string, GigaLayerAllValueType]) => {
  const [name, value] = payload;
  let resetStates;
  if (name === 'type') {
    resetStates = {
      sourceType: [],
      dataSource: [],
      dataSourceColumn: null,
      globalBenchmark: null
    }
  }
  return {
    ...state,
    ...resetStates,
    [name]: value
  }
});
$formData.on(onSetGigaLayerForm, setPayload);

export const $currentGigaLayerItem = createStore<DataLayer | null>(null)
$currentGigaLayerItem.on(getDataLayerByIdFx.doneData, setPayloadFirst);

export const onClearAdminData = createEvent();
export const resetPreviewData = createEvent();
export const $previewData = createStore<PreviewDataType | null>(null);
$previewData.on(getDataPreviewFx.doneData, setPayload);
const $mapData = $previewData.map(data => data?.map)
sample({
  clock: merge([$mapData, $adminMap]),
  source: combine({ map: $adminMap, mapData: $mapData, currentLayerItem: $currentGigaLayerItem }),
  filter: ({ map, mapData }) => {
    return !!map && !!mapData;
  },
  target: previewDataLayerFx
})

sample({
  clock: onClearAdminData,
  source: combine({ map: $adminMap }),
  target: clearAdminMapData
})

sample({
  clock: onGetDataLayerList,
  target: getDataLayerListFx,
})

sample({
  clock: createDataLayer,
  target: createDataLayerFx,
})

// get country list
sample({
  clock: onLoadPage,
  target: getCountryList
})

sample({
  clock: merge([editGigaLayer.visible, viewGigaLayer.visible, onLoadPage]),
  source: combine([editGigaLayer.params, viewGigaLayer.params, editGigaLayer.visible, viewGigaLayer.visible], ([editParams, viewParams, editVisibility, viewVisiblility]) => (editVisibility || viewVisiblility) ? editParams?.id || viewParams?.id || null : null),
  fn: (id = 0) => {
    return {
      id
    }
  },
  filter: (id) => {
    return !!id;
  },
  target: getDataLayerByIdFx
})

sample({
  clock: $currentGigaLayerItem,
  fn: (layer) => {
    if (!layer) return defaultGigaLayerForm;
    return ({
      name: layer?.name,
      icon: layer?.icon,
      description: layer.description,
      type: layer?.type,
      sourceType: layer?.data_sources_list?.map((source) => ({
        type: source.data_source_type,
        name: DataSourceName[source.data_source_type as string]
      })),
      isReverse: layer?.is_reverse,
      dataSource: layer?.data_sources_list?.map(source => source.id),
      dataSourceColumn: Object.values(layer?.data_source_column ?? [])[0],
      applicableCountries: layer.applicable_countries,
      globalBenchmark: layer?.global_benchmark,
      benchmarkConvertUnit: layer?.global_benchmark?.convert_unit,
      legendConfigs: layer?.legend_configs
    })
  },
  target: onSetGigaLayerForm
})

sample({
  clock: $formData.map(({ sourceType }) => sourceType?.map(({ type }) => type).join(', ')),
  fn: (sourceType) => {
    return { type: sourceType || '' }
  },
  filter: (type => !!type),
  target: getApiSourceValuesFx
})

sample({
  clock: merge([viewGigaLayer.visible, resetPreviewData]),
  source: combine({ $adminMap }),
  target: clearAdminMapData
})

$formData.reset(addGigaLayer.visible)
$currentGigaLayerItem.reset(editGigaLayer.visible, addGigaLayer.visible)
$previewData.reset(viewGigaLayer.visible, resetPreviewData);
onLoadPage();