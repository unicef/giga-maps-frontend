import { describe, test, } from '@jest/globals';
import { render, } from '@testing-library/react';

import CaseStudyCard from '../common/case-study-card';

describe('CaseStudyCard', () => {
  test('renders CaseStudyCard and take a snapshop', () => {
    const { asFragment } = render(<CaseStudyCard cardPoster={''} title={''} description={''} column={0} />);
    expect(asFragment()).toMatchSnapshot();
  });
})