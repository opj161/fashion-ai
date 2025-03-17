import React from 'react';
import PropTypes from 'prop-types';
import { CARD_STYLES } from '../styles/constants';
import ImageTransition from './common/ImageTransition';

function PreviewPanel({
  generatedImage,
  isGenerating,
  editControls,
  onDownload,
  editHistory
}) {
  return (
    <div className="preview-panel space-y-6">
      <div className={CARD_STYLES.container}>
        <h3 className={CARD_STYLES.title}>Fashion Model Preview</h3>
        
        <div className="preview-container min-h-[400px] bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-4 flex items-center justify-center">
          <ImageTransition 
            image={generatedImage}
            isLoading={isGenerating}
            alt="Generated fashion model"
            className="w-full h-full"
            fallback={
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>No preview generated yet</p>
                <p className="text-sm mt-2">Upload an image and click Generate to see results</p>
              </div>
            }
          />
        </div>
      </div>
      
      {/* Edit controls appear when there's a generated image */}
      {generatedImage && (
        <>
          <div className={CARD_STYLES.container}>
            <div className="flex justify-between items-center">
              <h3 className={CARD_STYLES.title}>Quick Edits</h3>
              <button 
                onClick={onDownload}
                className="text-sm flex items-center text-primary-600 hover:text-primary-800"
              >
                <span className="mr-1">Download</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            
            <div className="edit-controls mt-2">
              {editControls}
            </div>
          </div>
          
          {editHistory && editHistory.length > 0 && (
            <div className={CARD_STYLES.container}>
              <h3 className={CARD_STYLES.title}>History</h3>
              <div className="flex overflow-x-auto gap-2 py-2">
                {editHistory.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer border rounded overflow-hidden w-20 h-20 flex-shrink-0 ${index === 0 ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <img 
                      src={`data:image/jpeg;base64,${image}`}
                      alt={`Version ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

PreviewPanel.propTypes = {
  generatedImage: PropTypes.string,
  isGenerating: PropTypes.bool,
  editControls: PropTypes.node,
  onDownload: PropTypes.func.isRequired,
  editHistory: PropTypes.array
};

export default PreviewPanel;
