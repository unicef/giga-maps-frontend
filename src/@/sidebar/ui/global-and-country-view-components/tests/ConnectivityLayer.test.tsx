import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import ConnectivityLayer from '../connectivity-layer/connectivity-layer.view';
jest.mock('@carbon/charts-react', () => ({
  SimpleBarChart: jest.fn().mockReturnValue(null),
}))


describe('ConnectivityLayer', () => {

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<ConnectivityLayer />));
    expect(asFragment).toMatchSnapshot();
  });

});
