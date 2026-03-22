import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let message = "Something went wrong.";
      try {
        const errObj = JSON.parse(this.state.error?.message || "{}");
        if (errObj.error?.includes("Missing or insufficient permissions")) {
          message = "You don't have permission to perform this action. Please check if you are logged in.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-12 text-center">
          <div className="max-w-md space-y-6">
            <h2 className="text-3xl font-serif">Oops!</h2>
            <p className="text-black/60">{message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-brand-dark text-white rounded-full font-bold uppercase tracking-widest"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
