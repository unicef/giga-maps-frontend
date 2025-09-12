import { createEffect } from 'effector';
import { Marker } from 'mapbox-gl';

import { mapMarkerSource } from '../map.init';
import { setMultipleSchoolPopup, updateSchoolMarker } from '../map.model';
import { createAndSetPopupTemplate, createPopup, getPopupElement } from '../popup/popup.util';


export const addSchoolMarkers = createEffect(({ map, schoolStats, multipleSchoolPopup, schoolMarkers, layerUtils, stylePaintData }: ReturnType<typeof mapMarkerSource.getState>) => {
  if (!map) return;
  let collectMarker = schoolMarkers || [];
  let multipleSchoolPopupList = multipleSchoolPopup || [];
  if (!schoolStats) return;
  let featureList = schoolStats;
  // search new item
  if (collectMarker.length) {
    // remove marker if not found in schoolConnectivity;
    const removeMarkersList = schoolMarkers.filter(marker => !schoolStats?.some((school) => school.id === marker.id))
    removeMarkersList?.forEach((markerItem) => markerItem.marker.remove());
    // and filter colllect marker list;  
    collectMarker = collectMarker.filter(marker => schoolStats?.some((school) => school.id === marker.id));
    multipleSchoolPopupList = multipleSchoolPopupList.filter(item => schoolStats?.some((school) => school.id === item.id));
    // search new item;
    featureList = schoolStats?.filter(school => !collectMarker.some(item => item.id === school.id));
  }
  // Create loader (should be wrapped in a container)
  const markerElement = document.querySelector('.shool-marker-wrapper') as HTMLElement
  // const popupElement = getPopupElement();
  // Add loader
  const isUpdate = !featureList.length;
  if (isUpdate) {
    const isSingle = schoolStats.length === 1;
    schoolStats.forEach((schoolStat) => {
      // const template = createAndSetPopupTemplate({ popupElement, feature: schoolStat, layerUtils, stylePaintData })
      const template = multipleSchoolPopupList.find(item => item.id === schoolStat.id)?.element as HTMLElement;
      const markerInfo = collectMarker.find(item => item.id === schoolStat.id);
      if (markerInfo?.marker) {
        const popup = createPopup(isSingle ? { closeOnClick: false, closeOnMove: false } : {}).setDOMContent(template)
        markerInfo.marker.setPopup(popup);
        if (isSingle && !popup.isOpen()) {
          markerInfo.marker.togglePopup();
        }
      }
    })
  }
  const isSingle = featureList.length === 1;
  for (const feature of featureList) {
    // make a marker for each feature and add it to the map
    const markerIcon = markerElement.cloneNode(true) as HTMLElement;
    // const popupTemplate = createAndSetPopupTemplate({ popupElement, feature, layerUtils, stylePaintData })
    const popupTemplate = document.createElement('div');
    const popup = createPopup(isSingle ? { closeOnClick: false, closeOnMove: false } : {})
    const marker = new Marker(markerIcon)
      .setLngLat(feature.geopoint.coordinates)
      .setPopup(
        popup
          .setDOMContent(popupTemplate)
      )
      .addTo(map);
    collectMarker.push({
      id: feature.id,
      marker
    })
    multipleSchoolPopupList.push({
      id: feature.id,
      element: popupTemplate,
      isClicked: false
    })
    if (isSingle && !popup.isOpen()) {
      marker.togglePopup();
    }
    marker.getElement().addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent event propagation
      marker.togglePopup();
    });
  }

  updateSchoolMarker(collectMarker);
  setMultipleSchoolPopup(multipleSchoolPopupList);
});

