import { createEffect } from 'effector';

import { $activeSchoolPopup, $map, onCreateSchoolPopup } from '../../map.model';
import { createPopup, getLoadingPopupElm } from '../popup.util';

export const createLoadingPopupFx = createEffect(({ map, schoolPopupInfo }: { map: ReturnType<typeof $map.getState>; schoolPopupInfo: ReturnType<typeof $activeSchoolPopup.getState> }) => {
  if (!schoolPopupInfo || !map) {
    return;
  }
  const { geopoint } = schoolPopupInfo;
  const popup = createPopup({ closeOnMove: false, closeOnClick: true });
  onCreateSchoolPopup(popup);
  const popupTemplate = getLoadingPopupElm().cloneNode(true) as HTMLElement;
  popup
    .setLngLat(geopoint.coordinates)
    .setHTML(popupTemplate.innerHTML)
    .addTo(map)
})