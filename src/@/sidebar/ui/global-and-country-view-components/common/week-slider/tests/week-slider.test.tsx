import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import WeekSlider from '../week-slider.view';

describe('Week slider', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<WeekSlider />));
    expect(asFragment).toMatchSnapshot();
  });
});
