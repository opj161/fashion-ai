import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { EditorProvider } from './contexts/EditorContext';
import Header from './components/Header';
import Footer from './components/Footer';
import UnifiedEditor from './components/UnifiedEditor';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <EditorProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Toaster position="top-center" />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
              <UnifiedEditor />
            </main>
            <Footer />
          </div>
        </EditorProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;