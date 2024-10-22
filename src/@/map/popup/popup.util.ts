import { Popup, PopupOptions } from "mapbox-gl"

import { setSchoolFocusLatLng } from "~/@/country/country.model";
import { router } from "~/core/routes";

import { $schoolPopupData } from "../map.init";
import { UNKNOWN } from '../map.types';
import { PointCoordinates } from "~/core/global-types";

type SchoolPopupDataType = ReturnType<typeof $schoolPopupData.getState>

export const createPopup = (options?: PopupOptions) => {
  return new Popup({ offset: 25, anchor: 'left', closeButton: false, focusAfterOpen: true, closeOnMove: true, ...options })
}

export const getPopupElement = () => {
  return document.querySelector('.map-popup-template') as HTMLElement;
}

export const getLoadingPopupElm = () => {
  return document.querySelector('.popup-template-loading') as HTMLElement;
}

const findElement = (el: HTMLElement, className = '') => {
  const element = el.querySelector(className)
  return element as HTMLElement;
}
const showElement = (el: HTMLElement, className = '') => {
  const element = el.querySelector(className)
  if (element) {
    element.classList.remove('hide');
  }
}

const setContentHTML = (el: HTMLElement, className = '', content = '') => {
  const element = el.querySelector(className)
  if (element) {
    element.textContent = content;
  }
  return element as HTMLElement;
}

export const createAndSetPopupTemplate = ({ popupElement, feature, stylePaintData, layerUtils, isGotoSchool, countryCode }: { popupElement: HTMLElement, isGotoSchool?: boolean; countryCode?: string; unit?: string; } & SchoolPopupDataType) => {
  const { selectedLayerData, currentLayerTypeUtils } = layerUtils;
  const { isLive, isStatic } = currentLayerTypeUtils
  const { global_benchmark } = selectedLayerData ?? {};
  const unit = global_benchmark?.convert_unit;
  const connecitivityStatusColor = stylePaintData[feature?.connectivityStatus ?? UNKNOWN]
  const popupTemplate = popupElement.cloneNode(true) as HTMLElement;
  const outerCircle = findElement(popupTemplate, '.outer-circle');
  const innerCircle = findElement(popupTemplate, '.inner-circle');
  innerCircle.style.backgroundColor = connecitivityStatusColor;
  if (isGotoSchool && countryCode) {
    const gotoSchoolBtn = popupTemplate.querySelector('.go-to-school')
    gotoSchoolBtn?.classList.remove('hide');
    gotoSchoolBtn?.addEventListener('click', () => {
      router.navigate(`/map/schools?country=${countryCode.toLowerCase()}&school_ids=${feature?.id}`);
      setSchoolFocusLatLng(feature?.geopoint.coordinates as PointCoordinates);
    })
  }

  const schoolCoords = JSON.parse(JSON.stringify((feature?.geopoint?.coordinates ?? [])));
  const isLiveNotUnknown = isLive && feature?.connectivityType !== UNKNOWN;
  const connectivityValue = isLiveNotUnknown ? `${feature?.liveAvg ?? 0} ${unit}` : UNKNOWN;

  setContentHTML(popupTemplate, '.map-school-name', feature?.name);
  setContentHTML(popupTemplate, '.map-school-id', `${feature?.externalId}`);
  setContentHTML(popupTemplate, '.map-school-geo', schoolCoords.reverse().join(', '));
  if (isLive) {
    showElement(popupTemplate, '.live-container');
    const connectivityElm = setContentHTML(popupTemplate, '.map-school-connectivity-speed', connectivityValue);
    if (connectivityElm) {
      connectivityElm.style.color = stylePaintData[feature?.connectivityType ?? UNKNOWN];
    }
    if (outerCircle && feature?.isRealTime) {
      outerCircle.style.backgroundColor = stylePaintData[feature?.connectivityType ?? UNKNOWN];
    }
  } else if (isStatic) {
    showElement(popupTemplate, '.static-container');

    const staticValue = feature?.staticValue as boolean | undefined;
    const displayValue = staticValue === true ? 'yes' : staticValue === false ? 'no' : staticValue ?? UNKNOWN;
    const staticElm = setContentHTML(popupTemplate, '.map-school-school-coverage', displayValue);

    staticElm.style.color = stylePaintData[feature?.staticType ?? UNKNOWN];
    outerCircle.style.display = 'none';
    innerCircle.style.backgroundColor = stylePaintData[feature?.staticType ?? UNKNOWN];
  }
  return popupTemplate;
}