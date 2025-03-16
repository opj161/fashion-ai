import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import InfoBox from './common/InfoBox';
import { CARD_STYLES, BUTTON_VARIANTS } from '../styles/constants';

/**
 * Button for quick edit options
 */
const QuickEditButton = ({ text, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} 
      px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 transition-colors`}
  >
    {text}
  </button>
);

QuickEditButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

/**
 * Component for editing generated fashion model images
 */
function ImageEditor({ initialImage, isActive, initialHistory = [], onImageEdited }) {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [history, setHistory] = useState(initialHistory);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (initialImage && (!history.length || history[0] !== initialImage)) {
      setHistory([initialImage, ...history]);
      setCurrentImage(initialImage);
      setHistoryIndex(0);
    }
  }, [initialImage]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an edit instruction');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.editImage(prompt, currentImage);
      
      if (data.imageData) {
        // Create new history entry
        const newHistory = [data.imageData, ...history.slice(historyIndex)];
        setHistory(newHistory);
        setCurrentImage(data.imageData);
        setHistoryIndex(0);
        setPrompt('');
        
        // Notify parent of edit
        if (onImageEdited) {
          onImageEdited(data.imageData);
        }
        
        toast.success('Image edited successfully!');
      } else {
        throw new Error('Failed to edit image');
      }
    } catch (err) {
      console.error('Error editing image:', err);
      setError(err.message || 'Failed to edit image');
      toast.error(err.message || 'Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryNavigation = (index) => {
    if (index >= 0 && index < history.length) {
      setCurrentImage(history[index]);
      setHistoryIndex(index);
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${currentImage}`;
      link.download = `fashion-model-edited-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current image */}
        <div>
          <div className={CARD_STYLES.container}>
            <h3 className={CARD_STYLES.title}>Current Image</h3>
            <div className="bg-white dark:bg-gray-900 rounded p-2 flex justify-center">
              <img 
                src={`data:image/jpeg;base64,${currentImage}`} 
                alt="Fashion model" 
                className="max-h-96 max-w-full h-auto rounded object-contain"
              />
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleDownload}
                className={BUTTON_VARIANTS.primary}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
        
        {/* Edit controls */}
        <div>
          <div className={CARD_STYLES.container}>
            <h3 className={CARD_STYLES.title}>Edit Image</h3>
            
            <div className="mb-4">
              <label htmlFor="editPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Edit Instructions
              </label>
              <textarea
                id="editPrompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to change..."
                className="w-full border rounded-md p-3 h-28 dark:bg-gray-800 dark:border-gray-600"
                disabled={loading}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${BUTTON_VARIANTS.primary} w-full mb-4`}
            >
              {loading ? (
                <>
                  <LoadingSpinner /> 
                  <span className="ml-2">Processing...</span>
                </>
              ) : 'Apply Changes'}
            </button>
            
            <div className="mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Edits</h4>
              <div className="flex flex-wrap gap-2">
                <QuickEditButton 
                  text="More professional" 
                  onClick={() => {
                    setPrompt("Make the image look more professional, like a high-end fashion catalog photo");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="Better lighting" 
                  onClick={() => {
                    setPrompt("Improve the lighting to better showcase the clothing item");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="Fix proportions" 
                  onClick={() => {
                    setPrompt("Fix any proportion issues with the model and make the body look more natural");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="Brighter background" 
                  onClick={() => {
                    setPrompt("Make the background brighter and cleaner");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="More contrast" 
                  onClick={() => {
                    setPrompt("Increase the contrast to make the clothing item stand out more");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="Natural pose" 
                  onClick={() => {
                    setPrompt("Make the model's pose look more natural and comfortable");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="Focus on garment" 
                  onClick={() => {
                    setPrompt("Make the clothing item the main focus of the image");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
                <QuickEditButton 
                  text="Fix artifacts" 
                  onClick={() => {
                    setPrompt("Remove any visual glitches or artifacts in the image");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          {/* History navigation */}
          {history.length > 1 && (
            <div className={CARD_STYLES.container}>
              <h3 className={CARD_STYLES.title}>Edit History</h3>
              <div className="grid grid-cols-4 gap-2">
                {history.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryNavigation(index)}
                    className={`border p-1 rounded ${historyIndex === index 
                      ? 'border-primary-500 dark:border-primary-400' 
                      : 'border-gray-300 dark:border-gray-700'}`}
                  >
                    <img 
                      src={`data:image/jpeg;base64,${img}`}
                      alt={`History ${index}`}
                      className="w-full h-auto rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <InfoBox type="error" title="Error">
          {error}
        </InfoBox>
      )}
      
      <InfoBox type="tip" title="Tip">
        For best results, be specific about what you want to change. For example, "Make the background brighter" or "Make the model's pose more natural."
      </InfoBox>
    </div>
  );
}

ImageEditor.propTypes = {
  initialImage: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  initialHistory: PropTypes.arrayOf(PropTypes.string),
  onImageEdited: PropTypes.func
};

ImageEditor.defaultProps = {
  isActive: true,
  initialHistory: [],
  onImageEdited: () => {}
};

export default ImageEditor;