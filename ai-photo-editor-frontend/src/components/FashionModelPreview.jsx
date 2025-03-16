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
  const [gender, setGender] = useState('female'); // Essential, always included
  
  // Optional attributes that can use "default" option
  const [bodyType, setBodyType] = useState('default');
  const [bodySize, setBodySize] = useState('default');
  const [height, setHeight] = useState('default');
  const [age, setAge] = useState('default');
  const [ethnicity, setEthnicity] = useState('default');
  
  // Semi-essential settings with specific defaults
  const [background, setBackground] = useState('outdoor-nature');
  const [pose, setPose] = useState('natural');
  
  // Optional technical settings
  const [cameraAngle, setCameraAngle] = useState('default');
  const [lens, setLens] = useState('default');
  
  // Prompt preview and editing
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isUsingCustomPrompt, setIsUsingCustomPrompt] = useState(false);
  
  // Track changes function
  const trackChange = (option, value) => {
    // Update the corresponding state variable
    switch(option) {
      case 'gender': setGender(value); break;
      case 'bodyType': setBodyType(value); break;
      case 'bodySize': setBodySize(value); break;
      case 'height': setHeight(value); break;
      case 'age': setAge(value); break;
      case 'ethnicity': setEthnicity(value); break;
      case 'background': setBackground(value); break;
      case 'pose': setPose(value); break;
      case 'cameraAngle': setCameraAngle(value); break;
      case 'lens': setLens(value); break;
      default: console.warn(`Unknown option: ${option}`);
    }
    
    // Mark this option as modified by the user
    setModifiedOptions(prev => ({...prev, [option]: true}));
  };
  
  // Model attribute options
  const bodyTypeOptions = [
    { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine based on clothing' },
    { value: 'hourglass', label: 'Hourglass', description: 'Balanced top and bottom with defined waist' },
    { value: 'athletic', label: 'Athletic', description: 'Toned with broader shoulders' },
    { value: 'pear', label: 'Pear', description: 'Narrower shoulders, wider hips' },
    { value: 'apple', label: 'Apple', description: 'Fuller mid-section, slimmer legs' },
    { value: 'rectangular', label: 'Rectangular', description: 'Balanced with less defined waist' },
    { value: 'average', label: 'Balanced', description: 'Standard proportions' },
  ];
  
  const bodySizeOptions = [
    { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine based on clothing' },
    { value: 'petite', label: 'Petite', description: 'Smaller frame' },
    { value: 'slim', label: 'Slim', description: 'Lean build' },
    { value: 'medium', label: 'Medium', description: 'Average build' },
    { value: 'curvy', label: 'Curvy', description: 'Fuller figure' },
    { value: 'plus', label: 'Plus', description: 'Plus size' },
  ];
  
  const heightOptions = [
    { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine based on clothing' },
    { value: 'petite', label: 'Short', description: 'Below average height' },
    { value: 'average', label: 'Average', description: 'Standard height' },
    { value: 'tall', label: 'Tall', description: 'Above average height' },
  ];
  
  const ageOptions = [
    { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine based on clothing style' },
    { value: 'young-adult', label: 'Young Adult', description: '20s' },
    { value: 'adult', label: 'Adult', description: '30s-40s' },
    { value: 'mature', label: 'Mature', description: '50s-60s' },
    { value: 'senior', label: 'Senior', description: '65+' },
  ];
  
  const ethnicityOptions = [
    { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine appropriate diversity' },
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
    { value: 'default', label: 'Default (natural)', description: 'Let AI choose appropriate pose' },
    { value: 'natural', label: 'Natural', description: 'Relaxed, everyday stance' },
    { value: 'professional', label: 'Professional', description: 'Formal, business-like' },
    { value: 'editorial', label: 'Editorial', description: 'Fashion magazine style' },
    { value: 'active', label: 'Active', description: 'In motion, dynamic' },
  ];
  
  // Camera angle options with default
  const cameraAngleOptions = [
    { value: 'default', label: 'Default', description: 'Let AI choose the best angle', icon: '🎯' },
    { value: 'eye-level', label: 'Eye Level', description: 'Standard direct view', icon: '👁️' },
    { value: 'high-angle', label: 'High Angle', description: 'Looking down at subject', icon: '⬇️' },
    { value: 'low-angle', label: 'Low Angle', description: 'Looking up at subject', icon: '⬆️' },
    { value: 'three-quarter', label: '3/4 View', description: 'Angled perspective', icon: '↗️' },
  ];
  
  // Lens options with default
  const lensOptions = [
    { value: 'default', label: 'Default (optimal)', description: 'Let AI choose the best lens settings' },
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
      case 'default': return '';
      case 'natural': return 'standing in a relaxed, natural pose';
      case 'professional': return 'standing in a confident, professional stance';
      case 'editorial': return 'posed in a stylish, editorial fashion position';
      case 'active': return 'in a dynamic, engaging pose showing movement';
      default: return 'in a natural, flattering position';
    }
  };
  
  const getCameraDescription = () => {
    switch (cameraAngle) {
      case 'default': return 'optimal';
      case 'eye-level': return 'direct eye-level';
      case 'high-angle': return 'slightly elevated';
      case 'low-angle': return 'slightly low';
      case 'three-quarter': return 'three-quarter angled';
      default: return 'balanced';
    }
  };
  
  const getLensDescription = () => {
    switch (lens) {
      case 'default': return 'professional camera equipment';
      case 'portrait': return 'an 85mm portrait lens at f/1.8 with pleasing background blur';
      case 'standard': return 'a 50mm standard lens at f/5.6 with natural perspective';
      case 'wide': return 'a 35mm wide lens at f/8 with extended depth of field';
      case 'telephoto': return 'a 135mm telephoto lens at f/2.8 with compressed perspective';
      default: return 'professional camera equipment';
    }
  };
  
  // Structured prompt builder using sections
  const buildEnhancedPrompt = () => {
    // Subject section - only include non-default attributes
    let subjectAttributes = [];
    
    if (bodySize !== 'default') {
      const bodySizeLabel = bodySizeOptions.find(o => o.value === bodySize)?.label || '';
      subjectAttributes.push(bodySizeLabel);
    }
    
    if (height !== 'default') {
      const heightLabel = heightOptions.find(o => o.value === height)?.label || '';
      subjectAttributes.push(heightLabel);
    }
    
    if (ethnicity !== 'default' && ethnicity !== 'diverse') {
      const ethnicityLabel = ethnicityOptions.find(o => o.value === ethnicity)?.label || '';
      subjectAttributes.push(ethnicityLabel);
    }
    
    if (bodyType !== 'default') {
      const bodyTypeLabel = bodyTypeOptions.find(o => o.value === bodyType)?.label || '';
      // Add "with X body proportions" phrasing for body type
      if (!bodyTypeLabel.includes('Default')) {
        subjectAttributes.push(`with ${bodyTypeLabel} body proportions`);
      }
    }
    
    if (age !== 'default') {
      const ageLabel = ageOptions.find(o => o.value === age)?.label || '';
      subjectAttributes.push(`in the ${ageLabel} age range`);
    }
    
    // Build subject description
    const attributeString = subjectAttributes.length > 0 
      ? subjectAttributes.join(', ') + ' ' 
      : '';
      
    // Always include gender and clothing
    const subjectSection = `a ${attributeString}${gender} fashion model ${pose !== 'default' ? getPoseDescription() : ''} wearing this clothing item`;
    
    // Setting section - always include background
    const settingSection = getBackgroundDescription();
    
    // Style section - always include this for quality results
    const styleSection = "The model should look authentic and relatable with a natural expression and a subtle smile. The clothing must fit perfectly and be the visual focus of the image.n";
    
    // Technical section - only include specific camera/lens settings if not default
    let technicalSection = "Professional fashion photography lighting with perfect exposure and color accuracy.";
    
    let techDetails = [];
    
    if (lens !== 'default') {
      techDetails.push(`Shot with ${getLensDescription()}`);
    }
    
    if (cameraAngle !== 'default') {
      techDetails.push(`from a ${getCameraDescription()} perspective`);
    }
    
    if (techDetails.length > 0) {
      technicalSection = `${techDetails.join(', ')}. ${technicalSection}`;
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
          // Only include non-default values in metadata
          bodyType: bodyType !== 'default' ? bodyType : null,
          bodySize: bodySize !== 'default' ? bodySize : null,
          height: height !== 'default' ? height : null,
          age: age !== 'default' ? age : null,
          ethnicity: ethnicity !== 'default' ? ethnicity : null,
          background, // Always include these essential settings
          pose: pose !== 'default' ? pose : null,
          cameraAngle: cameraAngle !== 'default' ? cameraAngle : null,
          lens: lens !== 'default' ? lens : null,
          isCustomPrompt: isUsingCustomPrompt
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
  
  // Tab Button component
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
        className={`w-full rounded-md border ${
          value === 'default' 
            ? 'border-dashed border-gray-300 dark:border-gray-600' 
            : 'border-gray-300 dark:border-gray-700'
        } bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} title={option.description}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mt-1 text-xs">
        {value === 'default' ? (
          <span className="text-gray-500 dark:text-gray-400 italic">
            {options.find(o => o.value === value)?.description}
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            {options.find(o => o.value === value)?.description}
          </span>
        )}
      </div>
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
                        onClick={() => {
                          setGender('female');
                          trackChange('gender', 'female');
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'female' 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
                      >
                        <div className="text-2xl mb-1">👩</div>
                        <div className="font-medium">Female</div>
                      </button>
                      <button
                        onClick={() => {
                          setGender('male');
                          trackChange('gender', 'male');
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'male' 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
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
                        <span className="font-medium">Tip:</span> "Default" options won't be included in the prompt - the AI will decide based on context. Select specific values only when important for your item.
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
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      <span className="font-medium">Tip:</span> "Default" options won't be included in the prompt - the AI will decide based on context. Select specific values only when important for your item.
                    </p>
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
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      <span className="font-medium">Note:</span> Background and pose greatly impact how your clothing item appears. Choose settings that highlight your product best.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Photography Tab */}
              {activeTab === 'photography' && (
                <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                  <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Photography Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Camera angle selector with visual buttons */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Camera Angle
                      </label>
                      <div className="grid grid-cols-5 gap-2"> {/* Changed from 4 to 5 columns to fit default */}
                        {cameraAngleOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => trackChange('cameraAngle', option.value, setCameraAngle)}
                            className={`p-2 border ${
                              option.value === 'default' ? 'border-dashed' : ''
                            } rounded text-center ${
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
                        {cameraAngle === 'default' ? (
                          <span className="italic">{cameraAngleOptions.find(o => o.value === cameraAngle)?.description}</span>
                        ) : (
                          cameraAngleOptions.find(o => o.value === cameraAngle)?.description
                        )}
                      </p>
                    </div>
                    
                    {/* Lens options */}
                    <AttributeSelect
                      label="Lens & Depth of Field"
                      stateKey="lens"
                      value={lens}
                      onChange={trackChange}
                      options={lensOptions}
                    />
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      <span className="font-medium">Tip:</span> "Default" lens and camera settings work well for most items. Adjust these only for specific visual effects.
                    </p>
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
                    
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-md">
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        <span className="font-medium">Advanced users only:</span> Edit the prompt directly to fine-tune the generation. Be sure to maintain the key instruction "CREATE A PHOTOREALISTIC IMAGE" at the beginning.
                      </p>
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