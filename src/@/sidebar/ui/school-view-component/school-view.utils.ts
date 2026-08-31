import { SchoolStatsType } from '~/api/types';

import {
  StatisticConfig,
  groupOrder,
} from '../../config/school-information-config';

export const getDisplayValue = (value: unknown) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};

export const toTitleCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatStaticFieldValue = (value: unknown) => {
  const displayValue = getDisplayValue(value);
  if (displayValue === 'N/A') return displayValue;
  if (displayValue.toLowerCase() === 'true') return 'Yes';
  if (displayValue.toLowerCase() === 'false') return 'No';
  return toTitleCase(displayValue);
};

export const getEntityGigaId = (entity: SchoolStatsType) => {
  const entityRecord = entity as unknown as Record<string, unknown>;
  return entity.giga_id_school ?? entityRecord.giga_id;
};

export const getCollapsedEntityIdLabel = (entity: SchoolStatsType) => {
  const entityRecord = entity as unknown as Record<string, unknown>;
  return (
    entity.external_id ??
    entity.giga_id_school ??
    entityRecord.giga_id ??
    entity.id
  );
};

export const connectivityColorClassByStatus: Record<string, string> = {
  good: 'text-success!',
  moderate: 'text-warning!',
  no_internet: 'text-error-brand!',
  bad: 'text-error-brand!',
  unknown: 'text-neutral!',
};

export const getEntityCountLabel = (entity: SchoolStatsType) => {
  const stats = entity.statistics as unknown as
    | Record<string, unknown>
    | undefined;
  const students =
    stats?.num_students ??
    (entity as unknown as Record<string, unknown>).num_students;
  if (!students) return null;
  return `${students} students`;
};

export const groupStatistics = (statistics: StatisticConfig[]) => {
  const groups = statistics.reduce(
    (acc, stat) => {
      if (!acc[stat.group]) {
        acc[stat.group] = [];
      }
      acc[stat.group].push(stat);
      return acc;
    },
    {} as Record<string, StatisticConfig[]>,
  );

  return groupOrder
    .filter((group) => groups[group]?.length)
    .map((group) => ({ groupName: group, stats: groups[group] }));
};

export const formatConnectivityValue = (value: number, valueUnit?: string) => {
  if (!valueUnit) return String(value);
  return valueUnit === '%' ? `${value}${valueUnit}` : `${value} ${valueUnit}`;
};

export type SameLocationValue = {
  count?: number;
  school_ids?: unknown;
  entity_ids?: unknown;
  ids?: unknown;
} & Record<string, unknown>;

export const toNumericIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
};

export const getSameLocationRecordCandidates = (
  entity: SchoolStatsType,
  entityType: string,
): SameLocationValue[] => {
  const record = entity as unknown as Record<string, unknown>;
  return [
    record.schools_at_same_location,
    record.entities_at_same_location,
    record[`${entityType}_at_same_location`],
    record[`${entityType}s_at_same_location`],
    record.same_location_entities,
    record.same_location,
  ].filter(
    (value): value is SameLocationValue =>
      Boolean(value) && typeof value === 'object' && !Array.isArray(value),
  );
};

export const getEntitySameLocationIds = (
  entity: SchoolStatsType,
  entityType: string,
): number[] => {
  const ids = new Set<number>([entity.id]);
  const record = entity as unknown as Record<string, unknown>;
  const idKeys = [
    'school_ids',
    'entity_ids',
    'ids',
    `${entityType}_ids`,
    `${entityType}_entity_ids`,
  ];

  getSameLocationRecordCandidates(entity, entityType).forEach(
    (sameLocation) => {
      idKeys.forEach((key) => {
        toNumericIds(sameLocation[key]).forEach((id) => ids.add(id));
      });
    },
  );

  idKeys.forEach((key) => {
    toNumericIds(record[key]).forEach((id) => ids.add(id));
  });

  return Array.from(ids);
};
