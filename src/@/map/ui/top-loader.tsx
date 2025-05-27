import { combine, createEffect, createEvent, merge, restore, sample } from 'effector';
import { $admin1Code, $country, $countryCode } from '~/@/country/country.model';
import { $map } from '../map.model';
import { Map, MapEventType } from 'mapbox-gl';
import { DEFAULT_SOURCE } from '../map.constant';
import { useStore } from 'effector-react';
import ProgressBar from './progress-bar';
import { $selectedLayerId } from '~/@/sidebar/sidebar.model';


const setMapLoadingState = createEvent<boolean>();
const setDataChecking = createEvent<boolean>();
const $dataChecking = restore(setDataChecking, false);
const $isMapLoading = restore(setMapLoadingState, true)
const setMapPercentage = createEvent<number>();
const $mapPercent = restore(setMapPercentage, 20)
const setLoadingState = createEvent<'active' | 'finished' | 'error'>();
const $loadingStatus = restore(setLoadingState, 'active');
// check for data load
let timeout: ReturnType<typeof setTimeout>;
let mapDataTilesOnLoad = (e: MapEventType) => { }

sample({
  clock: merge([$map, $loadingStatus]),
  source: combine({ map: $map, mapPercent: $mapPercent, dataChecking: $dataChecking, loadingStatus: $loadingStatus }),
  filter: (state) => state.loadingStatus === 'active',
  target: createEffect(({ map, dataChecking }: { map: Map; dataChecking: boolean }) => {
    if (!map || dataChecking) return;
    setDataChecking(true);
    mapDataTilesOnLoad = function (e: MapEventType) {
      clearTimeout(timeout);
      if ($mapPercent.getState() < 73) {
        setMapPercentage($mapPercent.getState() + 4);
      }
      timeout = setTimeout(() => {
        if (map.getSource(DEFAULT_SOURCE) && map.isSourceLoaded(DEFAULT_SOURCE) && map.areTilesLoaded()) {
          console.log('called...')
          setMapLoadingState(false);
          setMapPercentage(100);
          setDataChecking(false)
          setTimeout(() => {
            setMapPercentage(0);
            setLoadingState('finished');
          }, 200)
          map.off('data', mapDataTilesOnLoad)
        }
      })
    }
    map.on('data', mapDataTilesOnLoad);
  })
})


const resetState = [$countryCode, $admin1Code, $selectedLayerId]
$isMapLoading.reset(resetState);
$loadingStatus.reset(resetState);
$mapPercent.reset(resetState);

const TopLoader = () => {
  const loadingStatus = useStore($loadingStatus);
  const currentPercent = useStore($mapPercent);

  return <ProgressBar progress={currentPercent} status={loadingStatus} />;
}

export default TopLoader;