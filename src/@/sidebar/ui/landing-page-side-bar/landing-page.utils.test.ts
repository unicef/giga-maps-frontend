import { createInstance } from 'i18next';
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

const createTestT = (lng: 'en' | 'es' | 'pt'): LandingPageTranslationFn => {
  const instance = createInstance();
  instance.init({
    fallbackLng: 'en',
    lng,
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
  });
  return ((key: string, options?: Record<string, unknown>) =>
    instance.t(key, options as any)) as LandingPageTranslationFn;
};

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
    expect(en['across-no-countries_one']).toBe('across {{count}} country');
    expect(en['across-no-countries_other']).toBe('across {{count}} countries');
    expect(en['across-no-countries-and-territories_one']).toBe(
      'across {{count}} country and territory',
    );
    expect(en['across-no-countries-and-territories_other']).toBe(
      'across {{count}} countries and territories',
    );

    expect(es['across-no-countries_one']).toBe('en {{count}} país');
    expect(es['across-no-countries_other']).toBe('en {{count}} países');
    expect(es['across-no-countries-and-territories_one']).toBe(
      'en {{count}} país y territorio',
    );
    expect(es['across-no-countries-and-territories_other']).toBe(
      'en {{count}} países y territorios',
    );

    expect(pt['across-no-countries_one']).toBe('em {{count}} país');
    expect(pt['across-no-countries_other']).toBe('em {{count}} países');
    expect(pt['across-no-countries-and-territories_one']).toBe(
      'em {{count}} país e território',
    );
    expect(pt['across-no-countries-and-territories_other']).toBe(
      'em {{count}} países e territórios',
    );
  });

  describe('singular and plural country detail formatting', () => {
    it('formats singular and plural country details for school entities', () => {
      const tEn = createTestT('en');

      const singleContent = buildEntityCardContent({
        ...buildArgs(EntityType.SCHOOL),
        connectivityStats: {
          ...connectivityStats,
          countries_with_realtime_data: 1,
        },
        globalStats: {
          ...globalStats,
          countries_with_connectivity_status_mapped: 1,
          no_of_countries: 1,
        },
        t: tEn,
      });

      expect(singleContent?.metrics[0]?.detail).toBe(
        'across 1 country and territory',
      );
      expect(singleContent?.metrics[1]?.detail).toBe(
        'across 1 country and territory',
      );
      expect(singleContent?.metrics[2]?.detail).toBe(
        'across 1 country and territory',
      );

      const pluralContent = buildEntityCardContent({
        ...buildArgs(EntityType.SCHOOL),
        t: tEn,
      });

      expect(pluralContent?.metrics[0]?.detail).toBe(
        'across 95 countries and territories',
      );
      expect(pluralContent?.metrics[1]?.detail).toBe(
        'across 90 countries and territories',
      );
      expect(pluralContent?.metrics[2]?.detail).toBe(
        'across 75 countries and territories',
      );
    });

    it('formats singular and plural country details for health entities', () => {
      const tEn = createTestT('en');

      const singleContent = buildEntityCardContent({
        ...buildArgs(EntityType.HEALTH),
        connectivityStats: {
          ...connectivityStats,
          countries_with_realtime_data: 1,
        },
        globalStats: {
          ...globalStats,
          countries_with_connectivity_status_mapped: 1,
          no_of_countries: 1,
        },
        t: tEn,
      });

      expect(singleContent?.metrics[0]?.detail).toBe('across 1 country');
      expect(singleContent?.metrics[1]?.detail).toBe('across 1 country');
      expect(singleContent?.metrics[2]?.detail).toBe('across 1 country');

      const pluralContent = buildEntityCardContent({
        ...buildArgs(EntityType.HEALTH),
        t: tEn,
      });

      expect(pluralContent?.metrics[0]?.detail).toBe('across 95 countries');
      expect(pluralContent?.metrics[1]?.detail).toBe('across 90 countries');
      expect(pluralContent?.metrics[2]?.detail).toBe('across 75 countries');
    });

    it('formats country singular and plural in Spanish and Portuguese', () => {
      const tEs = createTestT('es');
      const singleEs = buildEntityCardContent({
        ...buildArgs(EntityType.SCHOOL),
        connectivityStats: {
          ...connectivityStats,
          countries_with_realtime_data: 1,
        },
        globalStats: {
          ...globalStats,
          countries_with_connectivity_status_mapped: 1,
          no_of_countries: 1,
        },
        lng: 'es',
        t: tEs,
      });
      expect(singleEs?.metrics[0]?.detail).toBe('en 1 país y territorio');
      expect(singleEs?.metrics[1]?.detail).toBe('en 1 país y territorio');
      expect(singleEs?.metrics[2]?.detail).toBe('en 1 país y territorio');

      const tPt = createTestT('pt');
      const singlePt = buildEntityCardContent({
        ...buildArgs(EntityType.SCHOOL),
        connectivityStats: {
          ...connectivityStats,
          countries_with_realtime_data: 1,
        },
        globalStats: {
          ...globalStats,
          countries_with_connectivity_status_mapped: 1,
          no_of_countries: 1,
        },
        lng: 'pt',
        t: tPt,
      });
      expect(singlePt?.metrics[0]?.detail).toBe('em 1 país e território');
      expect(singlePt?.metrics[1]?.detail).toBe('em 1 país e território');
      expect(singlePt?.metrics[2]?.detail).toBe('em 1 país e território');
    });
  });
});
