import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $countryCode } from "~/@/country/country.model";
import { ConnectivityBenchMarks } from "~/@/sidebar/sidebar.constant";
import { fetchSchoolPopupDataFx } from "~/api/project-connect";
import { $schoolPopupData } from "../../map.init";
import { $multipleSchoolPopup, $schoolClickedPopupDiv } from "../../map.model";
import { UNKNOWN } from "../../map.types";
import { $mapRoutes } from "~/core/routes";
import { useMemo } from "react";
import { $schoolStatsMap } from "~/@/sidebar/sidebar.model";

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
    connectivityBenchMarks } = layerUtils;
  const { isLive, isStatic } = currentLayerTypeUtils
  const { global_benchmark } = selectedLayerData ?? {};

  const getFeatureInfo = (feature: any) => {
    const unit = global_benchmark?.convert_unit;
    const connecitivityStatusColor = stylePaintData[feature?.connectivityStatus ?? UNKNOWN];
    const connecitivityColor = stylePaintData[feature?.connectivityType ?? UNKNOWN];
    const schoolCoords = JSON.parse(JSON.stringify((feature?.geopoint?.coordinates ?? [])));
    const isLiveNotUnknown = isLive && feature?.connectivityType !== UNKNOWN;
    const connectivityValue = isLiveNotUnknown ? `${feature?.liveAvg ?? 0} ${unit}` : t('unknown');
    const benchmarkTitle = connectivityBenchMarks === ConnectivityBenchMarks.global ? benchmarkNamesAllLayers[selectedLayerData?.id ?? ""] : countryConnectivityNames[selectedLayerData?.id ?? ""]
    let staticValue = feature?.staticValue as boolean | undefined | string;
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
  }

}

export default useSchoolPopupData;