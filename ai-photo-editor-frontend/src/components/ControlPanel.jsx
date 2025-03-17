import React from 'react';
import PropTypes from 'prop-types';
import { CARD_STYLES, BUTTON_VARIANTS } from '../styles/constants';
import LoadingSpinner from './LoadingSpinner';

function ControlPanel({
  currentImage,
  hasUploadedImage,
  imageUploader,
  imageGenerationControls,
  loading,
  onGenerate,
  onChangeImage
}) {
  return (
    <div className="control-panel space-y-6">
      {/* Image uploader or current image thumbnail */}
      {!hasUploadedImage ? (
        <div className={CARD_STYLES.container}>
          <h3 className={CARD_STYLES.title}>Upload Clothing Item</h3>
          {imageUploader}
        </div>
      ) : (
        <>
          <div className={CARD_STYLES.container}>
            <h3 className={CARD_STYLES.title}>Input Image</h3>
            <div className="flex justify-between items-center mb-2">
              <div className="flex-1">
                <img 
                  src={`data:image/jpeg;base64,${currentImage}`}
                  alt="Clothing item" 
                  className="max-h-48 max-w-full object-contain rounded"
                />
              </div>
              <button 
                onClick={onChangeImage}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Change Image
              </button>
            </div>
          </div>
          
          {/* Generation controls - tabs and options */}
          <div className={CARD_STYLES.container}>
            <h3 className={CARD_STYLES.title}>Model Settings</h3>
            <div className="generation-controls">
              {imageGenerationControls}
            </div>
          </div>
          
          {/* Generate button */}
          <button
            onClick={onGenerate}
            disabled={loading}
            className={`${BUTTON_VARIANTS.primary} w-full py-3 flex items-center justify-center transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Generating...</span>
              </>
            ) : 'Generate Fashion Model'}
          </button>
        </>
      )}
    </div>
  );
}

ControlPanel.propTypes = {
  currentImage: PropTypes.string,
  hasUploadedImage: PropTypes.bool,
  imageUploader: PropTypes.node,
  imageGenerationControls: PropTypes.node,
  loading: PropTypes.bool,
  onGenerate: PropTypes.func,
  onChangeImage: PropTypes.func
};

export default ControlPanel;
