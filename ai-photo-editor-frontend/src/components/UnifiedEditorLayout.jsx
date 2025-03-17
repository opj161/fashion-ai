import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';

function UnifiedEditorLayout({ controlPanel, previewPanel }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showControlPanel, setShowControlPanel] = useState(true);
  
  // Check if we're on mobile and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="unified-editor-layout h-full">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setShowControlPanel(true)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                showControlPanel
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setShowControlPanel(false)}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                !showControlPanel
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        <div className="h-full overflow-auto p-4">
          {showControlPanel ? controlPanel : previewPanel}
        </div>
      </div>
    );
  }

  return (
    <div className="unified-editor-layout h-full">
      <SplitPane
        split="vertical"
        minSize={300}
        defaultSize="40%"
        primary="first"
        className="h-full"
      >
        <div className="h-full overflow-auto p-4">{controlPanel}</div>
        <div className="h-full overflow-auto p-4">{previewPanel}</div>
      </SplitPane>
    </div>
  );
}

UnifiedEditorLayout.propTypes = {
  controlPanel: PropTypes.node.isRequired,
  previewPanel: PropTypes.node.isRequired
};

export default UnifiedEditorLayout;
