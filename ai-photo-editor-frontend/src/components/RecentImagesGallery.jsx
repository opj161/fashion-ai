import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { CARD_STYLES } from '../styles/constants';

function RecentImagesGallery({ onImageSelected }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const imagesPerPage = 12;

  const fetchImages = useCallback(async (pageNum, tag = selectedTag) => {
    try {
      setLoading(true);
      const response = await api.listImages(imagesPerPage, pageNum * imagesPerPage, tag || null);
      if (response.images.length < imagesPerPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setImages(prev => pageNum === 0 ? response.images : [...prev, ...response.images]);
      
      // Build a list of unique tags from all images
      if (pageNum === 0) {
        const tagSet = new Set();
        response.images.forEach(image => {
          if (image.metadata && image.metadata.tags) {
            image.metadata.tags.forEach(tag => tagSet.add(tag));
          }
        });
        setAvailableTags(Array.from(tagSet).sort());
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load recent images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedTag, imagesPerPage]);

  useEffect(() => {
    fetchImages(0);
  }, [fetchImages]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchImages(page + 1);
    }
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    setPage(0); // Reset to first page
    fetchImages(0, tag);
  };

  const handleClearFilters = () => {
    setSelectedTag('');
    setPage(0);
    fetchImages(0, '');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className={CARD_STYLES.title}>Recent Generations</h3>
        
        {/* Filter controls */}
        <div className="flex items-center space-x-2">
          <select 
            className="border dark:border-gray-700 rounded p-1.5 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <option value="">All Images</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          {selectedTag && (
            <button 
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {loading && page === 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      {!loading && images.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {selectedTag 
              ? `No images found with the tag "${selectedTag}"` 
              : "No images found. Generate some fashion models to see them here!"}
          </p>
        </div>
      )}
      
      {/* Responsive grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image) => (
          <div 
            key={image.id}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onImageSelected(image)}
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-900 overflow-hidden">
              <img 
                src={`data:image/jpeg;base64,${image.imageData}`}
                alt="Generated fashion model" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-2">
              <div className="flex flex-wrap gap-1 mb-1">
                {image.metadata?.tags?.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 dark:bg-gray-700 text-xs px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
                {image.metadata?.tags?.length > 3 && (
                  <span className="text-xs text-gray-500">+{image.metadata.tags.length - 3}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {new Date(image.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading placeholders */}
        {loading && page > 0 && Array(4).fill(0).map((_, i) => (
          <div 
            key={`loading-${i}`} 
            className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 animate-pulse"
          >
            <div className="aspect-square"></div>
          </div>
        ))}
      </div>
      
      {/* Load more button */}
      {hasMore && images.length > 0 && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

RecentImagesGallery.propTypes = {
  onImageSelected: PropTypes.func.isRequired
};

export default RecentImagesGallery;