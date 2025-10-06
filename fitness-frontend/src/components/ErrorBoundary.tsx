import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: 'var(--space-xl)',
          textAlign: 'center'
        }}>
          <div className="card" style={{
            maxWidth: '600px',
            backgroundColor: 'var(--color-error-50)',
            border: '2px solid var(--color-error)'
          }}>
            <h2 className="text-h3" style={{ color: 'var(--color-error-dark)', marginBottom: 'var(--space-md)' }}>
              Something went wrong
            </h2>
            <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
              We're sorry for the inconvenience. The application encountered an error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: 'var(--space-lg)',
                textAlign: 'left',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-background-elevated)',
                borderRadius: 'var(--radius-md)',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: 'var(--space-sm)', fontWeight: '600' }}>
                  Error Details
                </summary>
                <pre style={{
                  fontSize: 'var(--font-size-xs)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: 'var(--color-error-dark)'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn btn-ghost"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
