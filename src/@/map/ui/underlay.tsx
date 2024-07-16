import styled from 'styled-components';

import { Children } from '~/lib/types';

const MapPlaceHolder = styled.div`

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #808080;

  .mapboxgl-ctrl.mapboxgl-ctrl-attrib .mapboxgl-ctrl-attrib-inner {
    margin-bottom: 5.5rem;
  }
  
  .mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact {
    margin-bottom: 6rem;
    display: none;
  }
  
  .mapboxgl-ctrl .mapboxgl-ctrl-logo {
    margin-bottom: 1.5rem;
    display: none;
  }
  
  .mapboxgl-canvas {
    outline: none;
  }

  .mapboxgl-ctrl.mapboxgl-ctrl-attrib {
    height: 1.3rem !important;
  }

  .mapboxgl-popup-content{
    padding: 0;
  }

`

const Underlay = ({ children }: Children) => (
  <MapPlaceHolder>{children}</MapPlaceHolder>
);

export default Underlay;
