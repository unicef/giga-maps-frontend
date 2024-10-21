import { describe, expect, test, } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import FilterRangeFields from '../filter-range-fields';
import FilterCommonFields from '../filter-common-fields';

describe('FilterRangeFields', () => {
  test('renders FilterRangeFields and take a snapshop', () => {
    const { asFragment } = render(<FilterRangeFields />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders FilterCommonFields and take a snapshop', () => {
    const { asFragment } = render(<FilterCommonFields isEditMode={false} />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('renders FilterCommonFields and take a snapshop', () => {
    const { asFragment } = render(<FilterCommonFields isEditMode={true} />)
    expect(asFragment()).toMatchSnapshot();
  })
})