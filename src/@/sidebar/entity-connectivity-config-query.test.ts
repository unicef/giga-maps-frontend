import { EntityType } from '~/@/entities';

import { getCurrentEntityConnectivityConfigQuery } from './entity-connectivity-config-query';

const createSource = () => ({
  activeEntityTypes: [EntityType.SCHOOL],
  admin1Id: null,
  country: { id: 7 },
  countrySearch: 'school__environment__iexact=urban',
  entityTypesFiltered: [EntityType.SCHOOL, EntityType.HEALTH],
  layersUtils: {
    currentLayerTypeUtilsByEntity: {
      [EntityType.SCHOOL]: { isStatic: false },
    },
  },
  mapRoutes: {
    country: true,
    entity: false,
  },
  schoolParams: {
    entityType: null as EntityType | null,
    schoolIds: undefined as number[] | undefined,
  },
  selectedLayerIdByEntity: {
    [EntityType.SCHOOL]: 10,
  },
});

describe('getCurrentEntityConnectivityConfigQuery', () => {
  it('includes active country filters in connectivity-config requests', () => {
    const { query } = getCurrentEntityConnectivityConfigQuery(createSource());
    const params = new URLSearchParams(query);

    expect(params.get('country_id')).toBe('7');
    expect(params.get('entity_type__code')).toBe(EntityType.SCHOOL);
    expect(params.get('school_layer_id')).toBe('10');
    expect(params.get('school__environment__iexact')).toBe('urban');
  });

  it.each([EntityType.SCHOOL, EntityType.HEALTH])(
    'scopes an %s detail request to the selected entities',
    (entityType) => {
      const source = createSource();
      source.mapRoutes = { country: false, entity: true };
      source.schoolParams = { entityType, schoolIds: [101, 202] };

      const { query } = getCurrentEntityConnectivityConfigQuery(source);
      const params = new URLSearchParams(query);

      expect(params.get('entity_type__code')).toBe(entityType);
      expect(params.get(`${entityType}_ids`)).toBe('101,202');
      expect(params.has('school__environment__iexact')).toBe(false);
    },
  );

  it('does not add entity IDs outside an entity-detail request', () => {
    const source = createSource();
    source.schoolParams = {
      entityType: EntityType.SCHOOL,
      schoolIds: [101, 202],
    };

    const { query } = getCurrentEntityConnectivityConfigQuery(source);

    expect(new URLSearchParams(query).has('school_ids')).toBe(false);
  });
});
