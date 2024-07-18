import type mapboxGl from 'mapbox-gl';

import { gigaLayerSource } from './map.init';

export type Style = 'dark' | 'light' | 'satellite' | 'accessible' | 'street';
export type Center = mapboxGl.LngLatLike;
export type Map = mapboxGl.Map;
export type Marker = mapboxGl.Marker;

export const UNKNOWN = "unknown";
export type StylePaintData = {
  allCountryColor: string;
  notCountryColor: string;
  countryColor: string;
  countryOutline: string;
  connected: string;
  good: string;
  moderate: string;
  no_internet: string;
  not_connected: string;
  bad: string;
  unknown: string;
} & Record<string, string>;

export type InitMapOptions = {
  style: Style;
  container: HTMLElement;
  center?: Center;
  zoom?: number;
};

export type MapType = 'connectivity' | 'coverage';

export type ChangeLayerOptions = ({
  refresh?: boolean;
  timeout?: number;
} & ReturnType<typeof gigaLayerSource.getState>)

export type UpdateCoverageFilterOptions = Pick<ChangeLayerOptions, "map" | "coverageFilter" | "lastSelectedLayer" | "layerUtils">

export type UpdateConnectivityFilterOptions = Pick<ChangeLayerOptions, "map" | "connectivitySpeedFilter" | "lastSelectedLayer" | "layerUtils">

export type UpdateConnectivityType = Pick<ChangeLayerOptions, "map" | "lastSelectedLayer" | "layerUtils">

export type SchoolMarker = {
  id: number;
  marker: Marker;
}