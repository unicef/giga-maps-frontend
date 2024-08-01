import { SchoolStatsType } from "~/api/types";
import { StylePaintData, UNKNOWN } from "../map/map.types";
import { ConnectivityDistribution, ConnectivityStatusDistribution } from "./sidebar.constant";

export const getNullValueText = (status: string) => {
  return UNKNOWN;
}

export const getLiveSchoolDetails = ({ schoolDetails, stylePaintData }: { schoolDetails?: SchoolStatsType, stylePaintData: StylePaintData }) => {
  const value = (schoolDetails?.connectivity_speed ?? schoolDetails?.live_avg) ?? 0;
  const type = (schoolDetails?.live_avg_connectivity ?? schoolDetails?.week_connectivity) ?? UNKNOWN;
  const color = stylePaintData[type];

  return {
    value,
    type,
    color,
  }
}

export const getStaticSchoolDetails = ({ schoolDetails, stylePaintData }: { schoolDetails: SchoolStatsType | null, stylePaintData: StylePaintData }) => {
  const value = String((schoolDetails?.coverage_type ?? schoolDetails?.field_value) ?? UNKNOWN);
  const type = (schoolDetails?.field_status ?? schoolDetails?.coverage_status) ?? ConnectivityDistribution.unknown;
  const color = stylePaintData[type];

  return {
    value,
    type,
    color,
  }
}


export const getSchoolStatus = ({ schoolDetails, stylePaintData }: { schoolDetails?: SchoolStatsType, stylePaintData: StylePaintData }) => {
  const connectivityStatusColors = stylePaintData;
  const connectivityStatus = (schoolDetails?.connectivity_status ?? schoolDetails?.statistics?.connectivity_status ?? ConnectivityStatusDistribution.unknown) as ConnectivityStatusDistribution;
  const connectivityStatusColor = connectivityStatusColors[connectivityStatus]
  return {
    connectivityStatus,
    connectivityStatusColor
  }
}