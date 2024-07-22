import type mapboxGl from 'mapbox-gl';

import { Map, MapType, StylePaintData } from '~/@/map/map.types';
import { Country, CountryGeometry } from '~/api/types';

import { GeoJSONFeatureCollection as FeatureCollection } from "../../core/global-types";
import { CountryAdminLevel } from './country.constant';

export type UpdateCountry = {
  map: Map | null;
  paintData: StylePaintData;
  country: Country | null;
};

export type UpdateSchools = {
  map: Map | null;
  schools: FeatureCollection | null;
  mapType: MapType;
  paintData: StylePaintData;
};

export type UpdateGlobalSchools = {
  map: Map | null;
  paintData: StylePaintData;
  schoolsGlobal: FeatureCollection | null;
  countryCode: string;
};

export type UpdateSchoolsColors = {
  map: Map | null;
  mapType: MapType;
  paintData: StylePaintData;
};

export type ZoomToCountryBounds = {
  map: Map | null;
  countryCode: string;
  countriesGeometry: CountryGeometry[] | null;
  country: Country | null;
  isMobile: boolean;
  selectedLevel: number;
  levelsCode: string[];
  zoomedCountryCode: string;
  schoolFocusLatLng: number[]
};

export type LeaveCountryRoute = {
  map: Map | null;
  paintData: StylePaintData;
  popup: mapboxGl.Popup | null;
};

export type AddCountries = {
  map: Map;
  paintData: StylePaintData;
  countriesGeoJson: FeatureCollection | null;
  countryCode: string;
  selectedLevel: number;
  levelsCode: string[]
  level?: CountryAdminLevel;
  isAdminBoundaries: boolean;
  isTilesAndLables: boolean;
  worldView: string;
  style: string;
  isMobile: boolean;
};
