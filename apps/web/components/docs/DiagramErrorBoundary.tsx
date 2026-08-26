'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DiagramErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Diagram Error Boundary Caught Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="my-6 rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center text-rose-200">
          <div className="flex items-center justify-center space-x-2 text-rose-400 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold text-sm">Visual Diagram Load Warning</span>
          </div>
          <p className="text-xs text-rose-300">
            {this.props.fallbackTitle || 'Unable to render interactive SVG diagram asset. Displaying text fallback specification.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DiagramErrorBoundary;
