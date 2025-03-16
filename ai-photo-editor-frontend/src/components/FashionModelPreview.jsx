import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FashionModelPreview({ clothingImage, onImageGenerated, isActive }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customAttributes, setCustomAttributes] = useState({
    gender: 'female',
    bodyType: 'average',  // New attribute
    ethnicity: 'caucasian',  // New attribute
    age: '25-35',  // New attribute
    style: 'studio',
    angle: 'front',
    background: 'white',
  });
  const [loading, setLoading] = useState(false);
  const [previewScaling, setPreviewScaling] = useState('fit');
  const [productType, setProductType] = useState('top'); // New attribute for clothing type

  const templates = [
    {
      id: 'studio-front',
      name: 'Studio Front View',
      description: 'Professional front-facing studio shot',
      image: '👔',
      prompt: (attributes) => {
        const { gender, bodyType, ethnicity, age } = attributes;
        return `A professional ${ethnicity} ${gender} model with ${bodyType} body type, ${age} years old, wearing this clothing item, standing in a clean studio setting with neutral lighting, front view, full body shot, ${gender === 'female' ? 'she is' : 'he is'} posing confidently.`;
      }
    },
    {
      id: 'studio-angled',
      name: 'Studio Angled View',
      description: 'Professional studio photo with slight angle',
      image: '👗',
      prompt: (attributes) => {
        const { gender, bodyType, ethnicity, age } = attributes;
        return `A professional ${ethnicity} ${gender} model with ${bodyType} body type, ${age} years old, wearing this clothing item, standing in a clean studio setting with dramatic lighting, 3/4 angle view, full body shot, ${gender === 'female' ? 'she is' : 'he is'} posing with one hand on hip.`;
      }
    },
    {
      id: 'outdoor-casual',
      name: 'Outdoor Casual',
      description: 'Casual outdoor setting with natural lighting',
      image: '👚',
      prompt: (attributes) => {
        const { gender, bodyType, ethnicity, age } = attributes;
        return `A ${ethnicity} ${gender} model with ${bodyType} body type, ${age} years old, wearing this clothing item in an outdoor setting with natural lighting, casual pose, urban background, street style photography, lifestyle fashion shoot.`;
      }
    },
    {
      id: 'urban-street',
      name: 'Urban Street Style',
      description: 'Urban environment with street style aesthetic',
      image: '🧥',
      prompt: (attributes) => {
        const { gender, bodyType, ethnicity, age } = attributes;
        return `A ${ethnicity} ${gender} model with ${bodyType} body type, ${age} years old, wearing this clothing item on a city street, urban environment, editorial style photography, candid pose, street fashion, with blurred city background.`;
      }
    },
    {
      id: 'high-fashion',
      name: 'High Fashion Editorial',
      description: 'Editorial high-fashion photography style',
      image: '👘',
      prompt: (attributes) => {
        const { gender, bodyType, ethnicity, age } = attributes;
        return `A ${ethnicity} ${gender} high fashion model with ${bodyType} body type, ${age} years old, wearing this clothing item, editorial style photography, dramatic lighting, artistic composition, magazine quality, luxury fashion shoot, professional fashion photography.`;
      }
    },
    // New template
    {
      id: 'e-commerce',
      name: 'E-Commerce Product',
      description: 'Clean, professional e-commerce style',
      image: '🛍️',
      prompt: (attributes) => {
        const { gender, bodyType, ethnicity, age, productType } = attributes;
        return `A ${ethnicity} ${gender} model with ${bodyType} body type, ${age} years old, wearing this ${productType}, perfect for online store product display, neutral expression, clean composition, professional e-commerce catalog photo, showing fit and drape of the garment clearly.`;
      }
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

  // Enhance the handleGenerate function for better product-specific prompts
  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    setLoading(true);
    try {
      // Build product-specific details for better prompts
      const productDetails = getProductSpecificDetails(productType);
      
      // Build the prompt with enhanced attributes
      const basePrompt = selectedTemplate.prompt(customAttributes);
      const fullPrompt = `Generate a realistic full-body fashion photography image: ${basePrompt}. 
      Background: ${customAttributes.background} background. 
      View: ${customAttributes.angle} view.
      Style: ${customAttributes.style} style.
      Product type: ${productType}.
      ${productDetails}
      The clothing item is the main focus of the image. Make it look like a professional fashion catalog photo.`;
      
      // Use the edit-image endpoint since we're providing a source image
      const data = await api.editImage(fullPrompt, clothingImage);
      if (data.imageData) {
        onImageGenerated(data.imageData, {
          prompt: fullPrompt,
          template: selectedTemplate.id,
          customAttributes: {...customAttributes, productType}
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

  // Add product-specific prompt helper
  const getProductSpecificDetails = (productType) => {
    switch(productType) {
      case 'top':
        return 'Ensure the top fits naturally on the model with appropriate draping and wrinkles. Show how the fabric falls on the torso.';
      case 'dress':
        return 'The dress should flow elegantly with natural movement, showing the proper length and fit at the waist.';
      case 'pants':
        return 'Show how the pants fit at the waist and how they fall to the appropriate length. Ensure proper draping on the legs.';
      case 'jacket':
        return 'The jacket should show proper shoulder fit and sleeve length, with attention to how it layers over other clothing.';
      case 'sweater':
        return 'Show the texture and thickness of the sweater, with natural folds and draping on the model\'s body.';
      default:
        return 'Ensure the clothing item fits correctly on the model, with natural draping and proper proportions.';
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
              
              {/* New: Product Type selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Type</label>
                <select 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                           text-gray-900 dark:text-gray-100"
                >
                  <option value="top">Top / Shirt / Blouse</option>
                  <option value="dress">Dress</option>
                  <option value="pants">Pants / Trousers</option>
                  <option value="skirt">Skirt</option>
                  <option value="jacket">Jacket / Coat</option>
                  <option value="sweater">Sweater / Hoodie</option>
                  <option value="swimwear">Swimwear</option>
                  <option value="formal wear">Formal Wear</option>
                </select>
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
                
                {/* New: Ethnicity Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Ethnicity</label>
                  <select 
                    value={customAttributes.ethnicity}
                    onChange={(e) => handleAttributeChange('ethnicity', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="caucasian">Caucasian</option>
                    <option value="black">Black</option>
                    <option value="asian">Asian</option>
                    <option value="hispanic">Hispanic</option>
                    <option value="middle eastern">Middle Eastern</option>
                  </select>
                </div>
                
                {/* New: Body Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body Type</label>
                  <select 
                    value={customAttributes.bodyType}
                    onChange={(e) => handleAttributeChange('bodyType', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="slim">Slim</option>
                    <option value="average">Average</option>
                    <option value="athletic">Athletic</option>
                    <option value="plus-size">Plus Size</option>
                  </select>
                </div>
                
                {/* New: Age Range Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Range</label>
                  <select 
                    value={customAttributes.age}
                    onChange={(e) => handleAttributeChange('age', e.target.value)}
                    className="w-full border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100"
                  >
                    <option value="18-25">18-25</option>
                    <option value="25-35">25-35</option>
                    <option value="35-45">35-45</option>
                    <option value="45+">45+</option>
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