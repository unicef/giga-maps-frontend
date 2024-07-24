import { render, renderHook } from '@testing-library/react';
import ClickAnywhere from '../click-anywhere';
import { testWrapper } from '~/tests/jest-wrapper';

describe('Click anywhere', () => {
  it('should not call insideClick when clicking on an element without the specified class', () => {
    const { asFragment } = render(testWrapper(<ClickAnywhere classList={['sidebar-searchbox']} trigger={true} />));
    expect(asFragment).toMatchSnapshot();
  });
});
