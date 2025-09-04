import { createEffect } from "effector";

import { $schoolPopupData } from "../../map.init";
import { $popup } from "../../map.model";
import { $country } from "~/@/country/country.model";
import { LngLatLike } from "mapbox-gl";


export const updateSchoolPopupFx = createEffect(({ country, popup, schoolPopupData }: { country: ReturnType<typeof $country.getState>; popup: ReturnType<typeof $popup.getState>; schoolPopupData: ReturnType<typeof $schoolPopupData.getState> }) => {

  if (!popup || !country) return;
  try {
    popup
      .setLngLat(schoolPopupData.feature?.geopoint.coordinates as LngLatLike)
  } catch (e) {
    console.error(e);
  }
})