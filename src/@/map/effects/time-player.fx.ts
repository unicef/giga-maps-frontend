import { createEffect } from "effector";
import { CirclePaint, Map, MapEventType } from "mapbox-gl";
import { Colors, LayerDataProps, mapPaintData } from "../map.constant";
import { StylePaintData } from "../map.types";
import { ConnectivityDistribution } from "~/@/sidebar/sidebar.constant";
import { createSource, defaultSource } from "../utils";
import { onLoadTimePlayerData, onSetTimePlayerCurrentYear, onTimeoutTimePlayer, onToggleTimeplayer, setLoaderTimePlayer } from "~/@/sidebar/sidebar.model";
import { clearMapDataFx } from "./add-layers-fx";
import { timePlayerData } from "../map.init";

let interval: ReturnType<typeof setInterval>;
let timeout: ReturnType<typeof setTimeout>;
let mapDataTilesOnLoad = (e: MapEventType) => { }
const timePlayerLayerId = "timePlayerLayer";
const TIMEPLAYER_TIMEOUT = 6000;


export const timePlayerSourceFx = createEffect(async ({ map, url }: { map: Map, url: string }) => {
  await clearMapDataFx({ map })
  createSource({
    url,
    map
  }, {});
  setLoaderTimePlayer(true);
});
const getCirclesPaint = (dataKey: string, paintData: StylePaintData) => {
  return [
    'case',
    ["all",
      ["==", ["get", 'year'], dataKey],
      ["==", ["get", 'is_rt_connected'], true],
    ],
    [
      "match",
      ["get", LayerDataProps.fieldStatus.key],
      ConnectivityDistribution.good, paintData.good,
      ConnectivityDistribution.moderate, paintData.moderate,
      ConnectivityDistribution.bad, paintData.bad,
      ConnectivityDistribution.unknown, paintData.unknown,
      Colors.TRANSPARENT
    ],
    Colors.TRANSPARENT
  ]
}

export const timePlayerFx = createEffect(({ map, timeplayerInfo }: ReturnType<typeof timePlayerData.getState>) => {
  const { years } = timeplayerInfo;
  if (!map || !years) return;

  map.addLayer({
    id: timePlayerLayerId,
    type: 'circle',
    source: defaultSource,
    'source-layer': "default",
    paint: {
      "circle-color": 'transparent',
      "circle-radius": mapPaintData.connectivity["circle-radius"],
    } as CirclePaint,
  });
  // check for data load
  mapDataTilesOnLoad = function (e: MapEventType) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (map.isSourceLoaded(defaultSource) && map.areTilesLoaded()) {
        onLoadTimePlayerData(true);
        map.off('data', mapDataTilesOnLoad)
      }
    })
  }
  map.on('data', mapDataTilesOnLoad);
});

const runIntervalCheck = () => {
  interval = setTimeout(onTimeoutTimePlayer, TIMEPLAYER_TIMEOUT)
}

export const onLoadStartTimePlayer = createEffect(({ map, timeplayerInfo, paintData }: ReturnType<typeof timePlayerData.getState>) => {
  const { years } = timeplayerInfo;
  if (!map || !years) return;
  const activeYear = years[0];
  map.setPaintProperty(timePlayerLayerId, 'circle-color', getCirclesPaint(String(activeYear), paintData));
  map.setLayoutProperty(timePlayerLayerId, 'visibility', 'visible');
  // setAnimationHandler(animateCircles({ map, id: timePlayerLayerId }))
  onSetTimePlayerCurrentYear(activeYear);
  runIntervalCheck()
})

export const nextTimePlayerIteration = createEffect(({ map, paintData, timeplayerInfo }: ReturnType<typeof timePlayerData.getState>) => {
  const { activeYear: prevsYear, years } = timeplayerInfo;
  if (!map || !years) return;
  const nextYear = years[years.indexOf(prevsYear) + 1];
  if (nextYear) {
    onSetTimePlayerCurrentYear(nextYear);
    map.setPaintProperty(timePlayerLayerId, 'circle-color', getCirclesPaint(String(nextYear), paintData));
    runIntervalCheck()
  } else {
    // off time player
    onToggleTimeplayer(false);
  }
});
export const clearTimeplayer = createEffect(({ map }: ReturnType<typeof timePlayerData.getState>) => {
  if (!map) return;
  map.off('data', mapDataTilesOnLoad);
  clearTimeout(timeout)
  clearTimeout(interval);
  onToggleTimeplayer(false);
});

export const onPausePlayTimeplayerFx = createEffect((isPause: boolean) => {
  if (isPause) {
    clearTimeout(interval)
  } else {
    runIntervalCheck()
  }
})