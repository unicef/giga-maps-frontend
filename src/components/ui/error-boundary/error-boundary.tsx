import React, { Component, ErrorInfo, ReactNode } from 'react';

import { captureComponentError } from '~/core/sentry';

export type ErrorBoundaryVariant =
  | 'page'
  | 'card'
  | 'inline'
  | 'banner'
  | 'minimal';

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

    const identifier =
      this.props.name || this.props.componentName || 'UnknownComponent';

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

  override render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(
          this.state.error ?? new Error('Unknown error'),
          this.resetError,
        );
      }
      return this.props.fallback ?? null;
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
    fallback?:
      | ReactNode
      | ((error: Error, resetError: () => void) => ReactNode);
    showDetails?: boolean;
    onReset?: () => void;
  },
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...options}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${
    options.name ||
    options.componentName ||
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
  })`;

  return WithErrorBoundary;
}

// Backward compatibility alias
export const ComponentErrorBoundary = ErrorBoundary;
export const withComponentErrorBoundary = withErrorBoundary;
export type ComponentErrorBoundaryProps = ErrorBoundaryProps;
