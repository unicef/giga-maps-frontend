import { GigaLayerFormType, LayerTypeChoices } from "../types/giga-layer.type";

export enum DataSourceType {
  SCHOOL_MASTER = 'SCHOOL_MASTER',
  DAILY_CHECK_APP = 'DAILY_CHECK_APP',
  QOS = 'QOS'
}
export const DataSourceName = {
  [DataSourceType.SCHOOL_MASTER]: 'School master',
  [DataSourceType.DAILY_CHECK_APP]: 'Daily check app',
  [DataSourceType.QOS]: 'QOS'
} as Record<string, string>;

export enum LayerType {
  LIVE = "LIVE",
  STATIC = "STATIC"
}

export const GigaLayerNames = {
  [LayerType.LIVE]: 'Live Connectivity',
  [LayerType.STATIC]: 'Static'
}

export const LayerDataSource = {
  [LayerType.LIVE]: [DataSourceType.DAILY_CHECK_APP, DataSourceType.QOS],
  [LayerType.STATIC]: [DataSourceType.SCHOOL_MASTER]
}

export const defaultGigaLayerForm = {
  code: '',
  name: '',
  icon: '',
  description: '',
  type: undefined,
  dataSource: [],
  sourceType: [],
  dataSourceColumn: null,
  benchmarkConvertUnit: '',
  applicableCountries: [],
  isReverse: false,
  legendConfigs: {
    good: {
      values: [],
      labels: "Good"
    },
    moderate: {
      values: [],
      labels: "Moderate"
    },
    bad: {
      values: [],
      labels: "Bad"
    },
    unknown: {
      values: [],
      labels: "Unknown"
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
