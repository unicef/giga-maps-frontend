import { scrollToHashFx } from "../scroll-to-hash-fx";

describe('scrollToHash', () => {
  let mockDocument: { querySelector: vi.Mock };
  let mockWindow: { scrollTo: vi.Mock };
  let mockGetElementYPosition: vi.Mock;

  beforeEach(() => {
    mockDocument = {
      querySelector: vi.fn()
    };
    mockWindow = {
      scrollTo: vi.fn()
    };
    mockGetElementYPosition = vi.fn();

    global.document = mockDocument as any;
    global.window = mockWindow as any;
  });

  it('should not scroll when element is not found', async () => {
    mockDocument.querySelector.mockReturnValue(null);
    await scrollToHashFx('#missing-element');
    expect(mockWindow.scrollTo).not.toHaveBeenCalled();
  });
});

