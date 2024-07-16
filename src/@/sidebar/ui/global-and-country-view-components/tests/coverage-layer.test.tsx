import { render, screen } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import CoverageLayer from '../coverage-layer/coverage-layer';
describe('CoverageLayer', () => {

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<CoverageLayer />));
    expect(asFragment).toMatchSnapshot();
  });

  // it('should render title', () => {
  //   render(testWrapper(<CoverageLayer />));

  //   const text = screen.getAllByText('schools mapped', { trim: true, exact: false });
  //   expect(text[0]).toBeInTheDocument();
  // });

});
