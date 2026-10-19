import '~/@/sidebar/init';

import { changeActiveEntityTypes } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { fetchCountriesFx, fetchLayerListFx } from '~/api/project-connect';
import { mapCountry, mapOverview, router } from '~/core/routes';

import {
  $accordionExpandedEntities,
  onSelectEntityMainLayer,
  toggleAccordionEntity,
} from '../../sidebar.model';
import { type LayerType, LayerTypeChoices } from '../../types';

const LIVE_LAYER_ID = 1;
const STATIC_LAYER_ID = 2;

const layers = [
  {
    id: LIVE_LAYER_ID,
    code: 'DOWNLOAD_SCHOOL',
    type: LayerTypeChoices.LIVE,
    entity_type__code: 'SCHOOL',
    active_countries_list: [{ country: 1, is_default: true }],
  },
  {
    id: STATIC_LAYER_ID,
    code: 'STATIC_SCHOOL',
    type: LayerTypeChoices.STATIC,
    entity_type__code: 'SCHOOL',
    data_source_column: { column: { name: 'some_column' } },
    active_countries_list: [
      { country: 1, is_default: false },
      { country: 2, is_default: true },
    ],
  },
] as unknown as LayerType[];

describe('Country sidecard default state', () => {
  beforeAll(async () => {
    changeActiveEntityTypes([EntityType.HEALTH, EntityType.SCHOOL]);
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { id: 1, code: 'BR', name: 'Brazil' },
        { id: 2, code: 'CO', name: 'Colombia' },
      ]),
    );
    await fetchCountriesFx();
    fetchMock.mockResponseOnce(JSON.stringify({ results: layers }));
    await fetchLayerListFx();
  });

  beforeEach(() => {
    mapOverview.navigate();
  });

  it('expands Schools when the country lands on a live layer', () => {
    mapCountry.navigate({ code: 'br' });
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: true,
    });
  });

  it('keeps Schools collapsed when the country only has static data', () => {
    mapCountry.navigate({ code: 'co' });
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: false,
    });
  });

  it('keeps the user choice inside the country and resets on the next one', () => {
    mapCountry.navigate({ code: 'br' });
    toggleAccordionEntity(EntityType.SCHOOL);
    toggleAccordionEntity(EntityType.HEALTH);

    router.navigate('/map/schools?country=br&school_ids=1');
    mapCountry.navigate({ code: 'br' });
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: false,
      [EntityType.HEALTH]: true,
    });

    mapCountry.navigate({ code: 'co' });
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: false,
    });

    mapOverview.navigate();
    mapCountry.navigate({ code: 'br' });
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: true,
    });
  });

  it('does not re-expand Schools when the user picks a live layer later', () => {
    mapCountry.navigate({ code: 'co' });
    onSelectEntityMainLayer({ [EntityType.SCHOOL]: LIVE_LAYER_ID });
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: false,
    });
  });
});
