import { createEffect } from "effector";
import { Map } from "mapbox-gl";

import { Country, CountryBasic } from "~/api/types";

import { CountryAdminLevel } from "../country.constant";
import { getAdminCountrySource } from "../country.utils";

export const updateLookupSourceForAdmin0 = createEffect(({ map, countries }: { map: Map | null, countries: CountryBasic[] | null }) => {
  if (!map || !countries) return null;
  const source = getAdminCountrySource(CountryAdminLevel.level0)
  try {
    countries.forEach((country: CountryBasic) => {
      map.setFeatureState(
        {
          source,
          sourceLayer: `boundaries_admin_${CountryAdminLevel.level0}`,
          id: country.admin_metadata.mapbox_id,
        },
        {
          ...country.admin_metadata
        }
      );
    })
  } catch (e) {
    console.log('error...', e);
  }
})

export const updateLookupSourceForAdmin1 = createEffect(({ map, admin1List }: { map: Map | null, admin1List?: Country['admin1_metadata'] }) => {
  if (!map || !admin1List) return;
  const source = getAdminCountrySource(CountryAdminLevel.level1)
  try {
    admin1List.forEach((admin1) => {
      map.setFeatureState(
        {
          source,
          sourceLayer: `boundaries_admin_${CountryAdminLevel.level1}`,
          id: admin1.mapbox_id,
        },
        {
          ...admin1
        }
      );
    })
  } catch (e) {
    console.log('error...', e);
  }
})