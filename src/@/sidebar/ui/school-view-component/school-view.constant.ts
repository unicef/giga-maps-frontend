import { Layers } from "../../sidebar.constant";

export const SchoolConnectivityKey = {
  [Layers.download]: 'connectivity_speed',
  [Layers.latency]: 'connectivity_latency',
  [Layers.uptime]: 'connectivity_uptime',
} as Record<Layers, string>;
