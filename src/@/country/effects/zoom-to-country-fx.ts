import { createEffect } from 'effector';
import { LngLatBoundsLike, LngLatLike } from 'mapbox-gl';

import { ZoomToCountryBounds } from '~/@/country/country.types';
import { defaultCenter, defaultZoom } from '~/@/map/map.constant';

import { zoomPaddingDesktop, zoomPaddingMobile } from '../country.constant';

export const zoomToCountryFx = createEffect(
  ({
    map,
    country,
    isMobile,
    levelsCode,
    zoomedCountryCode,
    schoolFocusLatLng
  }: ZoomToCountryBounds): string => {
    if (!map) return '';
    const [countryCode, admin1Code] = levelsCode;
    const adminCode = admin1Code || countryCode;

    // check for school center;
    if (schoolFocusLatLng) {
      map.flyTo({
        center: schoolFocusLatLng as LngLatLike,
        zoom: 10,
      });
      return schoolFocusLatLng.toString();
    }

    // country and admin center;
    if (zoomedCountryCode === adminCode) {
      return zoomedCountryCode;
    }
    if (adminCode) {
      let bounds;
      if (!country || country?.code?.toUpperCase() !== countryCode?.toUpperCase()) {
        return zoomedCountryCode;
      }
      if (admin1Code) {
        bounds = country.admin1_metadata?.find(data => data.giga_id_admin === admin1Code)?.bbox;
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
    map.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
    });

    return 'map';
  }
);
