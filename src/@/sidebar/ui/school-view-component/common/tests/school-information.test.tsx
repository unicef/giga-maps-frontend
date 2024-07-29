import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import { SchoolInformation } from '../school-information.view';
import { SchoolDetailItem, SchoolDetailTitle } from '../../styles/school-view-style';

describe('School information', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<SchoolInformation />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<SchoolDetailTitle />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<SchoolDetailItem />));
    expect(asFragment).toMatchSnapshot();
  });
});
