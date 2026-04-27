import React from 'react';

/**
 * Standard Error Boundary component to prevent React component trees from crashing entirely.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-error p-8 border border-error/20 rounded-2xl bg-error/5">
          <span className="material-symbols-outlined text-5xl mb-4">warning</span>
          <h2 className="font-headline text-2xl font-bold mb-2">Component Rendering Failure</h2>
          <p className="text-on-surface-variant text-sm mb-4">A critical error occurred within this neural module.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-error/20 rounded-xl font-bold text-on-surface hover:bg-error/40 transition-colors">
            Reboot Interface
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
