import { EntityType } from '../types/base-entity.type';
import type { EntityConfig } from './entity-config.types';

/**
 * Default entity registry - hardcoded fallback configuration.
 *
 * This is ONLY the default data. The live registry lives in the
 * Effector store `$entityRegistry` in entity.model.ts.
 *
 * On app load:
 * 1. Store initializes with these defaults
 * 2. fetchEntityRegistryFx tries to load from API
 * 3. API response merges with defaults via store update
 * 4. If API fails, defaults remain
 */
export const DEFAULT_ENTITY_REGISTRY: Record<EntityType, EntityConfig> = {
  [EntityType.SCHOOL]: {
    type: EntityType.SCHOOL,
    displayName: 'Schools',
    icon: 'Education',
    active: true,
    visible: true,
    markerType: 'circle',
    symbol: '●',
    sidebar: {
      badge: 'GigaMaps',
      connectedDetailTranslationKey: 'across-no-countries',
      connectedLabel: 'Connected Schools',
      connectedTooltip: 'School connectivity status mapped using government data or a real-time measurement source.',
      estimatedTotalInMillions: 6,
      footerLogoVariant: 'school',
      locationsMappedLabel: 'Locations mapped',
      locationsMappedTooltip: 'School geolocations mapped using government, Giga’s AI model and supplemental open data.',
      mappedDetailTranslationKey: 'across-no-countries-and-territories',
      reportingDetailTranslationKey: 'across-no-countries',
      reportingLabel: 'Reporting internet quality',
      reportingTooltip: 'Schools with periodical in-school internet measurements from software and hardware-based solutions.',
      title: 'Schools',
    },
    stats: {
      connectedGroupKey: 'connected_entities',
      mappedCountKey: 'entities_connected',
      measureCountKey: 'no_of_entities_measure',
      realtimeGroupKey: 'real_time_connected_entities',
    },
    colors: {
      primary: '#0062FF',
      connected: '#24A148',
      not_connected: '#DA1E28',
      unknown: '#8D8D8D',
    },
    useLegacyApi: true,
    apiEndpoint: null,
    fields: [
      { name: 'education_level', label: 'Education Level', type: 'string', showInPopup: true, showInSidebar: true },
      { name: 'school_type', label: 'School Type', type: 'string', showInPopup: true, showInSidebar: true },
      { name: 'environment', label: 'Environment', type: 'string', showInPopup: false, showInSidebar: true },
      { name: 'num_students', label: 'Students', type: 'number', showInPopup: true, showInSidebar: true },
      { name: 'num_teachers', label: 'Teachers', type: 'number', showInPopup: false, showInSidebar: true },
      { name: 'num_classroom', label: 'Classrooms', type: 'number', showInPopup: false, showInSidebar: true },
      { name: 'connectivity_speed', label: 'Connectivity Speed', type: 'number', showInPopup: true, showInSidebar: true, unit: 'Mbps' },
      { name: 'connectivity_latency', label: 'Latency', type: 'number', showInPopup: false, showInSidebar: true, unit: 'ms' },
      { name: 'electricity_availability', label: 'Electricity', type: 'boolean', showInPopup: false, showInSidebar: true },
    ],
  },

  [EntityType.HEALTH]: {
    type: EntityType.HEALTH,
    displayName: 'Health centers',
    icon: 'Hospital',
    active: true,
    visible: true,
    markerType: 'symbol',
    symbol: '■',
    sidebar: {
      connectedDetailTranslationKey: 'across-no-countries',
      connectedLabel: 'Connected Health centers',
      connectedTooltip: 'Health centers with mapped connectivity status.',
      footerLogoVariant: 'none',
      locationsMappedLabel: 'Locations mapped',
      locationsMappedTooltip: 'Health center locations mapped from currently available datasets.',
      mappedDetailTranslationKey: 'across-no-countries',
      reportingDetailTranslationKey: 'across-no-countries',
      reportingLabel: 'Reporting internet quality',
      reportingTooltip: 'Health centers reporting internet quality.',
      title: 'Health centers',
    },
    stats: {
      connectedGroupKey: 'connected_entities',
      mappedCountKey: 'entities_total',
      measureCountKey: 'no_of_entities_measure',
      realtimeGroupKey: 'real_time_connected_entities',
    },
    colors: {
      primary: '#0F62FE',
      connected: '#198038',
      not_connected: '#A2191F',
      unknown: '#525252',
    },
    zoomLevels: {
      circleMaxZoom: 7.99,
      symbolMinZoom: 8,
    },
    useLegacyApi: false,
    apiEndpoint: '/api/entities/health/',
    fields: [],
  },
};
