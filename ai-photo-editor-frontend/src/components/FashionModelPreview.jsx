import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FashionModelPreview({ clothingImage, onImageGenerated }) {
  const [loading, setLoading] = useState(false);
  const [previewScaling, setPreviewScaling] = useState('fit');
  
  // Simple state for essential settings only
  const [style, setStyle] = useState('casual');
  const [gender, setGender] = useState('female');
  const [background, setBackground] = useState('white');
  
  // Style options with visual choices
  const styleOptions = [
    {
      id: 'casual',
      name: 'Casual',
      description: 'Everyday relaxed look',
      icon: '👚'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Formal, business style',
      icon: '👔'
    },
    {
      id: 'editorial',
      name: 'Fashion Forward',
      description: 'Trendy magazine style',
      icon: '✨'
    },
    {
      id: 'ecommerce',
      name: 'Shop Ready',
      description: 'Clean, product-focused',
      icon: '🛍️'
    }
  ];

  // Build a simple, effective prompt applicable to all clothing types
  const buildSimplePrompt = () => {
    const styleName = styleOptions.find(s => s.id === style)?.name || style;
    const styleDescriptor = (() => {
      switch (style) {
        case 'casual':
          return 'Capture a relaxed, natural look using soft, natural lighting.';
        case 'professional':
          return 'Use clean, polished lighting to evoke a business-like feel.';
        case 'editorial':
          return 'Incorporate dramatic lighting for a high-fashion, stylized image.';
        case 'ecommerce':
          return 'Provide even, clear lighting to highlight product details.';
        default:
          return '';
      }
    })();
  
    return `CREATE A PHOTOREALISTIC IMAGE of a ${gender} fashion model wearing this clothing item.

Style: ${styleName} fashion photography
Background: ${background} background

${styleDescriptor}

The image should emphasize the garment in a clear, visually appealing manner with professional lighting and a natural, flattering pose.`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = buildSimplePrompt();
      const data = await api.editImage(prompt, clothingImage);
      
      if (data.imageData) {
        onImageGenerated(data.imageData, {
          prompt,
          style,
          gender,
          background
        });
        toast.success('Fashion image generated successfully!');
      } else {
        toast.error('Failed to generate fashion image');
      }
    } catch (error) {
      console.error('Error generating fashion image:', error);
      toast.error(error.error || 'Failed to generate fashion image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: uploaded clothing image */}
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-center text-gray-900 dark:text-gray-100">Your Clothing Item</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setPreviewScaling('fit')}
                    className={`p-1 rounded ${previewScaling === 'fit' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                    title="Fit to container"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setPreviewScaling('actual')}
                    className={`p-1 rounded ${previewScaling === 'actual' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                    title="Actual size"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded p-2 flex justify-center">
                <img 
                  src={`data:image/jpeg;base64,${clothingImage}`} 
                  alt="Clothing item" 
                  className={`${previewScaling === 'fit' ? 'max-w-full h-auto' : 'w-auto h-auto'} max-h-80 rounded`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: style selection and basic settings */}
        <div className="md:col-span-2">
          <div className="space-y-6">
            {/* Style selection */}
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
              <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Choose a Style</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {styleOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => setStyle(option.id)}
                    className={`cursor-pointer rounded-lg border transition-all ${
                      style === option.id 
                        ? 'border-primary-500 ring-2 ring-primary-500/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="p-3">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mb-3">
                        <div className="text-4xl">{option.icon}</div>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{option.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Basic Settings */}
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
              <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Basic Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-2 px-4 rounded-md border ${gender === 'female'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
                    >
                      Female
                    </button>
                    <button
                      onClick={() => setGender('male')}
                      className={`flex-1 py-2 px-4 rounded-md border ${gender === 'male'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
                    >
                      Male
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                  >
                    <option value="white">White</option>
                    <option value="light gray">Light Gray</option>
                    <option value="neutral">Neutral</option>
                    <option value="contextual">Contextual</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Generate button */}
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="py-2 px-6 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'Generate Fashion Model Image'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FashionModelPreview;