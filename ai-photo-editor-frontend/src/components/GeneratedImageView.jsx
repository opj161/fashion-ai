import { useState } from 'react';
import toast from 'react-hot-toast';

function GeneratedImageView({ image, metadata }) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    try {
      // Create temporary link element
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${image}`;
      link.download = `fashion-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        {/* Large image display */}
        <div className="w-full max-w-3xl mb-6">
          <img 
            src={`data:image/jpeg;base64,${image}`} 
            alt="Generated fashion model" 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        
        {/* Prompt information */}
        <div className="w-full max-w-3xl bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 transition-colors duration-300">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Image Generation Prompt</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
            {metadata?.prompt || "No prompt information available"}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="py-2 px-6 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 
                      text-white rounded-lg flex items-center justify-center transition-colors duration-200
                      disabled:bg-green-400 dark:disabled:bg-green-800"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
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
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(metadata?.prompt || "")
                .then(() => toast.success('Prompt copied to clipboard!'))
                .catch(() => toast.error('Failed to copy prompt'));
            }}
            className="py-2 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                      text-gray-800 dark:text-gray-200 rounded-lg flex items-center justify-center
                      transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Prompt
          </button>
        </div>
        
        {/* Template info */}
        {metadata?.template && (
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Template: {metadata.template}
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratedImageView;