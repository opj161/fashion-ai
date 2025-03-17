import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * A component for inputting and managing tags
 * @param {Array} tags - Array of existing tag strings
 * @param {Function} onChange - Callback when tags change
 * @param {String} placeholder - Placeholder text for input
 */
function TagInput({ tags = [], onChange, placeholder = 'Add a tag...' }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Handle container click to focus the input
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Add a new tag - using useCallback to avoid dependency issues in useEffect
  const addTag = useCallback((text) => {
    const tagText = text.trim().replace(/,/g, '');
    if (!tagText) return;
    
    // Don't add duplicates
    if (tags.includes(tagText)) {
      setInputValue('');
      return;
    }
    
    const newTags = [...tags, tagText];
    onChange(newTags);
    setInputValue('');
  }, [tags, onChange]);

  // Remove a tag by index
  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  // Handle key down events
  const handleKeyDown = (e) => {
    // Enter or comma to add a tag
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    
    // Backspace to remove the last tag when input is empty
    else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // Handle blur event to add any pending tag
  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  // Handle click outside the container to add pending tag
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (inputValue.trim()) {
          addTag(inputValue);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue, addTag]);

  return (
    <div
      ref={containerRef} 
      onClick={focusInput}
      className="flex flex-wrap gap-2 p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[42px] cursor-text"
    >
      {/* Render existing tags */}
      {tags.map((tag, index) => (
        <div 
          key={index} 
          className="flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-0.5 rounded-full text-sm"
        >
          <span className="mr-1">{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
      
      {/* Input for new tags */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-grow min-w-[120px] bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400"
      />
    </div>
  );
}

TagInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default TagInput;