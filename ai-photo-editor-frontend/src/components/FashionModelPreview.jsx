import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FashionModelPreview({ clothingImage, onImageGenerated }) {
  const [loading, setLoading] = useState(false);
  const [previewScaling, setPreviewScaling] = useState('fit');
  
  // Enhanced model description options
  const [gender, setGender] = useState('female');
  const [bodyType, setBodyType] = useState('average');
  const [bodySize, setBodySize] = useState('medium');
  const [height, setHeight] = useState('average');
  const [age, setAge] = useState('young-adult');
  const [ethnicity, setEthnicity] = useState('diverse');
  
  // Enhanced setting options
  const [background, setBackground] = useState('studio-white');
  const [pose, setPose] = useState('natural');
  
  // Model attribute options
  const bodyTypeOptions = [
    { value: 'hourglass', label: 'Hourglass', description: 'Balanced top and bottom with defined waist' },
    { value: 'athletic', label: 'Athletic', description: 'Toned with broader shoulders' },
    { value: 'pear', label: 'Pear', description: 'Narrower shoulders, wider hips' },
    { value: 'apple', label: 'Apple', description: 'Fuller mid-section, slimmer legs' },
    { value: 'rectangular', label: 'Rectangular', description: 'Balanced with less defined waist' },
    { value: 'average', label: 'Balanced', description: 'Standard proportions' },
  ];
  
  const bodySizeOptions = [
    { value: 'petite', label: 'Petite', description: 'Smaller frame' },
    { value: 'slim', label: 'Slim', description: 'Lean build' },
    { value: 'medium', label: 'Medium', description: 'Average build' },
    { value: 'curvy', label: 'Curvy', description: 'Fuller figure' },
    { value: 'plus', label: 'Plus', description: 'Plus size' },
  ];
  
  const heightOptions = [
    { value: 'petite', label: 'Petite', description: 'Below average height' },
    { value: 'average', label: 'Average', description: 'Standard height' },
    { value: 'tall', label: 'Tall', description: 'Above average height' },
  ];
  
  const ageOptions = [
    { value: 'young-adult', label: 'Young Adult', description: '20s' },
    { value: 'adult', label: 'Adult', description: '30s-40s' },
    { value: 'mature', label: 'Mature', description: '50s-60s' },
    { value: 'senior', label: 'Senior', description: '65+' },
  ];
  
  const ethnicityOptions = [
    { value: 'diverse', label: 'Diverse', description: 'Unspecified/mixed' },
    { value: 'caucasian', label: 'Caucasian', description: 'Fair/light skin tones' },
    { value: 'black', label: 'Black', description: 'Dark skin tones' },
    { value: 'asian', label: 'Asian', description: 'East/South Asian features' },
    { value: 'hispanic', label: 'Hispanic/Latino', description: 'Latin American features' },
    { value: 'middle-eastern', label: 'Middle Eastern', description: 'Middle Eastern features' },
  ];
  
  const backgroundOptions = [
    { value: 'studio-white', label: 'Studio White', description: 'Clean professional backdrop' },
    { value: 'studio-gradient', label: 'Studio Gradient', description: 'Smooth color transition' },
    { value: 'in-store', label: 'In-store', description: 'Retail environment' },
    { value: 'lifestyle-home', label: 'Lifestyle - Home', description: 'Casual home setting' },
    { value: 'lifestyle-office', label: 'Lifestyle - Office', description: 'Professional workplace' },
    { value: 'outdoor-urban', label: 'Outdoor - Urban', description: 'City street setting' },
    { value: 'outdoor-nature', label: 'Outdoor - Nature', description: 'Natural environment' },
    { value: 'seasonal-spring', label: 'Seasonal - Spring', description: 'Spring atmosphere' },
    { value: 'seasonal-summer', label: 'Seasonal - Summer', description: 'Summer atmosphere' },
    { value: 'seasonal-fall', label: 'Seasonal - Fall', description: 'Fall/Autumn atmosphere' },
    { value: 'seasonal-winter', label: 'Seasonal - Winter', description: 'Winter atmosphere' },
  ];
  
  const poseOptions = [
    { value: 'natural', label: 'Natural', description: 'Relaxed, everyday stance' },
    { value: 'professional', label: 'Professional', description: 'Formal, business-like' },
    { value: 'editorial', label: 'Editorial', description: 'Fashion magazine style' },
    { value: 'active', label: 'Active', description: 'In motion, dynamic' },
  ];

  // Build enhanced descriptive prompt
  const buildEnhancedPrompt = () => {
    // Get selected option labels for more descriptive language
    const bodyTypeLabel = bodyTypeOptions.find(o => o.value === bodyType)?.label || 'balanced';
    const bodySizeLabel = bodySizeOptions.find(o => o.value === bodySize)?.label || 'medium';
    const heightLabel = heightOptions.find(o => o.value === height)?.label || 'average height';
    const ageLabel = ageOptions.find(o => o.value === age)?.label || 'adult';
    const ethnicityLabel = ethnicityOptions.find(o => o.value === ethnicity)?.label || 'diverse';
    const backgroundLabel = backgroundOptions.find(o => o.value === background)?.label || 'Studio White';
    const poseLabel = poseOptions.find(o => o.value === pose)?.label || 'natural';
    
    // Background description based on selection
    const getBackgroundDescription = () => {
      if (background.startsWith('studio')) {
        return `Clean, professional ${background === 'studio-gradient' ? 'gradient' : 'white'} studio background with subtle shadows`;
      } else if (background.startsWith('in-store')) {
        return 'Tasteful retail environment with appropriate fixtures and displays';
      } else if (background.startsWith('lifestyle')) {
        const setting = background.split('-')[1];
        return `Lifestyle ${setting} setting with tasteful, uncluttered ${setting === 'home' ? 'interior' : 'office'} design`;
      } else if (background.startsWith('outdoor')) {
        const setting = background.split('-')[1];
        return `Outdoor ${setting} setting with appropriate ${setting === 'urban' ? 'city architecture' : 'natural elements'}`;
      } else if (background.startsWith('seasonal')) {
        const season = background.split('-')[1];
        return `Seasonal ${season} atmosphere with characteristic lighting and environment`;
      }
      return 'Clean, well-lit background';
    };
    
    // Pose description
    const getPoseDescription = () => {
      switch (pose) {
        case 'natural': return 'standing in a relaxed, natural pose';
        case 'professional': return 'standing in a confident, professional stance';
        case 'editorial': return 'posed in a stylish, editorial fashion position';
        case 'active': return 'in a dynamic, engaging pose showing movement';
        default: return 'in a natural, flattering position';
      }
    };
    
    // Build comprehensive, descriptive prompt
    return `CREATE A PHOTOREALISTIC IMAGE of a ${bodySizeLabel}, ${heightLabel} ${ethnicityLabel} ${gender} fashion model with ${bodyTypeLabel} body proportions, in the ${ageLabel} age range, ${getPoseDescription()} and wearing this clothing item.

Background: ${getBackgroundDescription()}.

Photography details: Professional fashion photography with excellent composition, perfect lighting to highlight the garment's details, texture, and color. Crisp focus on the model and clothing with subtle depth of field.

The model should look authentic and relatable with a natural expression. The clothing must fit perfectly and be the main visual focus of the image, showcased from the most flattering angle with professional styling.`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = buildEnhancedPrompt();
      const data = await api.editImage(prompt, clothingImage);
      
      if (data.imageData) {
        onImageGenerated(data.imageData, {
          prompt,
          gender,
          bodyType,
          bodySize,
          height,
          age,
          ethnicity,
          background,
          pose
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

  // Helper component for attribute selectors with descriptions
  const AttributeSelect = ({ label, value, onChange, options, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} title={option.description}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {options.find(o => o.value === value)?.description}
      </p>
    </div>
  );

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
        
        {/* Right side: model customization options */}
        <div className="md:col-span-2">
          <div className="space-y-6">
            {/* Gender selection */}
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
              <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Model Gender</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'female' 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
                >
                  <div className="text-2xl mb-1">👩</div>
                  <div className="font-medium">Female</div>
                </button>
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'male' 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
                >
                  <div className="text-2xl mb-1">👨</div>
                  <div className="font-medium">Male</div>
                </button>
              </div>
            </div>

            {/* Model physical attributes */}
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
              <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Model Characteristics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AttributeSelect 
                  label="Body Size" 
                  value={bodySize} 
                  onChange={setBodySize} 
                  options={bodySizeOptions}
                />
                
                <AttributeSelect 
                  label="Height" 
                  value={height} 
                  onChange={setHeight} 
                  options={heightOptions}
                />
                
                <AttributeSelect 
                  label="Body Type" 
                  value={bodyType} 
                  onChange={setBodyType} 
                  options={bodyTypeOptions}
                />
                
                <AttributeSelect 
                  label="Age Range" 
                  value={age} 
                  onChange={setAge} 
                  options={ageOptions}
                />
                
                <AttributeSelect 
                  label="Ethnicity" 
                  value={ethnicity} 
                  onChange={setEthnicity} 
                  options={ethnicityOptions}
                />
              </div>
            </div>
            
            {/* Setting options */}
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
              <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Environment & Style</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AttributeSelect 
                  label="Background" 
                  value={background} 
                  onChange={setBackground} 
                  options={backgroundOptions}
                />
                
                <AttributeSelect 
                  label="Pose Style" 
                  value={pose} 
                  onChange={setPose} 
                  options={poseOptions}
                />
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