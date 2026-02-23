import { GeoJSONPoint } from '~/core/global-types';
import { GraphData } from '~/api/types';

/**
 * Supported entity types in the system.
 * 'school' uses legacy APIs, all others use new generic entity APIs.
 */
export type EntityType = 'school' | 'health';

/**
 * Base entity interface shared by all entity types.
 * Contains common fields that every entity must have.
 */
export interface BaseEntity {
  id: number;
  entity_type: EntityType;
  name: string;
  geopoint: GeoJSONPoint;
  country_name: string;
  admin1_name?: string;
  admin2_name?: string;
  admin1_id?: number;
  admin1_code?: string;
  external_id: string;
  environment?: string;
  connectivity_status: string;
  coverage_status?: string;
  created?: string;
  modified?: string;
}

/**
 * Fully dynamic statistics — no assumed fields.
 * Backend determines what statistics each entity type has.
 * The index signature allows any field from the API response.
 */
export type EntityStatistics = Record<string, unknown>;

/**
 * Full entity info including entity data, statistics, and graph data.
 * Generic type parameter T allows entity-specific typing.
 */
export interface EntityInfoType<T extends BaseEntity = BaseEntity> {
  entity: T;
  statistics: EntityStatistics;
  graph_data?: GraphData[];
  benchmark_metadata?: {
    base_benchmark: string;
    benchmark_unit: string;
    benchmark_value: string;
    parameter_column_unit: string;
    round_unit_value: string;
    rounded_benchmark_value: string;
    display_unit: string;
    convert_unit?: string;
  };
}
