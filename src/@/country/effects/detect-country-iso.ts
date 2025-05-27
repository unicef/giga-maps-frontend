import { createEffect } from "effector";
import { mapboxWorldviewsBoundaries } from "../country.constant";
import { defaultWorldView } from "~/@/map/map.constant";
import { getLocalStorage, setLocalStorage } from "~/lib/utils";

const cachedCountryISO = getLocalStorage('countryISO') as string;
const cacheDate = getLocalStorage("countryISO_date") as string;
// Validate cache date format 
let isCacheExpire = true;
if (cachedCountryISO) {
  const cachedDate = Date.parse(cacheDate);
  if (!isNaN(cachedDate)) {
    isCacheExpire = cachedDate < Date.now() - 48 * 60 * 60 * 1000;
  }
}
export const getUserCurrentCountryISOFx = createEffect(async () => {
  let selectedWorldview = defaultWorldView;
  try {
    let countryISO = cachedCountryISO;
    if (isCacheExpire) {
      const response = await fetch('https://ipapi.co/country_code/')
      countryISO = await response.text();
    }
    // Check if selected worldview is in the list of worldviews
    if (mapboxWorldviewsBoundaries.indexOf(countryISO) > -1) {
      selectedWorldview = countryISO;
    } else if (["HK", "MO"].indexOf(countryISO) > -1) {
      selectedWorldview = "CN";
    }
    setLocalStorage("countryISO", selectedWorldview);
    setLocalStorage('countryISO_date', new Date().toISOString());
    return selectedWorldview;
  } catch (e) {
    console.error(e);
    return selectedWorldview;
  }

});