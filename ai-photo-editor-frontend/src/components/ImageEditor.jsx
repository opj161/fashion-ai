import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ComparisonSlider from './ComparisonSlider'; // Import the ComparisonSlider

function ImageEditor({ initialImage, isActive, initialHistory = [], onImageEdited }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [result, setResult] = useState(null);
  const [editHistory, setEditHistory] = useState(initialHistory.length > 0 ? 
    initialHistory : [{ image: initialImage, prompt: 'Original' }]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(initialHistory.length - 1 || 0);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonImage, setComparisonImage] = useState(null);

  // Rest of the existing code...
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter an edit instruction');
      return;
    }

    setLoading(true);
    try {
      const data = await api.editImage(prompt, currentImage);
      setResult(data);
      if (data.imageData) {
        setCurrentImage(data.imageData);
        // Add to history
        const newHistory = [...editHistory.slice(0, currentHistoryIndex + 1), { image: data.imageData, prompt }];
        setEditHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
        
        // Update parent component
        if (onImageEdited) {
          onImageEdited(data.imageData, newHistory);
        }
      }
      toast.success('Image edited successfully!');
    } catch (error) {
      console.error('Error editing image:', error);
      toast.error(error.error || 'Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  // Add comparison functions
  const handleCompareToggle = (index) => {
    if (showComparison && comparisonImage === editHistory[index].image) {
      // If clicking the same image again, turn off comparison
      setShowComparison(false);
      setComparisonImage(null);
    } else {
      // Enable comparison mode with selected image
      setShowComparison(true);
      setComparisonImage(editHistory[index].image);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: Current image */}
        <div className="md:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div className="border dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 
                           transition-colors duration-300">
              <h3 className="font-medium text-center mb-2 text-gray-900 dark:text-gray-100">Current Image</h3>
              <div className="flex justify-center bg-white dark:bg-gray-900 rounded p-2">
                {showComparison && comparisonImage ? (
                  <ComparisonSlider
                    beforeImage={comparisonImage}
                    afterImage={currentImage}
                    className="w-full max-h-96"
                  />
                ) : (
                  <img 
                    src={`data:image/jpeg;base64,${currentImage}`} 
                    alt="Current" 
                    className="max-w-full h-auto rounded max-h-96"
                  />
                )}
              </div>
              {showComparison && (
                <button
                  onClick={() => setShowComparison(false)}
                  className="w-full mt-2 text-xs py-1 bg-gray-200 dark:bg-gray-600
                           hover:bg-gray-300 dark:hover:bg-gray-500 rounded"
                >
                  Exit Comparison View
                </button>
              )}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border dark:border-gray-700 
                           transition-colors duration-300">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Edit History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {editHistory.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <button
                      onClick={() => handleHistoryNavigation(index)}
                      className={`text-left block flex-grow px-2 py-1 rounded text-sm 
                                transition-colors duration-200 ${
                                  index === currentHistoryIndex 
                                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                    >
                      {index === 0 ? 'Original' : `Edit ${index}: ${item.prompt.substring(0, 20)}${item.prompt.length > 20 ? '...' : ''}`}
                    </button>
                    <button
                      onClick={() => handleCompareToggle(index)}
                      className={`ml-1 p-1 rounded-full text-gray-500 hover:text-primary-600 
                                ${showComparison && comparisonImage === item.image 
                                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400' 
                                  : ''}`}
                      title="Compare with current"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 
                        text-white rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </button>
          </div>
        </div>
        
        {/* Rest of the component remains the same */}
        {/* ... */}
      </div>
    </div>
  );
}

export default ImageEditor;