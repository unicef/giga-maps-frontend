import type { EntitySidebarConfig } from '~/@/entities/config/entity-config.types';
import type { EntityType } from '~/@/entities/types/base-entity.type';

export type CardBarData = {
  colors: string[];
  entityLabel: string;
  labels: string[];
  total: number;
  type: string;
  values: number[];
};

export type CardMetric = {
  bar?: CardBarData;
  detail: string;
  estimate?: string;
  label: string;
  tooltip?: string;
  value: number;
};

export type EntityCardData = {
  badge?: string;
  collapsedRows: { label: string; value: number; totalValue?: number }[];
  entitiesTotal?: number;
  isFiltered?: boolean;
  title: string;
  value: EntityType;
  t: LandingPageTranslationFn;
};

export type EntityCardContentData = {
  metrics: CardMetric[];
  title: string;
  value: EntityType;
};

export type EntitySummaryCardData = {
  accordionContent: EntityCardContentData;
  accordionItem: EntityCardData;
};

export type LandingPageTranslationFn = (key: string, options?: Record<string, unknown>) => string;

export type LandingPageStylePaintData = {
  bad: string;
  good: string;
  moderate: string;
  unknown: string;
};

export type LandingPageStatsGroup = Record<string, number> | undefined;

export type LandingPageEntityStats = {
  countries_with_realtime_data?: number;
  countries_with_connectivity_status_mapped?: number;
  no_of_countries?: number;
  [key: string]: unknown;
};
