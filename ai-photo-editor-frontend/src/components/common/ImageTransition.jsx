import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Component for smooth transitions between image states
 * @param {string} image - Base64 encoded image data
 * @param {boolean} isLoading - Whether the image is loading
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional classes for the container
 * @param {node} fallback - Content to show when no image is available
 */
function ImageTransition({ 
  image, 
  isLoading, 
  alt = "Image",
  className = "",
  fallback = null 
}) {
  const defaultFallback = (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <p>No image available</p>
    </div>
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 10 }}
          >
            <div className="text-center bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 p-6 rounded-lg shadow-lg">
              <LoadingSpinner size="lg" color="text-primary-600" />
              <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                Processing image...
              </p>
            </div>
          </motion.div>
        ) : image ? (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            {fallback || defaultFallback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

ImageTransition.propTypes = {
  image: PropTypes.string,
  isLoading: PropTypes.bool,
  alt: PropTypes.string,
  className: PropTypes.string,
  fallback: PropTypes.node
};

export default ImageTransition;
