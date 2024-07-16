import { createEffect } from 'effector';

import { AddCountries } from '~/@/country/country.types';

import { CountryAdminLevel } from '../country.constant';
import { createSourceForAdminCountry } from '../country.utils';

export const addCountriesFx = createEffect(
  async ({ map }: AddCountries) => {
    if (!map) return;

    // source for country level 0
    createSourceForAdminCountry({ map, level: CountryAdminLevel.level0 });

    // source for country level 1
    createSourceForAdminCountry({ map, level: CountryAdminLevel.level1 });
  }
);
