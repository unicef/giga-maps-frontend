import { allSettled, fork } from 'effector';

import { EntityType } from '../types/base-entity.type';
import { $activeEntityTypes, changeActiveEntityTypes } from './entity.model';

describe('active entity types', () => {
  it('keeps every explicitly active entity', async () => {
    const scope = fork();

    await allSettled(changeActiveEntityTypes, {
      scope,
      params: [EntityType.SCHOOL, EntityType.HEALTH],
    });

    expect(scope.getState($activeEntityTypes)).toEqual([
      EntityType.SCHOOL,
      EntityType.HEALTH,
    ]);
  });

  it('does not replace the active set with an empty implicit fallback', async () => {
    const scope = fork({
      values: new Map().set($activeEntityTypes, [EntityType.HEALTH]),
    });

    await allSettled(changeActiveEntityTypes, { scope, params: [] });

    expect(scope.getState($activeEntityTypes)).toEqual([EntityType.HEALTH]);
  });
});
