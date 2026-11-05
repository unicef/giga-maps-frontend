const mockViewport = (isMobile: boolean) => {
  vi.mocked(window.matchMedia).mockImplementation(
    (query) =>
      ({
        matches: isMobile && query === '(max-width: 768px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
};

// The initial value is read once at import, so each case needs a fresh model.
const loadFlyoutState = async () => {
  vi.resetModules();
  const { $sidebarFlyoutState } = await import('../../sidebar.model');
  return $sidebarFlyoutState.getState();
};

describe('Initial sidebar flyout state', () => {
  test('starts collapsed on mobile', async () => {
    mockViewport(true);
    expect(await loadFlyoutState()).toBe('collapsed');
  });

  test('starts at default on desktop', async () => {
    mockViewport(false);
    expect(await loadFlyoutState()).toBe('default');
  });
});
