import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg m-4">
          <div className="text-red-500 dark:text-red-400 text-xl font-semibold mb-4">
            Something went wrong
          </div>
          <details className="text-left bg-white dark:bg-gray-800 p-4 rounded shadow-inner text-sm mb-4">
            <summary className="cursor-pointer font-medium mb-2">
              Error details (for developers)
            </summary>
            <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
              {this.state.error && this.state.error.toString()}
            </pre>
            <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 mt-2">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
