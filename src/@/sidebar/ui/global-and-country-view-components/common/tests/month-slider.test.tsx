import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import { MonthSlider } from '../month-slider';
import { EntityType } from '~/@/entities';

describe('Month slider', () => {
  it('should render component', () => {
    const { asFragment } = render(
      testWrapper(<MonthSlider entityType={EntityType.SCHOOL} />),
    );
    expect(asFragment).toMatchSnapshot();
  });
});
