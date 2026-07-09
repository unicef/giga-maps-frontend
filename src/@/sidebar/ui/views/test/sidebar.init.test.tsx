import { createEvent } from 'effector';

import { changeCountryCode } from '~/@/country/country.model';
import { onLoadPage } from '~/@/map/map.model';
import { fetchEntityGlobalStatsFx, fetchLayerListFx } from '~/api/project-connect';
import { $isMobile } from '~/core/media-query';
import { router } from '~/core/routes';
import globalStatusData from '~/tests/data/globalStatus.data';
import layers from '~/tests/data/layers-data';

const setMobileView = createEvent<boolean>()
$isMobile.on(setMobileView, (_, payload) => payload)

describe('Sidebar Init', () => {

  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('api/accounts/layers')) {
        return Promise.resolve(JSON.stringify(layers))
      } else if (req.url.includes('api/v2/entities/global-stat/')) {
        return Promise.resolve(JSON.stringify({
          school: globalStatusData,
          health: {
            no_of_countries: 0,
            countries_with_connectivity_status_mapped: 0,
            entities_total: 0,
            entities_with_connectivity_status_mapped: 0,
            connectivity_global_benchmark: {
              value: 20000000,
              unit: 'bps',
            },
            connected_entities: {
              connected: 0,
              not_connected: 0,
              unknown: 0,
            },
          },
        }))
      } else if (req.url.includes('api/locations/countries/br'))
        return Promise.resolve(JSON.stringify({
          id: 1,
          name: 'Brazil',
          code: 'br',
        }))
    });
  })

  test('sample: [countryIdAndSchoolIds, $isCurrentLayerLive]]', () => {
    changeCountryCode('br')
    void fetchLayerListFx()
    router.navigate('/map/schools?country=br&school_ids=46313,1212');
    expect(window.location.pathname).toBe('/map/schools');
  })

  test('calls entity global stats on initial global map load', async () => {
    router.navigate('/map');
    await import('~/@/map/map.init');

    const calls: Array<{ query?: string }> = [];
    const unwatch = fetchEntityGlobalStatsFx.watch((payload) => {
      calls.push(payload);
    });

    try {
      onLoadPage();
      expect(calls).toEqual(expect.arrayContaining([{ query: '?entity_type__code=all' }]));
    } finally {
      unwatch();
    }
  })

})

