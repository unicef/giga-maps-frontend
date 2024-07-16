import { createEffect } from "effector";

import { $schoolPopupData } from "../../map.init";
import { $popup } from "../../map.model";
import { createAndSetPopupTemplate, getPopupElement } from "../popup.util";
import { $country } from "~/@/country/country.model";


export const updateSchoolPopupFx = createEffect(({ country, popup, schoolPopupData }: { country: ReturnType<typeof $country.getState>; popup: ReturnType<typeof $popup.getState>; schoolPopupData: ReturnType<typeof $schoolPopupData.getState> }) => {

  if (!popup || !country) return;
  try {
    const popupElement = getPopupElement();
    const popupTemplate = createAndSetPopupTemplate({ popupElement, isGotoSchool: true, countryCode: country.code, ...schoolPopupData })
    popup
      .setDOMContent(popupTemplate)
  } catch (e) {
    console.error(e);
  }
})