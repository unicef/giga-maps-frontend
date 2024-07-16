import { describe, test, } from '@jest/globals';
import { render, } from '@testing-library/react';

import FeatureCard from '../common/feature-card';

describe('FeatureCardWrapper', () => {
  test('renders FeatureCardWrapper and take a snapshop', () => {
    const { asFragment } = render(<FeatureCard Icon={''} title={''} description={''} />);
    expect(asFragment()).toMatchSnapshot();
  });
})