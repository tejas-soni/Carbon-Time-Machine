/**
 * @fileoverview React Error Boundary for graceful error recovery.
 * Catches unhandled errors in the component tree and displays
 * a user-friendly fallback UI instead of a blank screen.
 */
import { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary component that wraps the application to catch
 * and gracefully handle unexpected runtime errors.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    log('error', 'Carbon Time Machine encountered an error:', { error, errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <h2>⏳ Something went wrong</h2>
          <p className="error-boundary-message">
            The Carbon Time Machine encountered an unexpected error.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="error-boundary-btn"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
