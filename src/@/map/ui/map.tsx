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
  .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    border-right-color: ${props => props.theme.main}
  }
  .mapboxgl-popup-content {
    .main-popup-container {
      background: ${props => props.theme.main};
      box-shadow: 0px 2px 3px 0px ${props => props.theme.main};
    } 
    .map-school-name {
      color: ${props => props.theme.text};
    }
    svg {
      fill: ${props => props.theme.text};
    }
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
