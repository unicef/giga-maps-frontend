import { AlertTriangle, RefreshCw } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import { captureComponentError } from '~/core/sentry';
import { cn } from '~/lib/cn';

export type ErrorBoundaryVariant = 'page' | 'card' | 'inline' | 'banner' | 'minimal';

export interface ErrorBoundaryProps {
  name?: string;
  componentName?: string;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  variant?: ErrorBoundaryVariant;
  onReset?: () => void;
  showDetails?: boolean;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    const identifier = this.props.name || this.props.componentName || 'UnknownComponent';

    captureComponentError(error, identifier, {
      componentStack: errorInfo.componentStack,
      variant: this.props.variant,
    });
  }

  resetError = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  renderFallback(): ReactNode {
    const { name, componentName, fallback, variant = 'card', showDetails } = this.props;
    const identifier = name || componentName || 'Component';
    const { error, errorInfo } = this.state;

    if (typeof fallback === 'function') {
      return fallback(error ?? new Error('Unknown error'), this.resetError);
    }

    if (fallback !== undefined) {
      return fallback;
    }

    const isDevOrStaging =
      showDetails ?? (import.meta.env.DEV || import.meta.env.MODE === 'staging');

    if (variant === 'minimal') {
      return (
        <div
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-destructive bg-destructive/10 rounded"
          title={error?.message}
          data-slot="error-boundary-minimal"
        >
          <AlertTriangle className="size-3 shrink-0" />
          <span>Failed to load {identifier}</span>
          <button
            type="button"
            onClick={this.resetError}
            className="hover:underline cursor-pointer ml-1 font-medium"
          >
            Retry
          </button>
        </div>
      );
    }

    if (variant === 'inline') {
      return (
        <div
          className="flex items-center justify-between gap-3 p-3 my-1 border border-destructive/30 bg-destructive/5 rounded-md text-sm text-foreground"
          data-slot="error-boundary-inline"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="size-4 text-destructive shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-destructive">{identifier}: </span>
              <span className="text-muted-foreground">{error?.message || 'Something went wrong.'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={this.resetError}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-background border border-border rounded hover:bg-accent text-foreground transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        </div>
      );
    }

    if (variant === 'banner') {
      return (
        <div
          className="w-full p-4 border-b border-destructive/20 bg-destructive/10 text-foreground flex items-center justify-between gap-4"
          data-slot="error-boundary-banner"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-destructive shrink-0" />
            <div>
              <p className="font-medium text-sm">Error in {identifier}</p>
              <p className="text-xs text-muted-foreground">{error?.message || 'An unexpected error occurred.'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={this.resetError}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background text-foreground border border-border rounded-md hover:bg-accent transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            Retry
          </button>
        </div>
      );
    }

    if (variant === 'page') {
      return (
        <div
          className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background text-foreground"
          data-slot="error-boundary-page"
        >
          <div className="max-w-md w-full text-center space-y-4 p-8 border border-border rounded-xl bg-card shadow-lg">
            <div className="mx-auto size-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mt-1">
                An error occurred while loading <span className="font-semibold text-foreground">{identifier}</span>.
              </p>
            </div>

            {isDevOrStaging && error && (
              <details className="text-left text-xs bg-muted p-3 rounded-md border border-border/50 max-h-48 overflow-auto">
                <summary className="font-mono cursor-pointer text-destructive font-semibold">
                  {error.name}: {error.message}
                </summary>
                {errorInfo?.componentStack && (
                  <pre className="mt-2 font-mono whitespace-pre-wrap text-muted-foreground text-[10px]">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.resetError}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <RefreshCw className="size-4" />
                Try again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border bg-background hover:bg-accent text-foreground transition-colors cursor-pointer"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default 'card' variant
    return (
      <div
        className={cn(
          'p-5 border border-border rounded-lg bg-card text-foreground shadow-xs my-2 flex flex-col gap-3'
        )}
        data-slot="error-boundary-card"
      >
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shrink-0 mt-0.5">
            <AlertTriangle className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold leading-none">{identifier} failed to load</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {error?.message || 'An unexpected error occurred while rendering this section.'}
            </p>
          </div>
        </div>

        {isDevOrStaging && error && (
          <details className="text-left text-xs bg-muted p-2 rounded border border-border/50 max-h-36 overflow-auto">
            <summary className="font-mono cursor-pointer text-destructive text-[11px]">
              {error.name}: {error.message}
            </summary>
            {errorInfo?.componentStack && (
              <pre className="mt-1 font-mono whitespace-pre-wrap text-muted-foreground text-[10px]">
                {errorInfo.componentStack}
              </pre>
            )}
          </details>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={this.resetError}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-border bg-background hover:bg-accent text-foreground transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallback();
    }
    return this.props.children;
  }
}

/**
 * Higher-Order Component to wrap any component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    name?: string;
    componentName?: string;
    variant?: ErrorBoundaryVariant;
    fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
    showDetails?: boolean;
    onReset?: () => void;
  }
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...options}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${
    options.name || options.componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundary;
}

// Backward compatibility alias
export const ComponentErrorBoundary = ErrorBoundary;
export const withComponentErrorBoundary = withErrorBoundary;
export type ComponentErrorBoundaryProps = ErrorBoundaryProps;
