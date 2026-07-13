import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import WeekSlider from '../week-slider.view';
import { EntityType } from '~/@/entities';

describe('Week slider', () => {
  it('should render component', () => {
    const { asFragment } = render(
      testWrapper(<WeekSlider entityType={EntityType.SCHOOL} />),
    );
    expect(asFragment).toMatchSnapshot();
  });
});
