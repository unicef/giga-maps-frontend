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

/**
 * Entity configuration defining visual, API, and field settings.
 * This is the core of the configuration-driven entity system.
 */
export interface EntityConfig {
  /** Entity type identifier */
  type: EntityType;
  /** Human-readable display name */
  displayName: string;
  /** Carbon Design System icon name */
  icon: string;

  /** Map marker configuration */
  markerType: MarkerType;
  /** Symbol character (only used when markerType is 'symbol') */
  markerSymbol?: string;

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
}
