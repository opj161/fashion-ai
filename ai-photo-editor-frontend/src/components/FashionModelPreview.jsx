import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FashionModelPreview({ clothingImage, onImageGenerated }) {
  const [loading, setLoading] = useState(false);
  const [previewScaling, setPreviewScaling] = useState('fit');
  
  // Tab management
  const [activeTab, setActiveTab] = useState('basics');
  
  // Track which options have been explicitly changed by the user
  const [modifiedOptions, setModifiedOptions] = useState({});
  
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
  
  // Camera and lens options
  const [cameraAngle, setCameraAngle] = useState('eye-level');
  const [lens, setLens] = useState('standard');
  
  // Prompt preview and editing
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isUsingCustomPrompt, setIsUsingCustomPrompt] = useState(false);
  
  // Replace the trackChange function with this implementation
  const trackChange = (option, value, setter) => {
    // If a setter function is provided, use it
    if (typeof setter === 'function') {
      setter(value);
    } else {
      // Otherwise, use the appropriate setter based on option name
      switch(option) {
        case 'bodySize': setBodySize(value); break;
        case 'height': setHeight(value); break;
        case 'bodyType': setBodyType(value); break;
        case 'age': setAge(value); break;
        case 'ethnicity': setEthnicity(value); break;
        case 'background': setBackground(value); break;
        case 'pose': setPose(value); break;
        case 'lens': setLens(value); break;
        default: console.warn(`Unknown option: ${option}`);
      }
    }
    
    // Mark this option as modified by the user
    setModifiedOptions(prev => ({...prev, [option]: true}));
  };
  
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
    { value: 'petite', label: 'Short', description: 'Below average height' },
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
  
  // Camera angle options
  const cameraAngleOptions = [
    { value: 'eye-level', label: 'Eye Level', description: 'Standard direct view', icon: '👁️' },
    { value: 'high-angle', label: 'High Angle', description: 'Looking down at subject', icon: '⬇️' },
    { value: 'low-angle', label: 'Low Angle', description: 'Looking up at subject', icon: '⬆️' },
    { value: 'three-quarter', label: '3/4 View', description: 'Angled perspective', icon: '↗️' },
  ];
  
  // Lens options
  const lensOptions = [
    { value: 'portrait', label: 'Portrait (85mm f/1.8)', description: 'Blurred background, flattering perspective' },
    { value: 'standard', label: 'Standard (50mm f/5.6)', description: 'Natural perspective, medium focus depth' },
    { value: 'wide', label: 'Wide (35mm f/8)', description: 'Sharp throughout, shows environment' },
    { value: 'telephoto', label: 'Telephoto (135mm f/2.8)', description: 'Compressed perspective, isolated subject' },
  ];

  // Helper functions for prompt generation
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
  
  const getPoseDescription = () => {
    switch (pose) {
      case 'natural': return 'standing in a relaxed, natural pose';
      case 'professional': return 'standing in a confident, professional stance';
      case 'editorial': return 'posed in a stylish, editorial fashion position';
      case 'active': return 'in a dynamic, engaging pose showing movement';
      default: return 'in a natural, flattering position';
    }
  };
  
  const getCameraDescription = () => {
    switch (cameraAngle) {
      case 'eye-level': return 'direct eye-level';
      case 'high-angle': return 'slightly elevated';
      case 'low-angle': return 'slightly low';
      case 'three-quarter': return 'three-quarter angled';
      default: return 'balanced';
    }
  };
  
  const getLensDescription = () => {
    switch (lens) {
      case 'portrait': return 'an 85mm portrait lens at f/1.8 with pleasing background blur';
      case 'standard': return 'a 50mm standard lens at f/5.6 with natural perspective';
      case 'wide': return 'a 35mm wide lens at f/8 with extended depth of field';
      case 'telephoto': return 'a 135mm telephoto lens at f/2.8 with compressed perspective';
      default: return 'professional camera equipment';
    }
  };
  
  // Optimized prompt builder that only includes user-modified options
  const buildEnhancedPrompt = () => {
    // Always include gender (essential)
    const genderDesc = gender;
    
    // Build subject section with only modified attributes
    let subjectAttributes = [];
    
    // Only include modified characteristics
    if (modifiedOptions.bodySize) {
      const bodySizeLabel = bodySizeOptions.find(o => o.value === bodySize)?.label || 'medium';
      subjectAttributes.push(bodySizeLabel);
    }
    
    if (modifiedOptions.height) {
      const heightLabel = heightOptions.find(o => o.value === height)?.label || 'average height';
      subjectAttributes.push(heightLabel);
    }
    
    if (modifiedOptions.ethnicity && ethnicity !== 'diverse') {
      const ethnicityLabel = ethnicityOptions.find(o => o.value === ethnicity)?.label || 'diverse';
      subjectAttributes.push(ethnicityLabel);
    }
    
    if (modifiedOptions.bodyType && bodyType !== 'average') {
      const bodyTypeLabel = bodyTypeOptions.find(o => o.value === bodyType)?.label || 'balanced';
      subjectAttributes.push(`with ${bodyTypeLabel} body proportions`);
    }
    
    if (modifiedOptions.age && age !== 'young-adult') {
      const ageLabel = ageOptions.find(o => o.value === age)?.label || 'adult';
      subjectAttributes.push(`in the ${ageLabel} age range`);
    }
    
    // Build subject description
    const attributeString = subjectAttributes.length > 0 
      ? subjectAttributes.join(', ') + ' ' 
      : '';
      
    // Always include gender and clothing
    const subjectSection = `a ${attributeString}${genderDesc} fashion model ${modifiedOptions.pose ? getPoseDescription() : ''} wearing this clothing item`;
    
    // Setting section - only if background is modified
    const settingSection = modifiedOptions.background 
      ? getBackgroundDescription()
      : "Clean, professional studio background";
    
    // Style section - always include this for quality results
    const styleSection = "The model should look authentic and relatable with a natural expression. The clothing must fit perfectly and be the main visual focus of the image.";
    
    // Technical section - only include if camera/lens settings modified
    let technicalSection = "Professional fashion photography lighting with perfect exposure and color accuracy.";
    
    if (modifiedOptions.cameraAngle || modifiedOptions.lens) {
      let techDetails = [];
      
      if (modifiedOptions.lens) {
        techDetails.push(`Shot with ${getLensDescription()}`);
      }
      
      if (modifiedOptions.cameraAngle) {
        techDetails.push(`from a ${getCameraDescription()} perspective`);
      }
      
      if (techDetails.length > 0) {
        technicalSection = `${techDetails.join(', ')}. ${technicalSection}`;
      }
    }
    
    // Complete structured prompt
    return `CREATE A PHOTOREALISTIC IMAGE of ${subjectSection}

Setting: ${settingSection}

Style: ${styleSection}

Technical details: ${technicalSection}`;
  };

  // Toggle prompt editor visibility
  const togglePromptEditor = () => {
    if (!showPromptEditor) {
      // When opening editor, initialize with current auto-generated prompt
      setCustomPrompt(buildEnhancedPrompt());
    }
    setShowPromptEditor(!showPromptEditor);
  };

  // Handle image generation
  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Use either custom or auto-generated prompt
      const prompt = isUsingCustomPrompt ? customPrompt : buildEnhancedPrompt();
      const data = await api.editImage(prompt, clothingImage);
      
      if (data.imageData) {
        onImageGenerated(data.imageData, {
          prompt,
          gender,
          bodyType: modifiedOptions.bodyType ? bodyType : null,
          bodySize: modifiedOptions.bodySize ? bodySize : null,
          height: modifiedOptions.height ? height : null,
          age: modifiedOptions.age ? age : null,
          ethnicity: modifiedOptions.ethnicity ? ethnicity : null,
          background: modifiedOptions.background ? background : null,
          pose: modifiedOptions.pose ? pose : null,
          cameraAngle: modifiedOptions.cameraAngle ? cameraAngle : null,
          lens: modifiedOptions.lens ? lens : null,
          isCustomPrompt: isUsingCustomPrompt,
          modifiedOptions
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

  // Components with proper dark mode support
  const TabButton = ({ isActive, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={`px-4 py-3 flex items-center space-x-2 whitespace-nowrap transition-colors ${
        isActive 
          ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400 font-medium' 
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/30'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );

  // Helper component for attribute selectors with descriptions
  const AttributeSelect = ({ label, stateKey, value, onChange, options, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(stateKey, e.target.value)}
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
  
  // Component for camera angle selection
  const CameraAngleSelect = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Camera Angle
      </label>
      <div className="grid grid-cols-4 gap-2">
        {cameraAngleOptions.map(option => (
          <button
            key={option.value}
            onClick={() => trackChange('cameraAngle', option.value, setCameraAngle)}
            className={`p-2 border rounded text-center ${
              cameraAngle === option.value 
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title={option.description}
          >
            <div className="text-lg mb-1">{option.icon}</div>
            <div className="text-xs">{option.label}</div>
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {cameraAngleOptions.find(o => o.value === cameraAngle)?.description}
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
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex border-b dark:border-gray-700 overflow-x-auto hide-scrollbar">
              <TabButton 
                isActive={activeTab === 'basics'} 
                onClick={() => setActiveTab('basics')}
                icon="👔"
                label="Basics"
              />
              <TabButton 
                isActive={activeTab === 'appearance'} 
                onClick={() => setActiveTab('appearance')}
                icon="👤"
                label="Appearance" 
              />
              <TabButton 
                isActive={activeTab === 'environment'} 
                onClick={() => setActiveTab('environment')}
                icon="🏞️"
                label="Setting"
              />
              <TabButton 
                isActive={activeTab === 'photography'} 
                onClick={() => setActiveTab('photography')}
                icon="📸"
                label="Photography"
              />
              <TabButton 
                isActive={activeTab === 'advanced'} 
                onClick={() => setActiveTab('advanced')}
                icon="⚙️"
                label="Advanced"
              />
            </div>
            
            {/* Tab Content */}
            <div className="p-1">
              {/* Basic Settings Tab */}
              {activeTab === 'basics' && (
                <div className="space-y-6">
                  {/* Gender selection */}
                  <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                    <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Model Gender</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setGender('female')}
                        className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'female' 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400 text-gray-800 dark:text-gray-100' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'} transition-colors`}
                      >
                        <div className="text-2xl mb-1">👩</div>
                        <div className="font-medium">Female</div>
                      </button>
                      <button
                        onClick={() => setGender('male')}
                        className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'male' 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400 text-gray-800 dark:text-gray-100' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'} transition-colors`}
                      >
                        <div className="text-2xl mb-1">👨</div>
                        <div className="font-medium">Male</div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Basic body size selection */}
                  <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                    <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Basic Sizing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AttributeSelect 
                        label="Body Size" 
                        stateKey="bodySize"
                        value={bodySize} 
                        onChange={trackChange} 
                        options={bodySizeOptions}
                      />
                      <AttributeSelect 
                        label="Height" 
                        stateKey="height"
                        value={height} 
                        onChange={trackChange} 
                        options={heightOptions}
                      />
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        <span className="font-medium">Tip:</span> Customize only what matters for your clothing item. 
                        Default settings work well for most products.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                  <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Model Characteristics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AttributeSelect 
                      label="Body Type" 
                      stateKey="bodyType"
                      value={bodyType} 
                      onChange={trackChange} 
                      options={bodyTypeOptions}
                    />
                    <AttributeSelect 
                      label="Age Range" 
                      stateKey="age"
                      value={age} 
                      onChange={trackChange} 
                      options={ageOptions}
                    />
                    <AttributeSelect 
                      label="Ethnicity" 
                      stateKey="ethnicity"
                      value={ethnicity} 
                      onChange={trackChange} 
                      options={ethnicityOptions}
                    />
                  </div>
                </div>
              )}
              
              {/* Environment Tab */}
              {activeTab === 'environment' && (
                <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                  <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Environment & Style</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AttributeSelect 
                      label="Background" 
                      stateKey="background"
                      value={background} 
                      onChange={trackChange} 
                      options={backgroundOptions}
                    />
                    <AttributeSelect 
                      label="Pose Style" 
                      stateKey="pose"
                      value={pose} 
                      onChange={trackChange} 
                      options={poseOptions}
                    />
                  </div>
                </div>
              )}
              
              {/* Photography Tab */}
              {activeTab === 'photography' && (
                <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                  <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Photography Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CameraAngleSelect />
                    <AttributeSelect
                      label="Lens & Depth of Field"
                      stateKey="lens"
                      value={lens}
                      onChange={trackChange}
                      options={lensOptions}
                    />
                  </div>
                </div>
              )}
              
              {/* Advanced Tab - Prompt Editor */}
              {activeTab === 'advanced' && (
                <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                  <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Advanced Prompt Editor</h3>
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customPrompt.length || buildEnhancedPrompt().length} characters
                        {(customPrompt.length > 800 || (!customPrompt && buildEnhancedPrompt().length > 800)) && 
                          <span className="text-amber-600 dark:text-amber-400 ml-2">
                            (Very long prompts may be truncated)
                          </span>
                        }
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setCustomPrompt(buildEnhancedPrompt());
                            setIsUsingCustomPrompt(false);
                          }}
                          className="text-xs py-1 px-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(customPrompt || buildEnhancedPrompt());
                            toast.success('Prompt copied!');
                          }}
                          className="text-xs py-1 px-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={customPrompt || buildEnhancedPrompt()}
                      onChange={(e) => {
                        setCustomPrompt(e.target.value);
                        setIsUsingCustomPrompt(true);
                      }}
                      className="w-full border rounded-md p-3 h-48 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Edit the generation prompt..."
                    />
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="useCustomPrompt"
                        checked={isUsingCustomPrompt}
                        onChange={(e) => setIsUsingCustomPrompt(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="useCustomPrompt" className="text-sm text-gray-700 dark:text-gray-300">
                        Use edited prompt instead of auto-generated
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Generate button - always visible */}
            <div className="flex justify-end mt-6">
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