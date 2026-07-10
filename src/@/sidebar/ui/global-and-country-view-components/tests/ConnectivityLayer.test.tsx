import { render } from '@testing-library/react';
import { EntityType } from '~/@/entities';
import { testWrapper } from '~/tests/test-wrapper';
import ConnectivityLayer from '../connectivity-layer/connectivity-layer.view';
vi.mock('@carbon/charts-react', () => ({
  SimpleBarChart: vi.fn().mockReturnValue(null),
}))


describe('ConnectivityLayer', () => {

  it('should render component', () => {
    const { asFragment } = render(
      testWrapper(<ConnectivityLayer entityType={EntityType.SCHOOL} />),
    );
    expect(asFragment).toMatchSnapshot();
  });

});


