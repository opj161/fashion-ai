import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResizablePanes, Pane } from 'resizable-panes-react';

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
      <ResizablePanes 
        uniqueId="editor-layout"
        className="h-full"
        resizerClass="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <Pane id="control-panel" size={40}>
          <div className="h-full overflow-auto p-4">{controlPanel}</div>
        </Pane>
        <Pane id="preview-panel" size={60}>
          <div className="h-full overflow-auto p-4">{previewPanel}</div>
        </Pane>
      </ResizablePanes>
    </div>
  );
}

UnifiedEditorLayout.propTypes = {
  controlPanel: PropTypes.node.isRequired,
  previewPanel: PropTypes.node.isRequired
};

export default UnifiedEditorLayout;
