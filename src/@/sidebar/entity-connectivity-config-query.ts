import { EntityType, getEntityMapValue } from '~/@/entities';
import {
  ENTITY_TYPE_CODE_PARAM,
  getEntityTypeCodeParam,
} from '~/@/entities/utils/entity-query-params';

type EntityConnectivityConfigQuerySource = {
  activeEntityTypes: EntityType[];
  admin1Id: number | null;
  country: { id: number } | null;
  countrySearch: string;
  entityTypesFiltered: EntityType[];
  layersUtils: {
    currentLayerTypeUtilsByEntity: Partial<
      Record<EntityType, { isStatic?: boolean }>
    >;
  };
  mapRoutes: {
    country: boolean;
    entity: boolean;
  };
  schoolParams: {
    entityType?: EntityType | null;
  };
  selectedLayerIdByEntity: Partial<Record<EntityType, number | null>>;
};

export const getCurrentEntityConnectivityConfigQuery = ({
  activeEntityTypes,
  country,
  countrySearch,
  entityTypesFiltered,
  admin1Id,
  layersUtils,
  mapRoutes,
  schoolParams,
  selectedLayerIdByEntity,
}: EntityConnectivityConfigQuerySource) => {
  const params = new URLSearchParams();
  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  const entityTypes =
    mapRoutes.entity && schoolParams.entityType
      ? [schoolParams.entityType]
      : activeEntityTypes.length
        ? activeEntityTypes
        : entityTypesFiltered;
  params.set(
    ENTITY_TYPE_CODE_PARAM,
    getEntityTypeCodeParam(entityTypes, entityTypesFiltered),
  );
  entityTypes.forEach((entityType) => {
    const layerId = getEntityMapValue(
      selectedLayerIdByEntity,
      entityType,
      null,
    );
    const isStaticLayer =
      layersUtils.currentLayerTypeUtilsByEntity[entityType]?.isStatic;
    if (layerId && !isStaticLayer) {
      params.set(`${entityType}_layer_id`, String(layerId));
    }
  });
  if (mapRoutes.country && countrySearch) {
    new URLSearchParams(countrySearch).forEach((value, key) => {
      params.set(key, value);
    });
  }
  const query = params.toString();
  return { query: query ? `?${query}` : '' };
};
