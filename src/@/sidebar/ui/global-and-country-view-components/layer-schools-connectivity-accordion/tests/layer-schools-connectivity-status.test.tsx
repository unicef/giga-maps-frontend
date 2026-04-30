import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import LayerSchoolsConnectivityStatus from '../layer-schools-connectivity-status.view';

describe('Layer schools connectivity status', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<LayerSchoolsConnectivityStatus />));
    expect(asFragment).toMatchSnapshot();
  });
});

