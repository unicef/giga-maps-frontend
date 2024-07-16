

import 'mapbox-gl/dist/mapbox-gl.css';

import { CSSProperties } from 'react';
import { onAdminMapRef } from './admin-map.model';

const mapStyles: CSSProperties = {
  position: 'relative', inset: 'inherit', width: '100%', height: '100%'
};

const AdminMap = ({ style }: { style?: CSSProperties }) => <>
  <div id="map" ref={onAdminMapRef} style={{ ...mapStyles, ...style }} />
</>;

export default AdminMap;
