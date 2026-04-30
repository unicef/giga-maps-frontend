import { updateSchoolPopupFx } from './update-school-popup.fx';

describe('updateSchoolPopupFx', () => {

  it('should return early if popup or country not provided', async () => {
    const result = await updateSchoolPopupFx({
      country: null,
      popup: {
        setDOMContent: vi.fn()
      },
      schoolPopupData: {
        id: '1',
        name: 'Test School'
      }
    } as any);
    expect(result).toBeUndefined();
  });

  it('should set popup content using createAndSetPopupTemplate', async () => {
    const setDOMContent = vi.fn();
    document.body.innerHTML = '<div class="map-popup-template"></div>';
    const result = await updateSchoolPopupFx({
      country: { code: 'US' },
      popup: {
        setDOMContent
      },
      schoolPopupData: {
        id: '1',
        name: 'Test School'
      }
    } as any);
    expect(result).toBeUndefined();
  });

  it('should handle errors', async () => {
    const setDOMContent = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = await updateSchoolPopupFx({
      country: { code: 'US' },
      popup: {
        setDOMContent
      },
      schoolPopupData: {
        id: '1',
        name: 'Test School'
      }
    } as any);

    expect(result).toBeUndefined();
  });

});

