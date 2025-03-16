import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FashionModelPreview({ clothingImage, onImageGenerated, isActive }) {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewScaling, setPreviewScaling] = useState('fit');
  const [customAttributes, setCustomAttributes] = useState({
    gender: 'female',
    ethnicity: 'diverse',
    bodyType: 'average',
    age: 'young-adult',
    style: 'studio',
    background: 'white',
    angle: 'front'
  });
  const [productType, setProductType] = useState('top');

  // Available templates
  const templates = [
    {
      id: 'casual',
      name: 'Casual Style',
      description: 'Relaxed, everyday fashion look',
      prompt: (attrs) => `A ${attrs.bodyType} ${attrs.ethnicity} ${attrs.gender} ${attrs.age} fashion model wearing the clothing item. The model has a natural, relaxed pose.`
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Business and formal attire',
      prompt: (attrs) => `A ${attrs.bodyType} ${attrs.ethnicity} ${attrs.gender} ${attrs.age} fashion model wearing the clothing item in a professional setting. The model has a confident, poised stance.`
    },
    {
      id: 'editorial',
      name: 'Editorial',
      description: 'High fashion magazine style',
      prompt: (attrs) => `A ${attrs.bodyType} ${attrs.ethnicity} ${attrs.gender} ${attrs.age} high fashion model wearing the clothing item in an editorial style. The model has a dramatic, stylized pose.`
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Clear product display for online stores',
      prompt: (attrs) => `A ${attrs.bodyType} ${attrs.ethnicity} ${attrs.gender} ${attrs.age} fashion model wearing the clothing item against a clean background. The model has a simple, clear stance that shows the product details.`
    }
  ];

  // Photography technical details for different styles
  const photographyDetails = {
    'studio': 'Shot with a 85mm lens at f/5.6 with professional studio three-point lighting setup, soft key light, fill light, and rim light to highlight the fabric texture and color accurately',
    'editorial': 'Shot with a 50mm lens at f/2.8, dramatic side lighting with strong shadows and highlights to create visual interest and emphasize the clothing silhouette',
    'casual': 'Shot with a 35mm lens at f/4, natural window lighting with subtle fill, creating a relaxed and authentic mood that highlights the everyday wearability',
    'outdoor': 'Shot with a 70-200mm lens at f/4, golden hour natural lighting with soft diffused light and natural shadows',
    'white': 'Shot with a 105mm lens at f/8, even lighting with minimal shadows for clear product visibility, standard e-commerce lighting with soft boxes and diffusers'
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleAttributeChange = (attribute, value) => {
    setCustomAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  // Get model pose based on product type and gender
  const getModelPose = (productType, gender) => {
    const isFemale = gender === 'female';
    
    switch(productType) {
      case 'top':
        return isFemale 
          ? 'Model stands with shoulders squared to camera, one hand slightly on hip, confident posture to show how the top fits across the shoulders and torso'
          : 'Model stands with shoulders slightly angled, relaxed confident stance to show how the top drapes on the body';
      case 'dress':
        return 'Model stands with one foot slightly forward, natural elegant pose with a slight turn to show the silhouette and flow of the dress';
      case 'pants':
        return 'Model stands with weight on one leg, other leg slightly bent at 45 degrees angle to show the fit and cut of the pants from hip to hem';
      case 'jacket':
        return `Model stands in a three-quarter turn position, showing how the jacket fits at shoulders and waist, ${isFemale ? 'one hand in pocket or at side' : 'hands relaxed at sides'}`;
      case 'sweater':
        return `Model in relaxed stance with ${isFemale ? 'arms slightly away from body' : 'arms at sides'} to show the texture and drape of the sweater fabric`;
      case 'skirt':
        return 'Model stands with feet hip-width apart, slight turn to show the waistline and hem of the skirt';
      case 'suit':
        return 'Model stands with professional stance, shoulders back, one button fastened to show the proper fit of the suit';
      default:
        return 'Model stands in a natural, relaxed pose that best showcases the garment fit and details';
    }
  };

  // Get product-specific details for better prompts
  const getProductSpecificDetails = (productType) => {
    switch(productType) {
      case 'top':
        return 'Ensure the top fits naturally on the model with appropriate draping and wrinkles. Show how the fabric falls on the torso. Capture any detailing such as buttons, collars, or seams.';
      case 'dress':
        return 'The dress should flow elegantly with natural movement, showing the proper length and fit at the waist. Capture the way the fabric drapes and moves around the body.';
      case 'pants':
        return 'Show how the pants fit at the waist and how they fall to the appropriate length. Ensure proper draping on the legs, showcasing the cut and silhouette from hip to ankle.';
      case 'jacket':
        return 'The jacket should show proper shoulder fit and sleeve length, with attention to how it layers over other clothing. Capture details like lapels, pockets, and closures clearly.';
      case 'sweater':
        return 'Show the texture and thickness of the sweater, with natural folds and draping on the model\'s body. Highlight the neckline, cuff details, and overall fit.';
      case 'skirt':
        return 'The skirt should sit properly at the waist or hips, showing the full silhouette and movement of the fabric. Capture the hemline and any pleating or design details.';
      case 'suit':
        return 'The suit should appear properly tailored with clean lines. Show how the jacket and pants/skirt work together as a complete look. Capture details like lapels, buttons, and the fit at shoulders and waist.';
      default:
        return 'Ensure the clothing item fits correctly on the model, with natural draping and proper proportions. Showcase the key selling points of the garment design.';
    }
  };

  // Get feature highlights for each product type
  const getFeatureHighlights = (productType) => {
    switch(productType) {
      case 'top':
        return 'Show how the neckline sits, the fit across shoulders and chest, sleeve length, and the hem detail. Highlight any special fabric textures or patterns.';
      case 'dress':
        return 'Highlight the silhouette, waistline definition, length, and how the fabric moves with the body. Show any distinctive design elements or embellishments.';
      case 'pants':
        return 'Focus on the waistband fit, hip-to-leg transition, leg shape (slim, straight, wide), and length. Show how the fabric drapes from waist to ankle.';
      case 'jacket':
        return 'Emphasize shoulder fit, sleeve length, lapel style, closure details, and overall silhouette. Show how it sits across the back and chest.';
      case 'sweater':
        return 'Highlight the knit texture, collar or neckline style, cuff details, and overall drape. Show how it fits at the shoulders and around the torso.';
      case 'skirt':
        return 'Focus on the waistband fit, hip contour, movement of the fabric, and hem details. Show the overall shape and silhouette.';
      case 'suit':
        return 'Emphasize how the pieces work together, the tailoring at key points (shoulders, waist, hips), and the overall professional appearance. Show both front and slight angle views.';
      default:
        return 'Focus on the most distinctive design elements, fit at key body points, and fabric quality. Show the garment in a way that highlights its intended style and purpose.';
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    setLoading(true);
    try {
      // Build enhanced product-specific details
      const productDetails = getProductSpecificDetails(productType);
      const posing = getModelPose(productType, customAttributes.gender);
      const features = getFeatureHighlights(productType);
      const photoTech = photographyDetails[customAttributes.style] || photographyDetails['studio'];
      
      // Build the enhanced prompt
      const basePrompt = selectedTemplate.prompt(customAttributes);
      const fullPrompt = `CREATE A HIGH-RESOLUTION PHOTOREALISTIC IMAGE of a fashion model wearing this clothing item: ${basePrompt}

Technical specifications:
- Photography: ${photoTech}
- Background: ${customAttributes.background} background
- View angle: ${customAttributes.angle} view
- Style: ${customAttributes.style} fashion photography style
- Product category: ${productType}
- Pose: ${posing}

Product details:
${productDetails}
${features}

The clothing item must be the main focus of the image, with accurate color reproduction, fabric texture, and fit. Render the image with ultra-high detail, professional color grading, and commercial photography quality. The final result should look indistinguishable from a professional fashion photoshoot for a major retail brand website or catalog.`;
      
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
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Type
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="top">Top/Shirt/Blouse</option>
                  <option value="dress">Dress</option>
                  <option value="pants">Pants/Trousers</option>
                  <option value="jacket">Jacket/Coat</option>
                  <option value="sweater">Sweater/Knitwear</option>
                  <option value="skirt">Skirt</option>
                  <option value="suit">Suit/Formal Wear</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: template selection and customization */}
        <div className="md:col-span-2">
          <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 mb-6 transition-colors duration-200">
            <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Select a Template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(template => (
                <div key={template.id} 
                  className={`border rounded-lg p-3 cursor-pointer transition-colors duration-200 ${
                    selectedTemplate?.id === template.id 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h4 className={`font-medium ${
                    selectedTemplate?.id === template.id 
                      ? 'text-primary-700 dark:text-primary-400' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>{template.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 mb-6 transition-colors duration-200">
            <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Customize Model</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  value={customAttributes.gender}
                  onChange={(e) => handleAttributeChange('gender', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ethnicity
                </label>
                <select
                  value={customAttributes.ethnicity}
                  onChange={(e) => handleAttributeChange('ethnicity', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="diverse">Diverse/Mixed</option>
                  <option value="caucasian">Caucasian</option>
                  <option value="black">Black/African</option>
                  <option value="asian">Asian</option>
                  <option value="hispanic">Hispanic/Latino</option>
                  <option value="middle-eastern">Middle Eastern</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Body Type
                </label>
                <select
                  value={customAttributes.bodyType}
                  onChange={(e) => handleAttributeChange('bodyType', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="average">Average</option>
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic/Fit</option>
                  <option value="curvy">Curvy/Plus-Size</option>
                  <option value="petite">Petite</option>
                  <option value="tall">Tall</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age Range
                </label>
                <select
                  value={customAttributes.age}
                  onChange={(e) => handleAttributeChange('age', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="young-adult">Young Adult (18-30)</option>
                  <option value="adult">Adult (30-45)</option>
                  <option value="mature">Mature (45-60)</option>
                  <option value="senior">Senior (60+)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Photography Style
                </label>
                <select
                  value={customAttributes.style}
                  onChange={(e) => handleAttributeChange('style', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="studio">Studio</option>
                  <option value="editorial">Editorial</option>
                  <option value="casual">Casual</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="white">White Background (E-commerce)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Background
                </label>
                <select
                  value={customAttributes.background}
                  onChange={(e) => handleAttributeChange('background', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="white">White</option>
                  <option value="light gray">Light Gray</option>
                  <option value="gradient">Gradient</option>
                  <option value="neutral">Neutral</option>
                  <option value="contextual">Contextual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Angle
                </label>
                <select
                  value={customAttributes.angle}
                  onChange={(e) => handleAttributeChange('angle', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="front">Front</option>
                  <option value="three-quarter">Three-Quarter</option>
                  <option value="side">Side</option>
                  <option value="back">Back</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!selectedTemplate || loading}
              className="py-2 px-6 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Generate Fashion Model Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FashionModelPreview;