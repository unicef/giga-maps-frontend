import { render } from '@testing-library/react';
import ApiKeyItem from '../api-key-item.view';
import { testWrapper } from '~/tests/jest-wrapper';
import { useStore } from 'effector-react';

jest.mock('effector-react', () => ({
  useStore: jest.fn()
}));

describe('ApiKeyItem', () => {
  const mockSetApiKeyDeleteId = jest.fn();
  const defaultProps = {
    item: {
      id: '1',
      api: { name: 'Test API' },
      api_key: 'test-key-123',
      status: 'APPROVED',
      valid_to: '2024-12-31',
      active_countries_list: [],
      extension_status: null,
      extension_valid_to: null
    },
    countryLength: 10,
    setApiKeyDeleteId: mockSetApiKeyDeleteId
  } as any;

  beforeEach(() => {
    (useStore as jest.Mock).mockReturnValue({ CAN_DELETE_API_KEY: true });
  });

  test('renders api name correctly', () => {
    const { getByText } = render(testWrapper(<ApiKeyItem {...defaultProps} />));
    expect(getByText('Test API')).toBeInTheDocument();
  });

  test('shows country name when single country is active', () => {
    const props = {
      ...defaultProps,
      item: {
        ...defaultProps.item,
        active_countries_list: [{ name: 'TestCountry' }]
      }
    };
    const { getByText } = render(testWrapper(<ApiKeyItem {...props} />));
    expect(getByText('TestCountry')).toBeInTheDocument();
  });

  test('shows count and view list button for multiple countries', () => {
    const props = {
      ...defaultProps,
      item: {
        ...defaultProps.item,
        active_countries_list: [
          { name: 'Country1' },
          { name: 'Country2' }
        ]
      }
    };
    const { getByText } = render(testWrapper(<ApiKeyItem {...props} />));
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('View list')).toBeInTheDocument();
  });
});
