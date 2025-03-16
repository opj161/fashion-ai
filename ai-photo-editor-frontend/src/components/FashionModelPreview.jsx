import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FashionModelPreview({ clothingImage, onImageGenerated, isActive }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customAttributes, setCustomAttributes] = useState({
    gender: 'female',
    style: 'studio',
    angle: 'front',
    background: 'white',
  });
  const [loading, setLoading] = useState(false);
  const [previewScaling, setPreviewScaling] = useState('fit');

  const templates = [
    {
      id: 'studio-front',
      name: 'Studio Front View',
      description: 'Professional front-facing studio shot',
      image: '👔',
      prompt: gender => `A professional ${gender} model wearing this clothing item, standing in a clean studio setting with neutral lighting, front view, full body shot, ${gender === 'female' ? 'she is' : 'he is'} posing confidently.`
    },
    {
      id: 'studio-angled',
      name: 'Studio Angled View',
      description: 'Professional studio photo with slight angle',
      image: '👗',
      prompt: gender => `A professional ${gender} model wearing this clothing item, standing in a clean studio setting with dramatic lighting, 3/4 angle view, full body shot, ${gender === 'female' ? 'she is' : 'he is'} posing with one hand on hip.`
    },
    {
      id: 'outdoor-casual',
      name: 'Outdoor Casual',
      description: 'Casual outdoor setting with natural lighting',
      image: '👚',
      prompt: gender => `A ${gender} model wearing this clothing item in an outdoor setting with natural lighting, casual pose, urban background, street style photography, lifestyle fashion shoot.`
    },
    {
      id: 'urban-street',
      name: 'Urban Street Style',
      description: 'Urban environment with street style aesthetic',
      image: '🧥',
      prompt: gender => `A ${gender} model wearing this clothing item on a city street, urban environment, editorial style photography, candid pose, street fashion, with blurred city background.`
    },
    {
      id: 'high-fashion',
      name: 'High Fashion Editorial',
      description: 'Editorial high-fashion photography style',
      image: '👘',
      prompt: gender => `A ${gender} high fashion model wearing this clothing item, editorial style photography, dramatic lighting, artistic composition, magazine quality, luxury fashion shoot, professional fashion photography.`
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleAttributeChange = (attribute, value) => {
    setCustomAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    setLoading(true);
    try {
      // Build the prompt
      const basePrompt = selectedTemplate.prompt(customAttributes.gender);
      const fullPrompt = `Generate a realistic full-body fashion photography image: ${basePrompt}. 
      Background: ${customAttributes.background} background. 
      View: ${customAttributes.angle} view.
      Style: ${customAttributes.style} style.
      The clothing item is the main focus of the image. Make it look like a professional fashion catalog photo.`;
      
      // Use the edit-image endpoint since we're providing a source image
      const data = await api.editImage(fullPrompt, clothingImage);
      if (data.imageData) {
        onImageGenerated(data.imageData);
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
                    className={`p-1 rounded ${previewScaling === 'fit' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    title="Fit to container"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setPreviewScaling('original')}
                    className={`p-1 rounded ${previewScaling === 'original' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    title="Original size"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={`flex justify-center bg-white dark:bg-gray-900 rounded p-2 ${previewScaling === 'fit' ? 'max-h-64 overflow-hidden' : 'overflow-auto'}`}>
                <img 
                  src={`data:image/jpeg;base64,${clothingImage}`} 
                  alt="Uploaded clothing" 
                  className={`${previewScaling === 'fit' ? 'max-w-full h-auto max-h-64' : 'w-auto'} rounded`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: template selection & customization */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white">1. Choose a Template</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map(template => (
              <div 
                key={template.id}
                className={`border dark:border-gray-700 rounded-lg p-3 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                  selectedTemplate?.id === template.id 
                    ? 'border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30 shadow-md' 
                    : 'hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{template.image}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{template.name}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <>
              <h3 className="font-medium text-lg pt-4 text-gray-900 dark:text-white">2. Customize</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Gender</label>
                  <select 
                    value={customAttributes.gender}
                    onChange={(e) => handleAttributeChange('gender', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
                  <select 
                    value={customAttributes.background}
                    onChange={(e) => handleAttributeChange('background', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="white">White</option>
                    <option value="light gray">Light Gray</option>
                    <option value="studio gradient">Studio Gradient</option>
                    <option value="neutral tone">Neutral Tone</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photography Style</label>
                  <select 
                    value={customAttributes.style}
                    onChange={(e) => handleAttributeChange('style', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="studio">Professional Studio</option>
                    <option value="editorial">Editorial</option>
                    <option value="casual">Casual</option>
                    <option value="catalog">Catalog</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Camera Angle</label>
                  <select 
                    value={customAttributes.angle}
                    onChange={(e) => handleAttributeChange('angle', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="front">Front View</option>
                    <option value="three-quarter">Three-Quarter View</option>
                    <option value="side">Side View</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg 
                           hover:bg-primary-700 dark:hover:bg-primary-600 disabled:bg-primary-400
                           dark:disabled:bg-primary-800 shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : 'Generate Fashion Model Image'}
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  This might take 15-30 seconds depending on complexity
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FashionModelPreview;