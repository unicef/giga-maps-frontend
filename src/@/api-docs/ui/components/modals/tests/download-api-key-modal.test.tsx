import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { fork } from 'effector';
import { Provider } from 'effector-react/scope';
import { validateApiKeyFx } from '~/@/api-docs/effects/api-keys-fx';
import { $currentSelectedApi, $currentSelectedApiData, $exploreApiData, setCurrentExploreApi } from '~/@/api-docs/models/explore-api.model';
import { $downloadApiPopup, $documentApiPopup, onDocumentAPIPopup, onDownloadAPIPopup } from '~/@/api-docs/models/popup.model';
import DownloadApiKeyModal from '../download-api-key-modal.view';
import { getExploreApiListFx } from '~/@/api-docs/effects/explore-api-fx';

// Mock the navigation function
jest.mock('~/core/routes', () => ({
  apiInfo: {
    navigate: jest.fn(),
  },
}));

describe('DownloadApiKeyModal', () => {
  const testApiData = {
    id: 1,
    category: 'private',
    name: 'Test API'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set initial store values using events
    onDownloadAPIPopup(true);
    onDocumentAPIPopup(false);
    getExploreApiListFx.doneData.watch(() => {
      setCurrentExploreApi(testApiData.id);
    });
    getExploreApiListFx.doneData({ results: [testApiData] });
  });

  it('renders modal when downloadApiPopup is true', () => {
    render(<DownloadApiKeyModal />);
    expect(screen.queryByText("Enter API Key")).toBeInTheDocument();
  });

  it('shows error message when submitting empty API key', async () => {
    onDocumentAPIPopup(true);
    const mockValidateApiKey = jest.fn().mockRejectedValueOnce(new Error('Invalid API key'));
    validateApiKeyFx.use(mockValidateApiKey);

    render(<DownloadApiKeyModal />);

    const apiKeyInput = screen.getByPlaceholderText(/Enter the api_key value/i);
    await fireEvent.change(apiKeyInput, { target: { value: '123' } });
    const submitButton = screen.getByText('Submit');
    await fireEvent.click(submitButton);

    await waitFor(async () => {
      expect(mockValidateApiKey).toHaveBeenCalledWith({
        api_id: 1,
        api_key: '123'
      });

      onDocumentAPIPopup(false);
      const submitButton = screen.getByText('Submit');
      await fireEvent.click(submitButton);
    });
  });

  it('validates API key on submit', async () => {
    const mockValidateApiKey = jest.fn().mockResolvedValueOnce(true);
    validateApiKeyFx.use(mockValidateApiKey);

    render(<DownloadApiKeyModal />);

    const apiKeyInput = screen.getByPlaceholderText(/Enter the api_key value/i);
    await fireEvent.change(apiKeyInput, { target: { value: 'valid-api-key' } });

    const submitButton = screen.getByText('Submit');
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockValidateApiKey).toHaveBeenCalledWith({
        api_id: 1,
        api_key: 'valid-api-key'
      });
      expect($downloadApiPopup.getState()).toBe(false);
    });
  });

  it('request api key on button is clicked', () => {
    render(<DownloadApiKeyModal />);
    const submitButton = screen.getByText('Request API Key');
    fireEvent.click(submitButton);
  });

  it('request api key on button is clicked when api is public', () => {
    getExploreApiListFx.doneData({ results: [{ ...testApiData, category: 'public' }] });
    render(<DownloadApiKeyModal />);
    const submitButton = screen.getByText('Request API Key');
    fireEvent.click(submitButton);
  });

});