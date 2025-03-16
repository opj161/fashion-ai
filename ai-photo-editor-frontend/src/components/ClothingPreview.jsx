import { useState } from 'react';

/**
 * ClothingPreview component for displaying the uploaded clothing image
 * @param {string} clothingImage - Base64 encoded image data
 */
function ClothingPreview({ clothingImage }) {
  const [previewScaling, setPreviewScaling] = useState('fit');

  return (
    <div className="sticky top-4">
      <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-center text-gray-900 dark:text-gray-100">Your Clothing Item</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPreviewScaling('fit')}
              className={`p-1 rounded ${previewScaling === 'fit' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              title="Fit to container"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button 
              onClick={() => setPreviewScaling('actual')}
              className={`p-1 rounded ${previewScaling === 'actual' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              title="Actual size"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded p-2 flex justify-center">
          <img 
            src={`data:image/jpeg;base64,${clothingImage}`} 
            alt="Clothing item" 
            className={`${previewScaling === 'fit' ? 'max-w-full h-auto' : 'w-auto h-auto'} max-h-80 rounded`}
          />
        </div>
      </div>
    </div>
  );
}

export default ClothingPreview;
