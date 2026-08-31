import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import LayerRealtimeConnectedSchools from '../layer-realtime-connected-schools.view';
import { EntityType } from '~/@/entities';

describe('Layer realtime connected school', () => {
  it('should render component', () => {
    const isLoading = true;
    const { asFragment } = render(
      testWrapper(
        <LayerRealtimeConnectedSchools
          entityType={EntityType.SCHOOL}
          isLoading={isLoading}
        />,
      ),
    );
    expect(asFragment).toMatchSnapshot();
  });

  it('should render component', () => {
    const isLoading = false;
    const { asFragment } = render(
      testWrapper(
        <LayerRealtimeConnectedSchools
          entityType={EntityType.SCHOOL}
          isLoading={isLoading}
        />,
      ),
    );
    expect(asFragment).toMatchSnapshot();
  });
});
