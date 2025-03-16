import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import InfoBox from './common/InfoBox';
import { CARD_STYLES, BUTTON_VARIANTS } from '../styles/constants';

/**
 * Component for displaying a generated image with metadata and download options
 * @param {string} image - Base64 encoded image data
 * @param {Object} metadata - Information about how the image was generated
 */
function GeneratedImageView({ image, metadata }) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${image}`;
      link.download = `fashion-model-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image container */}
      <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
        <img 
          src={`data:image/jpeg;base64,${image}`} 
          alt="Generated fashion model" 
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
      
      {/* Prompt information */}
      <div className={CARD_STYLES.container}>
        <h3 className={CARD_STYLES.title}>Image Generation Prompt</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
          {metadata?.prompt || "No prompt information available"}
        </p>
      </div>
      
      {/* Settings used */}
      {metadata && Object.keys(metadata).length > 1 && (
        <div className={CARD_STYLES.container}>
          <h3 className={CARD_STYLES.title}>Settings Used</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {metadata.gender && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Gender:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.gender}</span>
              </div>
            )}
            {metadata.bodyType && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Body Type:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.bodyType}</span>
              </div>
            )}
            {metadata.bodySize && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Body Size:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.bodySize}</span>
              </div>
            )}
            {metadata.height && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Height:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.height}</span>
              </div>
            )}
            {metadata.age && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Age:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.age}</span>
              </div>
            )}
            {metadata.ethnicity && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Ethnicity:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.ethnicity}</span>
              </div>
            )}
            {metadata.background && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Background:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.background}</span>
              </div>
            )}
            {metadata.pose && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Pose:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{metadata.pose}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`${BUTTON_VARIANTS.primary} ${isDownloading ? 'opacity-75' : ''} flex items-center`}
        >
          {isDownloading ? (
            <>
              <LoadingSpinner size="sm" /> 
              <span className="ml-2">Downloading...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </>
          )}
        </button>
      </div>
      
      <InfoBox type="tip" title="Tip">
        If you're not satisfied with the result, you can go back and try different settings or edit this image further.
      </InfoBox>
    </div>
  );
}

GeneratedImageView.propTypes = {
  image: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    prompt: PropTypes.string,
    gender: PropTypes.string,
    bodyType: PropTypes.string,
    bodySize: PropTypes.string,
    height: PropTypes.string,
    age: PropTypes.string,
    ethnicity: PropTypes.string,
    background: PropTypes.string,
    pose: PropTypes.string,
    cameraAngle: PropTypes.string,
    lens: PropTypes.string,
    isCustomPrompt: PropTypes.bool
  })
};

GeneratedImageView.defaultProps = {
  metadata: {}
};

export default GeneratedImageView;