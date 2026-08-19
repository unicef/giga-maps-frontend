import { useStore } from 'effector-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { $countryCode } from '~/@/country/country.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import {
  $historyIntervalByEntity,
  $historyIntervalUnitByEntity,
} from '~/@/sidebar/history-graph.model';
import { ConnectivityBenchMarks } from '~/@/sidebar/sidebar.constant';
import { defaultInterval } from '~/@/sidebar/sidebar.constant';
import { $schoolStatsMap } from '~/@/sidebar/sidebar.model';
import { fetchSchoolPopupDataFx } from '~/api/project-connect';
import { $mapRoutes } from '~/core/routes';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';
import { $schoolPopupData } from '../../map.init';
import {
  $activeSchoolPopup,
  $multipleSchoolPopup,
  $schoolClickedPopupDiv,
} from '../../map.model';
import { UNKNOWN } from '../../map.types';

const useSchoolPopupData = () => {
  const { t } = useTranslation();
  const { schools: isSchoolView } = useStore($mapRoutes);
  const activePopup = useStore($activeSchoolPopup);
  const schoolPopupDiv = useStore($schoolClickedPopupDiv);
  const multipleSchoolDiv = useStore($multipleSchoolPopup);
  const isLoading = useStore(fetchSchoolPopupDataFx.pending);
  const countryCode = useStore($countryCode);
  const multipleSchoolStats = useStore($schoolStatsMap);
  const {
    layerUtils,
    stylePaintData,
    feature: schoolStats,
  } = useStore($schoolPopupData);
  const currentEntityType = activePopup?.entityType;
  const {
    selectedLayerDataByEntity,
    currentLayerTypeUtilsByEntity,
    benchmarkNamesAllLayers,
    countryConnectivityNames,
    connectivityBenchMarksByEntity,
    isSchoolBenchmarkByEntity,
  } = layerUtils;
  const selectedLayerData = currentEntityType
    ? selectedLayerDataByEntity[currentEntityType]
    : undefined;
  const currentLayerTypeUtils = currentLayerTypeUtilsByEntity[
    currentEntityType ?? ('' as EntityType)
  ] ?? {
    isLive: false,
    isStatic: false,
    isSchoolStatus: false,
  };
  const entityConnectivityBenchmark =
    (currentEntityType
      ? connectivityBenchMarksByEntity[currentEntityType]
      : undefined) ?? ConnectivityBenchMarks.global;
  const isEntityBenchmark =
    (currentEntityType
      ? isSchoolBenchmarkByEntity[currentEntityType]
      : false) ?? false;
  const { isLive, isStatic } = currentLayerTypeUtils;
  const { global_benchmark } = selectedLayerData ?? {};
  const intervalUnitByEntity = useStore($historyIntervalUnitByEntity);
  const intervalByEntity = useStore($historyIntervalByEntity);
  const intervalUnit = currentEntityType
    ? (intervalUnitByEntity[currentEntityType] ?? 'week')
    : 'week';
  const interval = currentEntityType
    ? (intervalByEntity[currentEntityType] ?? defaultInterval())
    : defaultInterval();
  const formattedInterval = formatDateInterval(interval, intervalUnit, false);
  const formatConnectivityValue = (value: number, unit?: string) => {
    if (!unit) return String(value);
    return unit === '%' ? `${value}${unit}` : `${value}${unit.trim()}`;
  };
  const getFeatureInfo = (feature: any) => {
    const unit = global_benchmark?.convert_unit;
    const connectivityStatusValue = feature?.connectivityStatus;
    const schoolId = feature?.id;
    const connecitivityStatusColor =
      stylePaintData[feature?.connectivityStatus ?? UNKNOWN];
    const connecitivityColor =
      stylePaintData[feature?.connectivityType ?? UNKNOWN];
    const schoolCoords = JSON.parse(
      JSON.stringify(feature?.geopoint?.coordinates ?? []),
    );
    const isLiveNotUnknown = isLive && feature?.connectivityType !== UNKNOWN;
    const connectivityValue = isLiveNotUnknown
      ? formatConnectivityValue(feature?.liveAvg ?? 0, unit)
      : t('unknown');
    const benchmarkTitle =
      entityConnectivityBenchmark === ConnectivityBenchMarks.global
        ? benchmarkNamesAllLayers[selectedLayerData?.id ?? '']
        : countryConnectivityNames[selectedLayerData?.id ?? ''];
    let staticValue = feature?.staticValue as boolean | undefined | string;
    const staticColor = stylePaintData[feature?.staticType ?? UNKNOWN];
    const schoolAtSameLocation = feature?.schoolAtSameLocation;
    if (typeof staticValue === 'boolean') {
      staticValue = staticValue === true ? 'yes' : 'no';
    } else if (staticValue === 'unknown' || !staticValue) {
      staticValue = t('unknown');
    }

    return {
      unit,
      schoolId,
      connecitivityStatusColor,
      connecitivityColor,
      schoolCoords,
      isLiveNotUnknown,
      connectivityValue,
      benchmarkTitle,
      staticValue,
      staticColor,
      connectivityStatusValue,
      schoolAtSameLocation,
    };
  };

  const features = useMemo(() => {
    const collectList = [];
    if (schoolPopupDiv) {
      collectList.push(
        ...schoolPopupDiv.map((item) => ({
          ...item,
          feature: schoolStats,
        })),
      );
    }
    if (multipleSchoolDiv) {
      collectList.push(
        ...multipleSchoolDiv.map((item) => ({
          ...item,
          feature: multipleSchoolStats?.find((school) => school.id === item.id),
        })),
      );
    }
    return collectList;
  }, [schoolPopupDiv, multipleSchoolDiv, schoolStats, multipleSchoolStats]);

  return {
    getFeatureInfo,
    isLoading,
    schoolPopupDiv,
    features,
    isLive,
    isStatic,
    countryCode,
    isSchoolView,
    isEntityBenchmark,
    formattedInterval,
    entityType: activePopup?.entityType,
  };
};

export default useSchoolPopupData;
