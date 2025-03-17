import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import InfoBox from './common/InfoBox';
import { CARD_STYLES, BUTTON_VARIANTS } from '../styles/constants';

/**
 * Component for uploading and previewing clothing images
 * @param {function} onImageUploaded - Callback when an image is successfully uploaded
 * @param {boolean} isActive - Whether this component is currently active
 * @param {function} onActivate - Callback when the component becomes active
 */
function ImageUploader({ onImageUploaded, isActive = true, onActivate = () => {} }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  // Activate component when mounted
  useEffect(() => {
    if (!isActive) {
      onActivate();
    }
  }, [isActive, onActivate]);

  const processFile = async (file) => {
    // Reset states
    setLoading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.type.match('image.*')) {
        throw new Error('Please select an image file (JPEG, PNG)');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image is too large. Please select an image smaller than 10MB');
      }

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Convert to base64 for API submission
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        if (onImageUploaded) {
          onImageUploaded(base64);
        }
        setLoading(false);
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process image');
      setLoading(false);
      toast.error(err.message || 'Failed to process image');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        <div className="w-full md:w-3/5">
          {!previewUrl ? (
            <div 
              className={`border-2 border-dashed ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'} 
                rounded-lg p-6 flex flex-col items-center justify-center h-72 transition-colors`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Drag & drop</span> your clothing item image here
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                PNG or JPEG (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={BUTTON_VARIANTS.secondary}
              >
                Choose Image
              </button>
            </div>
          ) : (
            <div className={CARD_STYLES.container}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={CARD_STYLES.title}>Clothing Item Preview</h3>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded p-2 flex justify-center">
                <img 
                  src={previewUrl} 
                  alt="Clothing item preview" 
                  className="max-h-80 max-w-full h-auto rounded object-contain"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-2/5 space-y-4">
          <div className={CARD_STYLES.container}>
            <h3 className={CARD_STYLES.title}>Tips for best results</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Use high-quality product photos</li>
              <li>Ensure the clothing item is clearly visible</li>
              <li>Photos with plain backgrounds work best</li>
              <li>For best results, use photos where the item is displayed flat or on a mannequin</li>
            </ul>
          </div>
          
          {previewUrl && !loading && (
            <div className="flex">
              <button
                onClick={handleCancel}
                className={`${BUTTON_VARIANTS.secondary} mr-3`}
              >
                Choose Different Image
              </button>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <InfoBox type="error" title="Error">
          {error}
        </InfoBox>
      )}
      
      {loading && (
        <div className="w-full flex justify-center items-center py-8">
          <LoadingSpinner size="lg" color="text-primary-600" />
          <span className="ml-3 text-gray-700 dark:text-gray-300">Processing image...</span>
        </div>
      )}
    </div>
  );
}

ImageUploader.propTypes = {
  onImageUploaded: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  onActivate: PropTypes.func
};

export default ImageUploader;