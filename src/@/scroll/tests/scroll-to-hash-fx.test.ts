import { scrollToHashFx } from "../scroll-to-hash-fx";

describe('scrollToHash', () => {
  let mockDocument: { querySelector: jest.Mock };
  let mockWindow: { scrollTo: jest.Mock };
  let mockGetElementYPosition: jest.Mock;

  beforeEach(() => {
    mockDocument = {
      querySelector: jest.fn()
    };
    mockWindow = {
      scrollTo: jest.fn()
    };
    mockGetElementYPosition = jest.fn();

    global.document = mockDocument as any;
    global.window = mockWindow as any;
  });

  it('should not scroll when element is not found', async () => {
    mockDocument.querySelector.mockReturnValue(null);
    await scrollToHashFx('#missing-element');
    expect(mockWindow.scrollTo).not.toHaveBeenCalled();
  });
});
