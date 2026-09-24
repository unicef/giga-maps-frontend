import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import * as sentryCore from '~/core/sentry';

import { ErrorBoundary, withErrorBoundary } from './error-boundary';

vi.mock('~/core/sentry', () => ({
  captureComponentError: vi.fn(),
  initSentry: vi.fn(),
  captureApiError: vi.fn(),
  setSentryUser: vi.fn(),
  clearSentryUser: vi.fn(),
  addSentryBreadcrumb: vi.fn(),
}));

// Component that throws on demand
const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Crashing component test');
  }
  return <div>Component is healthy</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Silence React's uncaught error logging in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary name="TestNormalComponent">
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Component is healthy')).toBeInTheDocument();
  });

  it('catches error, calls Sentry capture, and renders no error component', () => {
    const { container } = render(
      <ErrorBoundary name="TestBrokenComponent" variant="card">
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('Component is healthy')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
    expect(sentryCore.captureComponentError).toHaveBeenCalledWith(
      expect.any(Error),
      'TestBrokenComponent',
      expect.objectContaining({ variant: 'card' }),
    );
  });

  it('supports custom fallback node', () => {
    render(
      <ErrorBoundary
        name="CustomFallbackComponent"
        fallback={<div>Custom Fallback UI</div>}
      >
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom Fallback UI')).toBeInTheDocument();
  });

  it('supports HOC withErrorBoundary without rendering error component on crash', () => {
    const SafeComponent = withErrorBoundary(ProblemChild, {
      name: 'HocComponent',
      variant: 'inline',
    });

    const { container } = render(<SafeComponent shouldThrow={true} />);

    expect(container.firstChild).toBeNull();
    expect(sentryCore.captureComponentError).toHaveBeenCalledWith(
      expect.any(Error),
      'HocComponent',
      expect.objectContaining({ variant: 'inline' }),
    );
  });
});
