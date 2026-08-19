import 'mapbox-gl/dist/mapbox-gl.css';

import { createEvent, guard, sample } from 'effector';

import { $style } from '~/@/map/map.model';

import { initMapFx } from '@/map/effects';
import styled, { css } from 'styled-components';
import { useStore } from 'effector-react';
import { $isMobile } from '~/core/media-query';
import MapSchoolPopupMain from './map-school-popup';

const onMapRef = createEvent<HTMLDivElement | null>();

sample({
  source: $style,
  clock: guard(onMapRef, { filter: Boolean }),
  fn: (style, container) => ({ style, container }),
  target: initMapFx,
});

const MapStyle = styled.div<{ $isMobile: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  ${({ $isMobile }) => $isMobile && css`
    bottom: 5.125rem;
  `}
  .mapboxgl-popup-tip {
    width: 0;
    height: 0;
    z-index: 1;
  }
  .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;
    border-bottom: 16px solid var(--giga-border, #393939);
    border-top: none;
  }
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;
    border-top: 16px solid var(--giga-border, #393939);
    border-bottom: none;
  }
  .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    border-right: 16px solid var(--giga-border, #393939);
    border-left: none;
  }
  .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    border-left: 16px solid var(--giga-border, #393939);
    border-right: none;
  }
  .mapboxgl-popup-content {
    background: transparent !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  
`

const MapComponent = () => {
  const isMobile = useStore($isMobile);

  return (
    <MapStyle $isMobile={isMobile}>
      <div key={isMobile ? 'desktop_view' : 'mobile: view'} id="map" ref={onMapRef} style={{ width: '100%', height: '100%' }} />
      <MapSchoolPopupMain />
    </MapStyle>
  )
}

export default MapComponent;
