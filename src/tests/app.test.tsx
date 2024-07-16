import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';

import App from '../app';

describe('App', () => {
  test('App snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
})
