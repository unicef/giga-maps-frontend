import { useStore } from 'effector-react';
import styled from 'styled-components';

import { $zoomLevel } from '~/@/map/map.model';

const ZoomLevelContainer = styled.div`
  position: fixed;
  bottom: 1.3rem;
  right: 0.5rem;
  z-index: 2;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.45);
  padding: 1px 5px;
  border-radius: 3px;
  font-family: monospace;
  letter-spacing: 0.5px;
  pointer-events: none;
  user-select: none;
`;

const ZoomLevelDisplay = () => {
  const zoomLevel = useStore($zoomLevel);

  return <ZoomLevelContainer>Z: {zoomLevel}</ZoomLevelContainer>;
};

export default ZoomLevelDisplay;
