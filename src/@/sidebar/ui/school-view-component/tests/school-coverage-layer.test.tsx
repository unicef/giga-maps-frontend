import { render } from '@testing-library/react';
import SchoolCoverageLayer from '../school-coverage-layer/school-coverage-layer';
import { router } from '~/core/routes';
import { testWrapper } from '~/tests/jest-wrapper';


describe('SchoolCoverageLayer', () => {

  test('renders correctly', () => {
    const { asFragment } = render(<SchoolCoverageLayer />);

    expect(asFragment).toMatchSnapshot();
  });


  test('check SchoolCoverageLayer with multiple school ids', () => {
    router.navigate(`/map/schools?country=AI&school_ids=12,13`);
    const { getByText } = render(testWrapper(<SchoolCoverageLayer />));
    expect(getByText('Data layer selection', { exact: false })).toBeInTheDocument();
  });
});
