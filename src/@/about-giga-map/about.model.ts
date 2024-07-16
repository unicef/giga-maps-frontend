import { format } from "date-fns"
import { attach, createEffect, createEvent, createStore, restore, sample } from "effector"

import { fetchConnectivityLayerFx, fetchGlobalStatsFx } from "~/api/project-connect"
import { request } from "~/api/request-setup"
import { ConnectivityStat, GlobalStats } from "~/api/types"
import { setPayload } from "~/lib/effector-kit"
import { formatNumber } from "~/lib/utils"

import { stylePaintData } from "../map/map.constant"
import { defaultInterval, Layers } from "../sidebar/sidebar.constant"
import { ConnectivityDistributionNames, ConnectivityStatusNames } from "../sidebar/ui/global-and-country-view-components/container/layer-view.constant"
import { AboutType } from "./about.type"
import { Json } from "~/lib/request/types"
import { $notification } from "../common/Toast/toast.model"

export const getAboutUsContentFx = createEffect(() => {
  return request({
    url: `api/about_us/about_us/`,
  })
})

export const onSubmitGetInTouchFx = createEffect((data: Json) => {
  return request({
    url: `api/contact/contact/`,
    method: "POST",
    data
  })
})

export const connectivityStatsFx = attach({
  effect: fetchConnectivityLayerFx,
  mapParams: () => {
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = { startDate, endDate, layer: Layers.download, is_weekly: "true" };
    const query = '?' + new URLSearchParams(params).toString();
    return { query, id: null };
  },
})

export const setActiveNav = createEvent<string>();
export const $activeNav = restore(setActiveNav, '')

export const $aboutGlobalStats = createStore<GlobalStats | null>(null);
$aboutGlobalStats.on(fetchGlobalStatsFx.doneData, setPayload);

export const $aboutConnectivityStats = createStore<ConnectivityStat | null>(null);
$aboutConnectivityStats.on(connectivityStatsFx.doneData, setPayload);

export const $aboutUsContent = createStore<AboutType[] | null>(null)
$aboutUsContent.on(getAboutUsContentFx.doneData, (_, payload) => {
  const aboutUsContent = payload?.sort((a, b) => a.id - b.id);
  return setPayload(_, aboutUsContent)
})

export const getArrayData = (item: any[]) => !item?.length ? [] : item

const styleData = stylePaintData.dark
export const $schoolMappedData = sample({
  source: {
    globalStats: $aboutGlobalStats,
    connectivityStats: $aboutConnectivityStats,
  },
  fn: ({ globalStats, connectivityStats }) => {
    return [{
      type: 'schools',
      value: `${formatNumber(globalStats?.schools_connected ?? 0)}/6M`,
      chart: null
    },
    {
      type: 'school-connectivity',
      value: formatNumber((globalStats?.schools_with_connectivity_status_mapped ?? 0)),
      chart: {
        categories: [ConnectivityStatusNames.connected, ConnectivityStatusNames.not_connected, /*ConnectivityStatusNames.unknown*/],
        categoryColors: [styleData.good, styleData.bad, styleData.unknown],
        categoryValues: [
          globalStats?.connected_schools?.connected ?? 0,
          globalStats?.connected_schools?.not_connected ?? 0,
          globalStats?.connected_schools?.unknown ?? 0]
      }
    },
    {
      type: 'connectivity',
      value: formatNumber(connectivityStats?.no_of_schools_measure ?? 0),
      chart: {
        categories: [ConnectivityDistributionNames.good, ConnectivityDistributionNames.moderate, ConnectivityDistributionNames.bad, ConnectivityDistributionNames.unknown],
        categoryColors: [styleData.good, styleData.moderate, styleData.bad, styleData.unknown],
        categoryValues: [
          connectivityStats?.real_time_connected_schools?.good ?? 0,
          connectivityStats?.real_time_connected_schools?.moderate ?? 0,
          connectivityStats?.real_time_connected_schools?.no_internet ?? 0,
          connectivityStats?.real_time_connected_schools?.unknown ?? 0
        ]
      }
    },
    ]
  }
})

sample({
  clock: onSubmitGetInTouchFx.done,
  fn: () => ({
    title: `Message sent!`,
    kind: 'success',
    subtitle: 'Thank you for your message. We will get back to you shortly'
  }),
  target: $notification
})