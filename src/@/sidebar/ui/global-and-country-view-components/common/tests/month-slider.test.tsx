import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import { MonthSlider } from '../month-slider';

describe('Month slider', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<MonthSlider />));
    expect(asFragment).toMatchSnapshot();
  });
});

