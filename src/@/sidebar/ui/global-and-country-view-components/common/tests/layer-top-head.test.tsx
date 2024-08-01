import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import LayerTopHead from '../layer-top-head.view';

describe('Layer schools connectivity status', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<LayerTopHead label="Data layer selection" />));
    expect(asFragment).toMatchSnapshot();
  });
});
