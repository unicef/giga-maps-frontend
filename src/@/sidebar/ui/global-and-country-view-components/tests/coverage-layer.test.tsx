import { render } from '@testing-library/react';
import { EntityType } from '~/@/entities';
import { testWrapper } from '~/tests/test-wrapper';
import CoverageLayer from '../coverage-layer/coverage-layer';
describe('CoverageLayer', () => {

  it('should render component', () => {
    const { asFragment } = render(
      testWrapper(<CoverageLayer entityType={EntityType.SCHOOL} />),
    );
    expect(asFragment).toMatchSnapshot();
  });

  // it('should render title', () => {
  //   render(testWrapper(<CoverageLayer />));

  //   const text = screen.getAllByText('schools mapped', { trim: true, exact: false });
  //   expect(text[0]).toBeInTheDocument();
  // });

});

