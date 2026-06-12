import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
              <span className="text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="bg-gray-200 text-gray-900 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-300 transition-all"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
