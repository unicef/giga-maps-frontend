import { createEffect } from 'effector';
import { LngLatBoundsLike, LngLatLike, Map, PointLike } from 'mapbox-gl';

import { ZoomToCountryBounds } from '~/@/country/country.types';
import { defaultCenter, defaultZoom } from '~/@/map/map.constant';
import { FLYOUT_DEFAULT_VISIBLE_RATIO } from '~/@/sidebar/sidebar.constant';

import { zoomPaddingDesktop, zoomPaddingMobile } from '../country.constant';

// No popup on mobile: centre the dot between the header and the default flyout.
const getMobileFocusOffset = (map: Map): PointLike => {
  const { height, top } = map.getContainer().getBoundingClientRect();
  const headerBottom =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--flyout-top-offset',
      ),
    ) || 0;
  const flyoutTop = window.innerHeight * (1 - FLYOUT_DEFAULT_VISIBLE_RATIO);

  return [0, (headerBottom + flyoutTop) / 2 - (top + height / 2)];
};

export const zoomToCountryFx = createEffect(
  ({
    map,
    country,
    isMobile,
    levelsCode,
    zoomedCountryCode,
    schoolFocusLatLng,
    keepCurrentView
  }: ZoomToCountryBounds): string => {
    if (!map) return '';
    const [countryCode, admin1Code] = levelsCode;
    const adminCode = admin1Code || countryCode;

    // check for school center;
    if (schoolFocusLatLng) {
      const predefinedSchoolZoom = 10;
      const currentZoom = typeof map.getZoom === 'function' ? map.getZoom() : 0;
      map.flyTo({
        center: schoolFocusLatLng as LngLatLike,
        zoom: Math.max(currentZoom, predefinedSchoolZoom),
        offset: isMobile ? getMobileFocusOffset(map) : [0, -180]
      });
      return schoolFocusLatLng.toString();
    }

    // country and admin center;
    if (zoomedCountryCode?.toUpperCase() === adminCode?.toUpperCase()) {
      return zoomedCountryCode;
    }
    if (adminCode) {
      let bounds;
      if (!country || country?.code?.toUpperCase() !== countryCode?.toUpperCase()) {
        return zoomedCountryCode;
      }
      if (admin1Code) {
        bounds = country.admin1_metadata?.find(data => (data.giga_id_admin === admin1Code || String(data.id) === String(admin1Code)))?.bbox;
      } else if (countryCode) {
        bounds = country.admin_metadata.bbox;
      }
      if (bounds) {
        map.fitBounds(bounds as LngLatBoundsLike, {
          padding: isMobile ? zoomPaddingMobile : zoomPaddingDesktop,
        });
      }
      return adminCode;
    }
    // global view center;
    if (keepCurrentView) return 'map';

    map.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
    });

    return 'map';
  }
);
