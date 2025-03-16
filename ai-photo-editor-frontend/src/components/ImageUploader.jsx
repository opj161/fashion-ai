import { useState, useRef, useEffect } from 'react'; // Add useEffect
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

function ImageUploader({ onImageUploaded, isActive, onActivate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Auto-upload when a file is selected
  useEffect(() => {
    if (selectedFile && !loading) {
      handleUpload();
    }
  }, [selectedFile]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    
    if (onActivate) {
      onActivate();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
  
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
  
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      if (onActivate) {
        onActivate();
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64
      const base64 = await convertFileToBase64(selectedFile);
      
      // Extract just the base64 data (remove the data:image/jpeg;base64, part)
      const base64Data = base64.split(',')[1];
      
      // Directly use the base64 data with the editor
      onImageUploaded(base64Data);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onActivate) {
      onActivate();
    }
  };

  return (
    <div className="space-y-6" onClick={isActive ? null : onActivate}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-3/5">
          <div 
            className={`w-full h-64 border-2 border-dashed 
                      ${dragActive ? 'border-primary-500 dark:border-primary-400' : 'border-gray-300 dark:border-gray-600'} 
                      rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer
                      ${!previewUrl ? 'hover:bg-gray-50 dark:hover:bg-gray-800/60' : ''} 
                      hover:border-primary-400 dark:hover:border-primary-500
                      transition-all duration-200 bg-white dark:bg-gray-800/20`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!previewUrl ? (
              <>
                <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/30 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">Click to select an image</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or drag and drop</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">PNG, JPG, WEBP up to 5MB</p>
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-900 p-2 rounded w-full h-full flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                {loading && (
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                      <LoadingSpinner />
                    </div>
                  </div>
                )}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/5 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h3 className="font-medium text-lg mb-2 text-gray-800 dark:text-gray-100">Tips for best results</h3>
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
                onClick={resetSelection}
                className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                          rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                          transition-colors duration-200 border border-transparent"
              >
                Choose Different Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;