import { describe } from '@jest/globals';
import { createEvent } from 'effector';

import { $isMobile } from '~/core/media-query';

import layers from '~/tests/data/layers-data';
import globalStatusData from '~/tests/data/globalStatus.data';
import { changeCountryCode } from '~/@/country/country.model';
import { testWrapper } from '~/tests/jest-wrapper';
import Sidebar from '../sidebar.view';
import { render } from '@testing-library/react';
import { fetchLayerListFx } from '~/api/project-connect';
import { router } from '~/core/routes';

const setMobileView = createEvent<boolean>()
$isMobile.on(setMobileView, (_, payload) => payload)

describe('Sidebar Init', () => {

  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('api/accounts/layers')) {
        return Promise.resolve(JSON.stringify(layers))
      } else if (req.url.includes('statistics/global-stat/')) {
        return Promise.resolve(JSON.stringify(globalStatusData))
      } else if (req.url.includes('api/locations/countries/br'))
        return Promise.resolve(JSON.stringify({
          id: 1,
          name: 'Brazil',
          code: 'br',
        }))
    });
  })

  test('sample: [countryIdAndSchoolIds, $isCurrentLayerLive]]', async () => {
    changeCountryCode('br')
    await fetchLayerListFx()
    await router.navigate('/map/schools?country=br&school_ids=46313,1212');
    expect(window.location.pathname).toBe('/map/schools');
  })

})