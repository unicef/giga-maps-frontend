import { changeCountryCode } from '~/@/country/country.model';
import { ConnectivityBenchMarks } from '~/@/sidebar/sidebar.constant';
import {
  $countryLegendSourceLabelsById,
  $layerLegendSourceLabelsById,
  buildCurrentLayerLegends,
} from '~/@/sidebar/sidebar.model';
import { fetchCountryFx, fetchLayerListFx } from '~/api/project-connect';

const stylePaintData = {
  good: '#0f0',
  moderate: '#ff0',
  bad: '#f00',
  unknown: '#999',
} as never;

const englishLegends = {
  good: { values: ['true'], labels: 'Good', tooltip: 'Has data' },
  moderate: { values: [], labels: 'Moderate', tooltip: '' },
  bad: { values: [], labels: 'Bad', tooltip: '' },
  unknown: { values: [], labels: 'Unknown', tooltip: '' },
};

const spanishLegends = {
  good: { values: ['true'], labels: 'Bien', tooltip: 'Tiene datos' },
  moderate: { values: [], labels: 'Moderado', tooltip: '' },
  bad: { values: [], labels: 'Malo', tooltip: '' },
  unknown: { values: [], labels: 'Desconocido', tooltip: '' },
};

const connectedEntities = { Good: 173, Moderate: 4, Bad: 2, Unknown: 1 };

const countFor = (legends: ReturnType<typeof buildCurrentLayerLegends>) =>
  Object.fromEntries(
    legends.values.map(({ key, sourceLabel }) => [
      key,
      connectedEntities[sourceLabel as keyof typeof connectedEntities] ?? 0,
    ]),
  );

const englishSourceLabels = {
  good: 'Good',
  moderate: 'Moderate',
  bad: 'Bad',
  unknown: 'Unknown',
};

const translatedLegends = (labels: string[]) =>
  Object.fromEntries(
    Object.keys(englishLegends).map((key, index) => [
      key,
      { values: [], labels: labels[index], tooltip: '' },
    ]),
  );

describe('buildCurrentLayerLegends with a translated layer', () => {
  test.each([
    ['en', ['Good', 'Moderate', 'Bad', 'Unknown']],
    ['es', ['Bien', 'Moderado', 'Malo', 'Desconocido']],
    ['pt', ['Bom', 'Moderado', 'Ruim', 'Desconhecido']],
  ])(
    '%s: displays translated labels but counts by the English label',
    (_lng, labels) => {
      const legends = buildCurrentLayerLegends({
        connectivityBenchmark: ConnectivityBenchMarks.global,
        countryActiveLayersDataById: {},
        layerLegendSourceLabelsById: { 53: englishSourceLabels },
        selectedLayerData: {
          id: 53,
          legend_configs: translatedLegends(labels),
        } as never,
        stylePaintData,
      });

      expect(legends.values.map(({ label }) => label)).toEqual(labels);
      expect(countFor(legends)).toEqual({
        good: 173,
        moderate: 4,
        bad: 2,
        unknown: 1,
      });
      expect(legends.reverseMapping).toEqual({
        Good: 'good',
        Moderate: 'moderate',
        Bad: 'bad',
        Unknown: 'unknown',
      });
    },
  );

  test('keeps keys apart when two labels translate to the same text', () => {
    const legends = buildCurrentLayerLegends({
      connectivityBenchmark: ConnectivityBenchMarks.global,
      countryActiveLayersDataById: {},
      layerLegendSourceLabelsById: { 53: englishSourceLabels },
      selectedLayerData: {
        id: 53,
        legend_configs: translatedLegends(['Bien', 'Malo', 'Malo', 'Otro']),
      } as never,
      stylePaintData,
    });

    expect(countFor(legends)).toMatchObject({ moderate: 4, bad: 2 });
    expect(legends.reverseMapping).toMatchObject({
      Moderate: 'moderate',
      Bad: 'bad',
    });
  });

  test('falls back to the shown label when no source label is known', () => {
    const legends = buildCurrentLayerLegends({
      connectivityBenchmark: ConnectivityBenchMarks.global,
      countryActiveLayersDataById: {},
      selectedLayerData: { id: 99, legend_configs: englishLegends } as never,
      stylePaintData,
    });

    expect(countFor(legends)).toEqual({
      good: 173,
      moderate: 4,
      bad: 2,
      unknown: 1,
    });
  });

  test('uses the country source labels for the national benchmark', () => {
    const legends = buildCurrentLayerLegends({
      connectivityBenchmark: ConnectivityBenchMarks.national,
      countryActiveLayersDataById: {
        53: { legend_configs: { good: { labels: 'Cerca (menos de 10 km)' } } },
      },
      countryLegendSourceLabelsById: {
        53: { good: 'Close (less than 10 km)' },
      },
      selectedLayerData: { id: 53, legend_configs: spanishLegends } as never,
      stylePaintData,
    });

    expect(legends.values[0]).toMatchObject({
      label: 'Cerca (menos de 10 km)',
      sourceLabel: 'Close (less than 10 km)',
    });
  });
});

describe('legend source labels', () => {
  test('keep the English labels from the raw API payloads', async () => {
    fetchMock.mockResponse((req: Request) =>
      JSON.stringify(
        req.url.includes('layers/PUBLISHED')
          ? { results: [{ id: 53, legend_configs: englishLegends }] }
          : {
              active_layers_list: [
                {
                  data_layer_id: 53,
                  legend_configs: {
                    good: { labels: 'Close (less than 10 km)' },
                  },
                },
              ],
            },
      ),
    );

    await fetchLayerListFx();
    await fetchCountryFx('gm');

    const legends = buildCurrentLayerLegends({
      connectivityBenchmark: ConnectivityBenchMarks.global,
      countryActiveLayersDataById: {},
      layerLegendSourceLabelsById: $layerLegendSourceLabelsById.getState(),
      selectedLayerData: { id: 53, legend_configs: spanishLegends } as never,
      stylePaintData,
    });
    expect(countFor(legends)).toEqual({
      good: 173,
      moderate: 4,
      bad: 2,
      unknown: 1,
    });
    expect($countryLegendSourceLabelsById.getState()).toEqual({
      53: { good: 'Close (less than 10 km)' },
    });

    changeCountryCode('sn');
    expect($countryLegendSourceLabelsById.getState()).toEqual({});
  });
});
