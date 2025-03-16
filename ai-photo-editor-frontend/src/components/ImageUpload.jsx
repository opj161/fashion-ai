import { useState } from 'react';
import toast from 'react-hot-toast';

function ImageUpload({ onImageUploaded }) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file.');
      return;
    }

    setLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      onImageUploaded(base64String);
      setLoading(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file.');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-full max-w-lg h-64 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
                   transition-colors duration-200 ${
                     isDragging 
                       ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                       : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                   }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-12 h-12 mb-4 ${isDragging ? 'text-primary-500' : 'text-gray-400'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        
        <p className="text-lg text-center mb-1 text-gray-700 dark:text-gray-300">
          {isDragging ? 'Drop to upload' : 'Drag and drop your clothing image here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
          or click to select a file
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Supported formats: JPG, PNG (max 10MB)
        </p>
      </div>
      
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        onChange={handleFileChange}
        accept="image/*"
      />
      
      {loading && (
        <div className="mt-4">
          <div className="animate-pulse flex space-x-4 items-center">
            <div className="h-3 w-3 bg-primary-500 rounded-full"></div>
            <div className="h-3 w-3 bg-primary-500 rounded-full animation-delay-200"></div>
            <div className="h-3 w-3 bg-primary-500 rounded-full animation-delay-400"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Processing image...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;