import { describe, expect, it } from 'vitest';

import { DEFAULT_ENTITY_REGISTRY } from '~/@/entities/config/entity-registry';
import { EntityType } from '~/@/entities/types/base-entity.type';
import type {
  EntityConnectivityStat,
  EntityGlobalStats,
} from '~/api/types';
import en from '~/core/i18n/resources/en.json';
import es from '~/core/i18n/resources/es.json';
import pt from '~/core/i18n/resources/pt.json';

import type { LandingPageTranslationFn } from './landing-page.types';
import { buildEntityCard, buildEntityCardContent } from './landing-page.utils';

const translations: Record<string, string> = {
  school: 'Schools',
  'health-facilities': 'Health facilities',
  'connected-schools': 'Connected schools',
  'connected-health-facilities': 'Connected health facilities',
};

const t: LandingPageTranslationFn = (key) => translations[key] ?? key;

const globalStats = {
  connected_entities: {
    connected: 80,
    not_connected: 15,
    unknown: 5,
  },
  connectivity_global_benchmark: {
    unit: 'Mbps',
    value: 20,
  },
  countries_with_connectivity_status_mapped: 90,
  entities_total: 100,
  no_of_countries: 95,
} satisfies EntityGlobalStats;

const connectivityStats = {
  countries_with_realtime_data: 75,
  no_of_entities_measure: 60,
  real_time_connected_entities: {
    good: 30,
    moderate: 20,
    no_internet: 5,
    unknown: 5,
  },
} as EntityConnectivityStat;

const stylePaintData = {
  bad: '#f00',
  good: '#0f0',
  moderate: '#ff0',
  unknown: '#999',
};

const buildArgs = (entityType: EntityType) => ({
  config: DEFAULT_ENTITY_REGISTRY[entityType],
  connectivityStats,
  entityType,
  globalStats,
  lng: 'en',
  stylePaintData,
  t,
});

describe('landing page entity copy', () => {
  it('uses school-specific copy and retains school tooltips and estimate', () => {
    const card = buildEntityCard(buildArgs(EntityType.SCHOOL));
    const content = buildEntityCardContent(buildArgs(EntityType.SCHOOL));

    expect(card?.collapsedRows[1]?.label).toBe('Connected schools');
    expect(content?.metrics.map(({ detail }) => detail)).toEqual([
      'across-no-countries-and-territories',
      'across-no-countries-and-territories',
      'across-no-countries-and-territories',
    ]);
    expect(content?.metrics[0]?.estimate).toBe('/6M estimated');
    expect(content?.metrics.every(({ tooltip }) => Boolean(tooltip))).toBe(true);
  });

  it('uses health-specific copy without health tooltips or estimate', () => {
    const card = buildEntityCard(buildArgs(EntityType.HEALTH));
    const content = buildEntityCardContent(buildArgs(EntityType.HEALTH));

    expect(card?.collapsedRows[1]?.label).toBe('Connected health facilities');
    expect(content?.metrics.map(({ detail }) => detail)).toEqual([
      'across-no-countries',
      'across-no-countries',
      'across-no-countries',
    ]);
    expect(content?.metrics[0]?.estimate).toBeUndefined();
    expect(content?.metrics.every(({ tooltip }) => tooltip === undefined)).toBe(
      true,
    );
  });

  it('defines the new copy in every supported language', () => {
    expect(en['connected-schools']).toBe('Connected schools');
    expect(es['connected-schools']).toBe('Escuelas conectadas');
    expect(pt['connected-schools']).toBe('Escolas conectadas');

    expect(en['connected-health-facilities']).toBe(
      'Connected health facilities',
    );
    expect(es['connected-health-facilities']).toBe(
      'Instalaciones de salud conectadas',
    );
    expect(pt['connected-health-facilities']).toBe(
      'Instalações de saúde conectadas',
    );

    expect(en['go-to-health-facility-page']).toBe(
      'Go to health facility page',
    );
    expect(es['go-to-health-facility-page']).toBe(
      'Ir a la página de la instalación de salud',
    );
    expect(pt['go-to-health-facility-page']).toBe(
      'Ir para a página da instalação de saúde',
    );
  });
});
