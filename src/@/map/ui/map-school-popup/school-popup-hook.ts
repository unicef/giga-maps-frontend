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
import {
  $getSchoolParams,
  $schoolStatsMap,
  schoolStatsMap,
} from '~/@/sidebar/sidebar.model';
import { fetchSchoolPopupDataFx } from '~/api/project-connect';
import { $mapRoutes } from '~/core/routes';
import { IntervalUnit } from '~/lib/date-fns-kit/types';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';
import { $schoolPopupData } from '../../map.init';
import {
  $activeSchoolPopup,
  $multipleSchoolPopup,
  $schoolClickedPopupDiv,
} from '../../map.model';
import { UNKNOWN } from '../../map.types';

export type MappedFeature = ReturnType<typeof schoolStatsMap>;

export type PopupFeatureItem = {
  id: number;
  element: HTMLElement;
  isClicked: boolean;
  feature?: MappedFeature | null;
  entityType?: EntityType;
};

export type FeatureInfo = {
  unit?: string;
  schoolId?: number;
  connecitivityStatusColor?: string;
  connecitivityColor?: string;
  schoolCoords: number[];
  isLiveNotUnknown: boolean;
  connectivityValue: string;
  benchmarkTitle: string;
  staticValue: string;
  staticColor?: string;
  connectivityStatusValue?: string;
  schoolAtSameLocation?: {
    count: number;
    schoolIds: number[];
  };
  isLive: boolean;
  isStatic: boolean;
  isEntityBenchmark: boolean;
};

const useSchoolPopupData = () => {
  const { t } = useTranslation();
  const { schools: isSchoolView } = useStore($mapRoutes);
  const activePopup = useStore($activeSchoolPopup);
  const { entityType: routeEntityType } = useStore($getSchoolParams);
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
  const currentEntityType =
    activePopup?.entityType ?? routeEntityType;
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
  const intervalUnit: IntervalUnit = currentEntityType
    ? (intervalUnitByEntity[currentEntityType] ?? IntervalUnit.week)
    : IntervalUnit.week;
  const interval = currentEntityType
    ? (intervalByEntity[currentEntityType] ?? defaultInterval())
    : defaultInterval();
  const formattedInterval = formatDateInterval(interval, intervalUnit, false);
  const formatConnectivityValue = (value: number, unit?: string) => {
    if (!unit) return String(value);
    return unit === '%' ? `${value}${unit}` : `${value}${unit.trim()}`;
  };
  const getFeatureInfo = (
    feature: MappedFeature | null | undefined,
    itemEntityType?: EntityType,
  ): FeatureInfo => {
    const resolvedEntityType =
      itemEntityType ?? currentEntityType ?? EntityType.SCHOOL;
    const targetLayerData = resolvedEntityType
      ? selectedLayerDataByEntity[resolvedEntityType]
      : undefined;
    const targetLayerTypeUtils = currentLayerTypeUtilsByEntity[
      resolvedEntityType ?? ('' as EntityType)
    ] ?? {
      isLive: false,
      isStatic: false,
      isSchoolStatus: false,
    };
    const targetConnectivityBenchmark =
      (resolvedEntityType
        ? connectivityBenchMarksByEntity[resolvedEntityType]
        : undefined) ?? ConnectivityBenchMarks.global;
    const targetIsEntityBenchmark =
      (resolvedEntityType
        ? isSchoolBenchmarkByEntity[resolvedEntityType]
        : false) ?? false;
    const { isLive: itemIsLive, isStatic: itemIsStatic } = targetLayerTypeUtils;
    const { global_benchmark } = targetLayerData ?? {};

    const unit = global_benchmark?.convert_unit;
    const connectivityStatusValue = feature?.connectivityStatus;
    const schoolId = feature?.id;
    const connecitivityStatusColor =
      stylePaintData[feature?.connectivityStatus ?? UNKNOWN];
    const connecitivityColor =
      stylePaintData[feature?.connectivityType ?? UNKNOWN];
    const schoolCoords: number[] = Array.isArray(feature?.geopoint?.coordinates)
      ? (feature.geopoint.coordinates as number[])
      : [];
    const isLiveNotUnknown = itemIsLive && feature?.connectivityType !== UNKNOWN;
    const connectivityValue = isLiveNotUnknown
      ? formatConnectivityValue(feature?.liveAvg ?? 0, unit)
      : t('unknown');
    const benchmarkTitle =
      targetConnectivityBenchmark === ConnectivityBenchMarks.global
        ? (benchmarkNamesAllLayers[targetLayerData?.id ?? ''] ?? '')
        : (countryConnectivityNames[targetLayerData?.id ?? ''] ?? '');
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
      isLive: itemIsLive,
      isStatic: itemIsStatic,
      isEntityBenchmark: targetIsEntityBenchmark,
    };
  };

  const features = useMemo<PopupFeatureItem[]>(() => {
    const collectList: PopupFeatureItem[] = [];
    if (schoolPopupDiv) {
      collectList.push(
        ...schoolPopupDiv.map((item) => ({
          ...item,
          isClicked: item.isClicked ?? false,
          feature: schoolStats,
          entityType: activePopup?.entityType ?? routeEntityType ?? EntityType.SCHOOL,
        })),
      );
    }
    if (multipleSchoolDiv) {
      collectList.push(
        ...multipleSchoolDiv.map((item) => ({
          ...item,
          isClicked: item.isClicked ?? false,
          feature: multipleSchoolStats?.find((school) => school.id === item.id) ?? null,
          entityType: routeEntityType ?? EntityType.SCHOOL,
        })),
      );
    }
    return collectList;
  }, [
    schoolPopupDiv,
    multipleSchoolDiv,
    schoolStats,
    multipleSchoolStats,
    activePopup?.entityType,
    routeEntityType,
  ]);

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
    entityType: currentEntityType as EntityType | undefined,
  };
};

export default useSchoolPopupData;
