import { ConnectivityDistribution, ConnectivityStatusDistribution, CoverageBenchMarks, Layers } from "../../../sidebar.constant";

export const LayerHeadingNames = {
  [Layers.download]: "Download speed",
  [Layers.latency]: "Latency",
  [Layers.uptime]: "Uptime",
  [Layers.coverage]: "Coverage Data"
} as Record<Layers, string>

export const LayerConnectivityUnit = {
  [Layers.download]: "Mbps",
  [Layers.latency]: "MS",
  [Layers.uptime]: "Days",
} as Record<Layers, string>

export const LayerDistributionUnit = [ConnectivityDistribution.good, ConnectivityDistribution.moderate, ConnectivityDistribution.bad, ConnectivityDistribution.unknown]
export const ConnectivityDistributionNames = {
  [ConnectivityDistribution.good]: "good",
  [ConnectivityDistribution.moderate]: "moderate",
  [ConnectivityDistribution.noInternet]: "bad",
  [ConnectivityDistribution.bad]: "bad",
  [ConnectivityDistribution.unknown]: "unknown",
} as Record<string, string>

export const ConnectivityColorNames = {
  [ConnectivityDistribution.good]: "green",
  [ConnectivityDistribution.moderate]: "orange",
  [ConnectivityDistribution.noInternet]: "red",
  [ConnectivityDistribution.unknown]: "grey",
}

export const ConnectivityStatusNames = {
  [ConnectivityStatusDistribution.connected]: "connected",
  [ConnectivityStatusDistribution.notConnected]: "not-connected",
  [ConnectivityStatusDistribution.unknown]: "unknown",
} as Record<string, string>

export const ConnectivityStatusColorNames = {
  [ConnectivityStatusDistribution.connected]: "green",
  [ConnectivityStatusDistribution.notConnected]: "red",
  [ConnectivityStatusDistribution.unknown]: "grey",
}

export const CoverageBenchmarkNames = {
  [CoverageBenchMarks.G5_4]: "5G/4G",
  [CoverageBenchMarks.G3_2]: "3G/2G",
  [CoverageBenchMarks.noCoverage]: "No coverage",
  [CoverageBenchMarks.unknown]: "Unknown",
} as Record<string, string>

export const CoverageColorNames = {
  [CoverageBenchMarks.G5_4]: "good",
  [CoverageBenchMarks.G3_2]: "moderate",
  [CoverageBenchMarks.noCoverage]: "bad",
  [CoverageBenchMarks.unknown]: "unknown",
} as Record<string, string>

export const CoverageKeyMapping = {
  "good": CoverageBenchMarks.G5_4,
  "moderate": CoverageBenchMarks.G3_2,
  "bad": CoverageBenchMarks.noCoverage,
  "unknown": CoverageBenchMarks.unknown
} as Record<string, string>


export const getConnectivityLogicalValues = (value = '', unit: string, baseValue = 1, isReverse = false): Record<string, string> => {
  let mainValue = value;
  let greaterSign = '>';
  let lessSign = '<';
  if (isReverse) {
    greaterSign = '<';
    lessSign = '>';
  }
  return {
    [ConnectivityDistribution.good]: `(${greaterSign} ${mainValue} ${unit})`,
    [ConnectivityDistribution.moderate]: `(${isReverse ? mainValue : baseValue} - ${isReverse ? baseValue : mainValue} ${unit})`,
    [ConnectivityDistribution.bad]: `(${lessSign}${baseValue} ${unit})`,
    [ConnectivityDistribution.unknown]: '',
  }

}