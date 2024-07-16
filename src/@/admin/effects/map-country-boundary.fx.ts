import { createFillLayerForCountry, createSourceForAdminCountry } from "~/@/country/country.utils";
import { stylePaintData } from "~/@/map/map.constant";
import { Map } from "~/@/map/map.types";


export const addCountryBoundries = (map: Map) => {
  if (!map) return;
  createSourceForAdminCountry({ map, level: 0 })
  createSourceForAdminCountry({ map, level: 1 })
  createFillLayerForCountry({ map, level: 0, levelsCode: [], selectedLevel: 0, paintData: stylePaintData.dark, worldView: "US" })
  createFillLayerForCountry({ map, level: 1, levelsCode: [], selectedLevel: 0, paintData: stylePaintData.dark, worldView: "US" })
}