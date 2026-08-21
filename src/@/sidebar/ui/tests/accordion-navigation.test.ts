import {
  $accordionExpandedEntities,
  $accordionScope,
  toggleAccordionEntity,
} from '../../sidebar.model';
import { changeActiveEntityTypes } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { mapCountry, mapOverview } from '~/core/routes';

/**
 * Drives the real router instead of forking, so the scope switching is
 * exercised the same way the app does it. Runs as one sequence because the
 * ticket is about state surviving navigation.
 */
describe('Sidecard expansion across real navigation', () => {
  it('walks the full ticket scenario', () => {
    changeActiveEntityTypes([EntityType.HEALTH, EntityType.SCHOOL]);

    mapOverview.navigate();
    expect($accordionScope.getState()).toBe('global');
    expect($accordionExpandedEntities.getState()).toEqual({});

    toggleAccordionEntity(EntityType.SCHOOL);
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: true,
    });

    // Country view starts collapsed: the global state does not leak in.
    mapCountry.navigate({ code: 'br' });
    expect($accordionScope.getState()).toBe('country');
    expect($accordionExpandedEntities.getState()).toEqual({});

    toggleAccordionEntity(EntityType.HEALTH);
    mapCountry.navigate({ code: 'ke' });
    expect($accordionScope.getState()).toBe('country');
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.HEALTH]: true,
    });

    // Back to global view: its own state is untouched by the country one.
    mapOverview.navigate();
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: true,
    });

    // A single entity type expands by default...
    changeActiveEntityTypes([EntityType.HEALTH]);
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.HEALTH]: true,
    });

    // ...and collapsing it there does not reach the multi-entity state.
    toggleAccordionEntity(EntityType.HEALTH);
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.HEALTH]: false,
    });

    changeActiveEntityTypes([EntityType.HEALTH, EntityType.SCHOOL]);
    expect($accordionExpandedEntities.getState()).toEqual({
      [EntityType.SCHOOL]: true,
    });
  });
});
