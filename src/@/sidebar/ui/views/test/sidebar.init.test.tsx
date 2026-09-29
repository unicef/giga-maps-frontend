import '~/@/sidebar/init';

import { createEvent } from 'effector';

import { changeCountryCode } from '~/@/country/country.model';
import { onLoadPage } from '~/@/map/map.model';
import {
  $isFlyoutSettling,
  $showAccessibility,
  $showLegend,
  $showThemeLayer,
  $sidebarFlyoutState,
  flyoutSettled,
  onShowAccessibility,
  onShowLegend,
  onShowThemeLayer,
  setSidebarFlyoutState,
} from '~/@/sidebar/sidebar.model';
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

const closePanels = () => {
  onShowLegend(false);
  onShowThemeLayer(false);
  onShowAccessibility(false);
};

describe('Mobile flyout and map control panels', () => {
  beforeEach(() => {
    setMobileView(true);
    closePanels();
    setSidebarFlyoutState('default');
  });

  afterEach(() => {
    closePanels();
    setSidebarFlyoutState('default');
    setMobileView(false);
  });

  test.each(['default', 'expanded'] as const)(
    'closes the open panel when the flyout grows to %s',
    (flyoutState) => {
      setSidebarFlyoutState('collapsed');
      onShowThemeLayer(true);

      setSidebarFlyoutState(flyoutState);

      expect($showThemeLayer.getState()).toBe(false);
      expect($sidebarFlyoutState.getState()).toBe(flyoutState);
    },
  );

  test.each([
    ['legend', onShowLegend, $showLegend],
    ['theme', onShowThemeLayer, $showThemeLayer],
    ['accessibility', onShowAccessibility, $showAccessibility],
  ] as const)(
    'collapses the flyout when the %s panel opens',
    (_, open, $isOpen) => {
      open(true);

      expect($sidebarFlyoutState.getState()).toBe('collapsed');
      expect($isOpen.getState()).toBe(true);
    },
  );

  test('collapses the flyout even when another panel closes in the same tick', () => {
    // Legend open over the default flyout, as the desktop default leaves it.
    setMobileView(false);
    onShowLegend(true);
    setMobileView(true);

    onShowAccessibility(true);

    expect($showLegend.getState()).toBe(false);
    expect($sidebarFlyoutState.getState()).toBe('collapsed');
  });

  test('keeps the flyout settling until its move ends', () => {
    flyoutSettled();

    onShowThemeLayer(true);
    expect($isFlyoutSettling.getState()).toBe(true);

    flyoutSettled();
    expect($isFlyoutSettling.getState()).toBe(false);
    expect($showThemeLayer.getState()).toBe(true);
  });

  test('leaves the flyout and panels alone on desktop', () => {
    setMobileView(false);

    onShowThemeLayer(true);
    expect($sidebarFlyoutState.getState()).toBe('default');

    setSidebarFlyoutState('expanded');
    expect($showThemeLayer.getState()).toBe(true);
  });
});
