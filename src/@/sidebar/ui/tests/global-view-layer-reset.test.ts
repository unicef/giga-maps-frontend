import { allSettled, fork } from 'effector';

import { EntityType } from '~/@/entities';
import { mapOverview } from '~/core/routes';

import {
  $currentLayerTypeUtilsByEntity,
  $layersList,
  $selectedLayerIdByEntity,
} from '../../sidebar.model';
import { LayerType, LayerTypeChoices } from '../../types';

const staticLayer = {
  id: 2,
  name: 'Coverage data',
  type: LayerTypeChoices.STATIC,
  created_by: 'user1',
  description: 'Static coverage layer',
} as unknown as LayerType;

describe('global view layer reset', () => {
  it('drops the country layer selection when the map overview becomes visible', async () => {
    const scope = fork({
      values: new Map()
        .set($layersList, [staticLayer])
        .set($selectedLayerIdByEntity, { [EntityType.SCHOOL]: staticLayer.id }),
    });

    expect(
      scope.getState($currentLayerTypeUtilsByEntity)[EntityType.SCHOOL]
        ?.isStatic,
    ).toBe(true);

    await allSettled(mapOverview.visible, { scope, params: true });

    expect(scope.getState($selectedLayerIdByEntity)).toEqual({});
    expect(
      scope.getState($currentLayerTypeUtilsByEntity)[EntityType.SCHOOL]
        ?.isStatic,
    ).toBe(false);
  });
});
