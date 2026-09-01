import { BaseEntity, EntityType } from './base-entity.type';

/**
 * School entity type extending BaseEntity.
 * Maps to existing SchoolStatsType fields in the legacy system.
 * Schools use legacy APIs (useLegacyApi: true in registry).
 */
export interface SchoolEntityType extends BaseEntity {
  entity_type: EntityType.SCHOOL;
  education_level?: string;
  school_type?: string;
  giga_id_school?: string;
  is_rt_connected?: boolean;
  week_connectivity?: string;
  field_status?: string;
  field_value?: string;
  coverage_type?: string;
  live_avg_connectivity?: string;
  connectivity_speed?: number;
  live_avg?: number;
  connectivity_latency?: number;
  connectivity_uptime?: number;
  admin1_description_ui_label?: string;
  admin2_description_ui_label?: string;
  schools_at_same_location?: {
    count: number;
    school_ids: number[];
  };
}

/**
 * School-specific statistics matching existing SchoolInfoStats.
 * Standalone interface (not extending EntityStatistics since that's fully dynamic now).
 */
export interface SchoolStatistics {
  num_students: number;
  num_teachers: number;
  num_classroom: number;
  num_latrines: number;
  running_water: boolean;
  electricity_availability: boolean;
  computer_lab: boolean;
  num_computers: number;
  connectivity_govt?: string;
  computer_availability?: string;
  num_students_girls?: number;
  num_students_boys?: number;
  num_students_other?: number;
  num_teachers_female?: number;
  num_teachers_male?: number;
  teachers_trained?: number;
  sustainable_business_model?: string;
  device_availability?: string;
  num_tablets?: number;
  num_robotic_equipment?: number;
}
