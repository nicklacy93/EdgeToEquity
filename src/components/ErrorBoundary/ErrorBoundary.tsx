'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary: () => void;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We encountered an unexpected error. This has been logged and we'll work on fixing it.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-6 text-left">
          <summary className="cursor-pointer mb-2 font-medium">Error Details</summary>
          <pre className="text-sm bg-muted p-4 rounded overflow-auto max-w-lg">
            {error.stack}
          </pre>
        </details>
      )}
      
      <div className="flex gap-4">
        <Button onClick={resetErrorBoundary} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'}>
          <Home className="h-4 w-4 mr-2" />
          Go home
        </Button>
      </div>
    </div>
  );
}

// Specialized error boundary for TradingView widgets
export function TradingViewErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={TradingViewErrorFallback}
      onError={(error) => {
        console.error('TradingView Error:', error);
        // Could send to error tracking service here
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function TradingViewErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-background">
      <AlertTriangle className="h-12 w-12 text-warning mb-4" />
      <h3 className="text-lg font-semibold mb-2">Chart Loading Error</h3>
      <p className="text-muted-foreground mb-4 text-center">
        Unable to load TradingView chart. This might be due to network issues or widget configuration.
      </p>
      <Button onClick={resetErrorBoundary} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry Chart
      </Button>
    </div>
  );
}

export default ErrorBoundary;
