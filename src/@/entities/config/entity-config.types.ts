import type { EntityType } from '../types/base-entity.type';

/**
 * Field configuration for displaying entity data in popups, sidebars, etc.
 */
export interface EntityFieldConfig {
  /** Field key in the entity data */
  name: string;
  /** Display label */
  label: string;
  /** Data type for rendering */
  type: 'string' | 'number' | 'boolean' | 'array' | 'date';
  /** Whether to show this field in the popup */
  showInPopup?: boolean;
  /** Whether to show this field in the sidebar */
  showInSidebar?: boolean;
  /** Optional unit suffix (e.g., 'Mbps', 'bps') */
  unit?: string;
}

/**
 * Marker type configuration.
 * - 'circle': Simple circle markers (used by schools/legacy)
 * - 'symbol': Icon/symbol markers (used by new entities)
 */
export type MarkerType = 'circle' | 'symbol';
export type EntityLegendShape = 'circle' | 'square';
export type EntityMappedCountKey = 'entities_connected' | 'entities_total';
export type EntityConnectedGroupKey = 'connected_entities';
export type EntityMeasureCountKey = 'no_of_entities_measure';
export type EntityRealtimeGroupKey = 'real_time_connected_entities';

export interface EntityLegendConfig {
  metricSubtitle: string;
  metricTitle: string;
  statusTitle: string;
  tabLabel: string;
}

export interface EntitySidebarConfig {
  badge?: string;
  estimatedTotalInMillions?: number;
}

export interface EntityStatsConfig {
  connectedGroupKey: EntityConnectedGroupKey;
  mappedCountKey: EntityMappedCountKey;
  measureCountKey: EntityMeasureCountKey;
  realtimeGroupKey: EntityRealtimeGroupKey;
}

export interface EntityMapZoomRadius {
  zoom: number;
  radius: number;
}

export interface EntityMapAnimationConfig {
  /** Base marker radius/text-size by zoom before glow scaling is applied */
  zoomRadius: EntityMapZoomRadius[];
  /** Pulse speed multiplier. 1 means the default animation duration. */
  growSpeed: number;
  /** Minimum glow scale relative to the base zoom radius */
  glowMinScale: number;
  /** Maximum glow scale relative to the base zoom radius */
  glowMaxScale: number;
}

/**
 * Entity configuration defining visual, API, and field settings.
 * This is the core of the configuration-driven entity system.
 */
export interface EntityConfig {
  /** Entity type identifier */
  type: EntityType;
  /** Human-readable display name */
  displayName: string;
  /** URL slug for routing and API endpoints */
  slug: string;
  /** Optional icon metadata kept for future use */
  icon: string;

  /** Whether this entity is active/visible in the UI */
  active: boolean;
  /** Map marker configuration */
  markerType: MarkerType;
  /** Symbol character (only used when markerType is 'symbol') */
  markerSymbol?: string;
  /** Legend/entity chip shape symbol (e.g. ●, ■) */
  symbol: string;
  /** Sidebar/accordion labels and auxiliary UI behavior */
  sidebar: EntitySidebarConfig;
  /** Color configuration for connectivity status */
  colors: {
    primary: string;
    connected: string;
    not_connected: string;
    unknown: string;
  };

  /** Zoom level thresholds (for circle → symbol transitions) */
  zoomLevels?: {
    circleMaxZoom: number;
    symbolMinZoom: number;
  };
  /** Map dot animation and zoom sizing configuration */
  mapAnimation?: EntityMapAnimationConfig;

  /**
   * Whether this entity uses the legacy API system.
   * - true: Uses existing APIs (e.g., schools via project-connect.ts)
   * - false: Uses new generic entity API (src/api/entities.ts)
   */
  useLegacyApi: boolean;

  /**
   * API endpoint for new entities (used when useLegacyApi is false).
   * e.g., '/api/entities/health/'
   */
  apiEndpoint: string | null;

  /** Fields to display in entity popups and sidebar */
  fields: EntityFieldConfig[];

  visible: boolean;
}
