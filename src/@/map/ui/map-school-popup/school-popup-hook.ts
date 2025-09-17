import { useStore } from "effector-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { $countryCode } from "~/@/country/country.model";
import { $historyInterval, $historyIntervalUnit } from "~/@/sidebar/history-graph.model";
import { ConnectivityBenchMarks } from "~/@/sidebar/sidebar.constant";
import { $schoolStatsMap } from "~/@/sidebar/sidebar.model";
import { fetchSchoolPopupDataFx } from "~/api/project-connect";
import { $mapRoutes } from "~/core/routes";
import { formatDateInterval } from "~/lib/date-fns-kit/format-date-interval";
import { $schoolPopupData } from "../../map.init";
import { $multipleSchoolPopup, $schoolClickedPopupDiv } from "../../map.model";
import { UNKNOWN } from "../../map.types";

export const mockSchoolIds = [
  2289658,
  2288310,
  2286982,
  3274717,
  3274718,
  3274719,
  3274720,
  3274721,
  3274722,
  3274723,
  3274724,
  3274726,
  3274727,
  3274728,
  3274729,
  3274730,
  3274731,
  3274732,
  3274733,
  3274734,
  3274735,
  3274746,
  3274751,
  3274752,
  3274762,
  3274763,
  3274765,
  3274780,
  3274865,
  3274866,
  3274867,
  3274868,
  3274869,
  3274870,
  3274871,
  3274872,
  3274874,
  3274875,
  3274876,
  3274877,
  3274878,
  3274879,
  3274880,
  3274881,
  3274883,
  3274884,
  3274885,
  3274887,
  3274886,
  3271187
]

const useSchoolPopupData = () => {
  const { t } = useTranslation();
  const { schools: isSchoolView } = useStore($mapRoutes);
  const schoolPopupDiv = useStore($schoolClickedPopupDiv);
  const multipleSchoolDiv = useStore($multipleSchoolPopup)
  const isLoading = useStore(fetchSchoolPopupDataFx.pending);
  const countryCode = useStore($countryCode);
  const multipleSchoolStats = useStore($schoolStatsMap);
  const { layerUtils, stylePaintData, feature: schoolStats } = useStore($schoolPopupData);
  const { selectedLayerData, currentLayerTypeUtils, benchmarkNamesAllLayers, countryConnectivityNames: countryConnectivityNames,
    connectivityBenchMarks, isSchoolBenchmark } = layerUtils;
  const { isLive, isStatic } = currentLayerTypeUtils
  const { global_benchmark } = selectedLayerData ?? {};
  const intervalUnit = useStore($historyIntervalUnit);
  const interval = useStore($historyInterval);
  const formattedInterval = formatDateInterval(
    interval,
    intervalUnit,
    false
  );
  const getFeatureInfo = (feature: any) => {
    const unit = global_benchmark?.convert_unit;
    const connectivityStatusValue = feature?.connectivityStatus;
    const connecitivityStatusColor = stylePaintData[feature?.connectivityStatus ?? UNKNOWN];
    const connecitivityColor = stylePaintData[feature?.connectivityType ?? UNKNOWN];
    const schoolCoords = JSON.parse(JSON.stringify((feature?.geopoint?.coordinates ?? [])));
    const isLiveNotUnknown = isLive && feature?.connectivityType !== UNKNOWN;
    const connectivityValue = isLiveNotUnknown ? `${feature?.liveAvg ?? 0} ${unit}` : t('unknown');
    const benchmarkTitle = connectivityBenchMarks === ConnectivityBenchMarks.global ? benchmarkNamesAllLayers[selectedLayerData?.id ?? ""] : countryConnectivityNames[selectedLayerData?.id ?? ""]
    let staticValue = feature?.staticValue as boolean | undefined | string;
    const staticColor = stylePaintData[feature?.staticType ?? UNKNOWN]
    const schoolAtSameLocation = feature?.schoolAtSameLocation;
    if (typeof staticValue === 'boolean') {
      staticValue = staticValue === true ? 'yes' : 'no';
    } else if (staticValue === 'unknown' || !staticValue) {
      staticValue = t('unknown');
    } else {
      staticValue = staticValue;
    }

    return {
      unit,
      connecitivityStatusColor,
      connecitivityColor,
      schoolCoords,
      isLiveNotUnknown,
      connectivityValue,
      benchmarkTitle,
      staticValue,
      staticColor,
      connectivityStatusValue,
      schoolAtSameLocation
    }
  }

  const features = useMemo(() => {
    const collectList = [];
    if (schoolPopupDiv) {
      collectList.push(...schoolPopupDiv.map(item => ({
        ...item,
        feature: schoolStats
      })))
    }
    if (multipleSchoolDiv) {
      collectList.push(...multipleSchoolDiv.map(item => ({
        ...item,
        feature: multipleSchoolStats?.find(school => school.id === item.id)
      })))
    }
    return collectList;

  }, [schoolPopupDiv, multipleSchoolDiv, schoolStats, multipleSchoolStats])

  return {
    getFeatureInfo,
    isLoading,
    schoolPopupDiv,
    features,
    isLive,
    isStatic,
    countryCode,
    isSchoolView,
    isSchoolBenchmark,
    formattedInterval,
  }

}

export default useSchoolPopupData;