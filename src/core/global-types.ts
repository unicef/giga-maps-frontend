export type PointCoordinates = [number, number];

export interface GeoJSONPoint {
  type?: 'Point';
  coordinates: PointCoordinates;
}

interface GeoJSONMultiPoint {
  type?: 'MultiPoint';
  coordinates: PointCoordinates[];
}

interface GeoJSONLineString {
  type?: 'LineString';
  coordinates: PointCoordinates[];
}

interface GeoJSONMultiLineString {
  type?: 'MultiLineString';
  coordinates: PointCoordinates[][];
}

interface GeoJSONPolygon {
  type?: 'Polygon';
  coordinates: PointCoordinates[][];
}

interface GeoJSONMultiPolygon {
  type?: 'MultiPolygon';
  coordinates: PointCoordinates[][][];
}

export type GeoJSONGeometry =
  | GeoJSONPoint
  | GeoJSONMultiPoint
  | GeoJSONLineString
  | GeoJSONMultiLineString
  | GeoJSONPolygon
  | GeoJSONMultiPolygon;

export interface GeoJSONFeature<T extends GeoJSONGeometry | null = null> {
  type: 'Feature';
  geometry: T;
  properties: { [key: string]: unknown };
}

export interface GeoJSONFeatureCollection<T extends GeoJSONGeometry | null = null> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<T>[];
}

export type ObjectType = Record<string, string | number | undefined>;