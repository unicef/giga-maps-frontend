import { GigaLayerFormType, LayerTypeChoices } from "../types/giga-layer.type";

export enum EntityCode {
  SCHOOL = 'school',
  HEALTH = 'health'
}

export enum DataSourceType {
  HEALTH_MASTER = 'HEALTH_MASTER',
  SCHOOL_MASTER = 'SCHOOL_MASTER',
  DAILY_CHECK_APP = 'DAILY_CHECK_APP',
  QOS = 'QOS'
}
export const DataSourceName = {
  [DataSourceType.HEALTH_MASTER]: 'Health master',
  [DataSourceType.SCHOOL_MASTER]: 'School master',
  [DataSourceType.DAILY_CHECK_APP]: 'Daily check app',
  [DataSourceType.QOS]: 'QOS'
} as Record<string, string>;

export const GigaLayerNames = {
  [LayerTypeChoices.LIVE]: 'Live Connectivity',
  [LayerTypeChoices.STATIC]: 'Static'
}

export type LayerDataSourceKey = `${EntityCode}_${LayerTypeChoices}`;

export const LayerDataSourceByEntityCode: Record<LayerDataSourceKey, DataSourceType[]> = {
  [`${EntityCode.SCHOOL}_${LayerTypeChoices.LIVE}`]: [DataSourceType.DAILY_CHECK_APP, DataSourceType.QOS],
  [`${EntityCode.HEALTH}_${LayerTypeChoices.LIVE}`]: [DataSourceType.DAILY_CHECK_APP, DataSourceType.QOS],
  [`${EntityCode.SCHOOL}_${LayerTypeChoices.STATIC}`]: [DataSourceType.SCHOOL_MASTER],
  [`${EntityCode.HEALTH}_${LayerTypeChoices.STATIC}`]: [DataSourceType.HEALTH_MASTER],
}

export const defaultGigaLayerForm = {
  code: '',
  name: '',
  icon: '',
  description: '',
  type: undefined,
  entityType: '',
  dataSource: [],
  sourceType: [],
  dataSourceColumn: null,
  benchmarkConvertUnit: '',
  applicableCountries: [],
  isReverse: false,
  legendConfigs: {
    good: {
      values: [],
      labels: "Good",
      tooltip: ""
    },
    moderate: {
      values: [],
      labels: "Moderate",
      tooltip: ""
    },
    bad: {
      values: [],
      labels: "Bad",
      tooltip: ""
    },
    unknown: {
      values: [],
      labels: "Unknown",
      tooltip: ""
    }
  },
  globalBenchmark: null
} as GigaLayerFormType;

export const DataSourceStatusChoices = {
  DRAFT: "#CDD3DA",
  PUBLISHED: "#B9EFCB",
  DISABLED: "#FFD7D9",
  READY_TO_PUBLISH: "#d9ebff",
} as Record<string, string>

export const DataSourceStatusNames = {
  DRAFT: 'In Draft',
  PUBLISHED: 'Published',
  DISABLED: 'Deactivated',
  READY_TO_PUBLISH: 'Ready to publish'
}

export const LayerTypeNames = {
  [LayerTypeChoices.LIVE]: 'Live connectivity',
  [LayerTypeChoices.STATIC]: 'Static'
} as Record<string, string>
