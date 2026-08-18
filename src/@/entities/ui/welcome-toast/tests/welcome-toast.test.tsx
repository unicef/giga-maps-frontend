import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testWrapper } from '~/tests/test-wrapper';

const STORAGE_KEY = 'welcome-toast-dismissed';
const BEFORE_EXPIRY = new Date('2026-08-05T00:00:00Z');
const AFTER_EXPIRY = new Date('2026-11-06T00:00:00Z');

const TITLE_EN = 'Health facilities are here!';
const TITLE_ES = '¡Ya están las instalaciones de salud!';

/**
 * The model reads localStorage and the expiry date at import time, so each case
 * needs a fresh module graph - i18next included, hence the re-init.
 * `$isMobile` starts inverted and settles in a timeout, so it needs a flush.
 */
const renderToast = async (language = 'en', isMobile = false) => {
  vi.resetModules();
  window.matchMedia = ((query: string) => ({
    addEventListener: vi.fn(),
    matches: isMobile,
    media: query,
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  const { default: i18next } = await import('i18next');
  await import('~/core/i18n/instance');
  await i18next.changeLanguage(language);

  const { default: WelcomeToast } = await import('../welcome-toast');
  const result = render(testWrapper(<WelcomeToast />));
  await act(async () => {
    vi.runAllTimers();
  });

  return result;
};

describe('WelcomeToast', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(BEFORE_EXPIRY);
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('renders on a first visit, before the expiry date', async () => {
    await renderToast();

    expect(screen.getByText(TITLE_EN)).toBeInTheDocument();
  });

  it('hides itself and persists the flag when dismissed', async () => {
    await renderToast();

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));

    expect(screen.queryByText(TITLE_EN)).not.toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('does not render when it was already dismissed', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');

    await renderToast();

    expect(screen.queryByText(TITLE_EN)).not.toBeInTheDocument();
  });

  it('does not render past the expiry date, even if never dismissed', async () => {
    vi.setSystemTime(AFTER_EXPIRY);

    await renderToast();

    expect(screen.queryByText(TITLE_EN)).not.toBeInTheDocument();
  });

  it('dismisses from the mobile confirm button', async () => {
    await renderToast('en', true);

    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    expect(screen.queryByText(TITLE_EN)).not.toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('keeps the embedded contact link when the copy is translated', async () => {
    await renderToast('es');

    expect(screen.getByText(TITLE_ES)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('escríbenos');
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'mailto:gigamaps@unicef.org',
    );
  });
});
