import '~/core/i18n/instance';

import { render, screen } from '@testing-library/react';
import { fork } from 'effector';
import { Provider } from 'effector-react/scope';

import { EntityType } from '~/@/entities/types/base-entity.type';
import { $coverageStatsByEntity } from '~/@/sidebar/sidebar.model';

import StaticLayerLegend from '../ui/legend-info/common/static-layer-legend';

vi.mock('~/@/entities/ui/entity-legend-indicator', () => ({
  default: () => <span />,
}));

vi.mock('../ui/legend-info/common/legend-benchmark-dropdown', () => ({
  default: () => null,
}));

describe('StaticLayerLegend', () => {
  it('shows configured entries without aggregate coverage counts', () => {
    const scope = fork({
      values: new Map().set($coverageStatsByEntity, {}),
    });

    render(
      <Provider value={scope}>
        <StaticLayerLegend
          entityType={EntityType.HEALTH}
          metricSubtitle="Coverage"
          shouldShowControls={false}
        />
      </Provider>,
    );

    expect(screen.getByText('Good')).toBeInTheDocument();
  });
});
