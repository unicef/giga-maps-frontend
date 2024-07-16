import { LayerDataProps } from '~/@/map/map.constant';
import { ChangeLayerOptions } from '~/@/map/map.types';

export const getSchoolsGeoJson = (data: ChangeLayerOptions["schoolStats"]) => {
  return {
    type: 'FeatureCollection',
    features: data?.map((item: ChangeLayerOptions["schoolStats"][0]) => ({
      type: 'Feature',
      properties: {
        name: item.name,
        [LayerDataProps.connectivityStatus.key]: item?.connectivityStatus,
        [LayerDataProps.connectivity.key]: item?.connectivityType,
        [LayerDataProps.coverage.key]: item?.staticType,
        [LayerDataProps.fieldStatus.key]: item?.connectivityType || item?.staticType,
        is_rt_connected: item?.isRealTime
      },
      geometry: item.geopoint,
      id: item.id,
    })),
  };
};
