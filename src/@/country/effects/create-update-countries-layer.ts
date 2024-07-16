import { createEffect } from 'effector';

import { AddCountries } from '~/@/country/country.types';

import { CountryAdminLevel } from '../country.constant';
import { addAdminCountryLayerEvents, createFillLayerForCountry, createLineLayerForCountry, onChangeAdminBoundariesLayer, onChangeLabelLayer } from '../country.utils';

const createOrUpdateLayerForAdmin = (props: AddCountries & { level: CountryAdminLevel }) => {
  const { map, isTilesAndLables, isAdminBoundaries } = props;
  if (!map) return;
  const { isLayerCreated } = createFillLayerForCountry(props);
  createLineLayerForCountry(props);
  if (isLayerCreated) {
    addAdminCountryLayerEvents(props);
  }
  onChangeLabelLayer(map, isTilesAndLables);
  onChangeAdminBoundariesLayer(map, isAdminBoundaries);
}

export const createUpdateCountriesLayer = createEffect(
  (props: AddCountries) => {
    if (!props.map) return;
    // layer for country level 0
    createOrUpdateLayerForAdmin({ ...props, level: CountryAdminLevel.level0 });

    // layer for country level 1
    createOrUpdateLayerForAdmin({ ...props, level: CountryAdminLevel.level1 });
  }
);
