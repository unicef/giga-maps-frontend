import { createEffect } from 'effector';

import { $activeSchoolPopup, $map, onCreateSchoolPopup, setSchoolCLickupPopupDiv } from '../../map.model';
import { createPopup, getLoadingPopupElm } from '../popup.util';

export const createLoadingPopupFx = createEffect(({ map, schoolPopupInfo }: { map: ReturnType<typeof $map.getState>; schoolPopupInfo: ReturnType<typeof $activeSchoolPopup.getState> }) => {
  if (!schoolPopupInfo || !map) {
    return;
  }
  const { geopoint, id } = schoolPopupInfo;
  const popup = createPopup({ closeOnMove: false, closeOnClick: true });
  onCreateSchoolPopup(popup);
  // const popupTemplate = getLoadingPopupElm().cloneNode(true) as HTMLElement;
  const popupDiv = document.createElement('div');
  setSchoolCLickupPopupDiv([
    {
      id,
      element: popupDiv,
      isClicked: true
    }
  ]);
  popup
    .setLngLat(geopoint.coordinates)
    .setDOMContent(popupDiv)
    .addTo(map)
})