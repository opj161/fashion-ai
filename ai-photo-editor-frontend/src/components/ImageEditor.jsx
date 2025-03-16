import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function ImageEditor({ initialImage, isActive }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [result, setResult] = useState(null);
  const [editHistory, setEditHistory] = useState([{ image: initialImage, prompt: 'Original' }]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const predefinedPrompts = [
    { text: 'Add a plain white background', category: 'background' },
    { text: 'Improve lighting and contrast', category: 'quality' },
    { text: 'Make the colors more vibrant', category: 'color' },
    { text: 'Change background to studio gray', category: 'background' },
    { text: 'Add soft shadows for depth', category: 'lighting' },
    { text: 'Remove any distractions from background', category: 'background' },
    { text: 'Make it look more professional', category: 'quality' }
  ];

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
      }
      toast.success('Image edited successfully!');
    } catch (error) {
      console.error('Error editing image:', error);
      toast.error(error.error || 'Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  const handleUsePrompt = (promptText) => {
    setPrompt(promptText);
  };

  const handleHistoryNavigation = (index) => {
    if (index >= 0 && index < editHistory.length) {
      setCurrentHistoryIndex(index);
      setCurrentImage(editHistory[index].image);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${currentImage}`;
    link.download = 'fashion-model-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded');
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
                <img 
                  src={`data:image/jpeg;base64,${currentImage}`} 
                  alt="Current" 
                  className="max-w-full h-auto rounded max-h-96"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border dark:border-gray-700 
                           transition-colors duration-300">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Edit History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {editHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryNavigation(index)}
                    className={`text-left block w-full px-2 py-1 rounded text-sm 
                              transition-colors duration-200 ${
                                index === currentHistoryIndex 
                                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                  >
                    {index === 0 ? 'Original' : `Edit ${index}: ${item.prompt.substring(0, 20)}${item.prompt.length > 20 ? '...' : ''}`}
                  </button>
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
        
        {/* Right side: Edit controls */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border dark:border-gray-700 
                         transition-colors duration-300">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Quick Edits</h3>
            <div className="flex flex-wrap gap-2">
              {predefinedPrompts.map((predefined, index) => (
                <button
                  key={index}
                  onClick={() => handleUsePrompt(predefined.text)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                            rounded-full px-3 py-1 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 
                            hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300
                            transition-colors duration-200"
                >
                  {predefined.text}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Describe how you'd like to edit the image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border dark:border-gray-700 rounded-lg p-3 h-28 bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                          focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700 focus:border-transparent
                          transition-colors duration-200"
                placeholder="Examples: 'Make the background pure white', 'Enhance the lighting', 'Add a shadow under the model'..."
                disabled={loading}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg 
                          hover:bg-primary-700 dark:hover:bg-primary-600 
                          disabled:bg-primary-400 dark:disabled:bg-primary-800 
                          shadow-sm hover:shadow-md transition-all duration-200"
                disabled={loading || !prompt.trim()}
              >
                {loading ? <LoadingSpinner /> : 'Apply Edit'}
              </button>
            </div>
          </form>

          {result && result.text && (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg 
                          border border-primary-100 dark:border-primary-800/50 
                          transition-colors duration-300">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">AI Description:</h3>
              <p className="text-gray-700 dark:text-gray-300">{result.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageEditor;