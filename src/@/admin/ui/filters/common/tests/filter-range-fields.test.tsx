import { describe, expect, test, } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import FilterRangeFields from '../filter-range-fields';
import FilterCommonFields from '../filter-common-fields';
import { useStore } from 'effector-react';
import { $filterColumnList, $filterTypeChoices, $filterQueryParamsChoices, $formFilterData } from '~/@/admin/models/filter-list.model';
import { testWrapper } from '~/tests/jest-wrapper';


jest.mock('effector-react', () => ({
  useStore: jest.fn()
}));

describe('FilterRangeFields', () => {

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation((store) => {
      if (store === $filterColumnList) {
        return [];
      }
      if (store === $filterTypeChoices) {
        return {};
      }
      if (store === $filterQueryParamsChoices) {
        return {};
      }
      if (store === $formFilterData) {
        return {};
      }
    });
  });
  test('renders FilterRangeFields and take a snapshop', () => {
    const { asFragment } = render(<FilterRangeFields />);
    expect(asFragment()).toMatchSnapshot();
  });


  test('renders FilterCommonFields and take a snapshop, edit mode true', () => {
    const { asFragment } = render(<FilterCommonFields isEditMode={true} />)
    expect(asFragment()).toMatchSnapshot();
  })

})



describe('FilterCommonFields', () => {
  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation((store) => {
      if (store === $filterColumnList) {
        return [{
          id: 1,
          name: 'test',
          label: 'Test Column',
          options: {
            applicable_filter_types: {
              range: ['param1', 'param2']
            }
          }
        }];
      }
      if (store === $filterTypeChoices) {
        return {
          typeChoicesList: [
            { value: 'range', label: 'Range' },
            { value: 'select', label: 'Select' }
          ]
        };
      }
      if (store === $filterQueryParamsChoices) {
        return {
          queryParamsList: [
            { value: 'param1', label: 'Parameter 1' },
            { value: 'param2', label: 'Parameter 2' }
          ]
        };
      }
      if (store === $formFilterData) {
        return {
          code: 'test-code',
          column_configuration: '1',
          type: 'range',
          name: 'Test Filter',
          description: 'Test Description',
          query_param_filter: 'param1'
        };
      }
    });
  });

  test('renders all form fields', () => {
    const { getByText } = render(testWrapper(
      <FilterCommonFields isEditMode={false} />
    ));

    expect(getByText('Unique Code')).toBeInTheDocument();
    expect(getByText('Parameter')).toBeInTheDocument();
    expect(getByText('Filter type')).toBeInTheDocument();
    expect(getByText('Filter name')).toBeInTheDocument();
    expect(getByText('Filter description')).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    const { getByPlaceholderText } = render(testWrapper(
      <FilterCommonFields isEditMode={false} />
    ));

    const nameInput = getByPlaceholderText('Enter filter name');
    fireEvent.change(nameInput, { target: { value: 'Test Filter' } });
    expect(nameInput.value).toBe('Test Filter');
  });
});
