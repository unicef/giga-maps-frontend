import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import SingleSchoolStatus from '../single-school-status-view';

describe('Single school status', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<SingleSchoolStatus />));
    expect(asFragment).toMatchSnapshot();
  });
});
