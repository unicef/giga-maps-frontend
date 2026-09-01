import {
  combine,
  createEffect,
  createEvent,
  merge,
  restore,
  sample,
} from 'effector';
import {
  $admin1Code,
  $country,
  $countryCode,
  $countrySearchString,
} from '~/@/country/country.model';
import { $map } from '../map.model';
import { Map, MapEventType } from 'mapbox-gl';
import { DEFAULT_SOURCE, CONNECTIVITY_STATUS_SOURCE } from '../map.constant';
import { useStore } from 'effector-react';
import ProgressBar from './progress-bar';
import {
  $selectedLayerIdByEntity,
  $selectedSchoolIds,
} from '~/@/sidebar/sidebar.model';
import { $isMapLoading, setMapLoadingState } from '../loading.model';

const setDataChecking = createEvent<boolean>();
const $dataChecking = restore(setDataChecking, false);
const setMapPercentage = createEvent<number>();
const $mapPercent = restore(setMapPercentage, 20);
const setLoadingState = createEvent<
  'active' | 'finished' | 'loading' | 'error'
>();
const $loadingStatus = restore(setLoadingState, 'active');

// check for data load
let timeout: ReturnType<typeof setTimeout>;
let mapDataTilesOnLoad = (e: MapEventType) => {};

sample({
  clock: merge([$map, $loadingStatus]),
  source: combine({
    map: $map,
    mapPercent: $mapPercent,
    dataChecking: $dataChecking,
    loadingStatus: $loadingStatus,
  }),
  filter: (state) => state.loadingStatus === 'active',
  target: createEffect(
    ({ map, dataChecking }: { map: Map; dataChecking: boolean }) => {
      if (!map || dataChecking) return;
      setDataChecking(true);
      mapDataTilesOnLoad = function (e: MapEventType) {
        clearTimeout(timeout);
        setLoadingState('loading');
        if ($mapPercent.getState() < 73) {
          setMapPercentage($mapPercent.getState() + 4);
        }
        timeout = setTimeout(() => {
          const hasDefaultSource = !!map.getSource(DEFAULT_SOURCE);
          const hasStaticSource = !!map.getSource(CONNECTIVITY_STATUS_SOURCE);
          const defaultSourceLoaded = !hasDefaultSource || map.isSourceLoaded(DEFAULT_SOURCE);
          const staticSourceLoaded = !hasStaticSource || map.isSourceLoaded(CONNECTIVITY_STATUS_SOURCE);
          const areTilesLoaded = map.areTilesLoaded();

          if (
            (hasDefaultSource || hasStaticSource) &&
            defaultSourceLoaded &&
            staticSourceLoaded &&
            areTilesLoaded
          ) {
            setMapLoadingState(false);
            setMapPercentage(100);
            setDataChecking(false);
            timeout = setTimeout(() => {
              setMapPercentage(0);
              setLoadingState('finished');
            }, 600);
            map.off('data', mapDataTilesOnLoad);
          }
        });
      };
      map.on('data', mapDataTilesOnLoad);
    },
  ),
});

const resetState = [
  $countryCode,
  $admin1Code,
  $selectedLayerIdByEntity,
  $countrySearchString,
  $selectedSchoolIds,
];
$isMapLoading.reset(resetState);
$loadingStatus.reset(resetState);
$mapPercent.reset(resetState);

const TopLoader = () => {
  const loadingStatus = useStore($loadingStatus);
  const currentPercent = useStore($mapPercent);

  return <ProgressBar progress={currentPercent} status={loadingStatus} />;
};

export default TopLoader;
