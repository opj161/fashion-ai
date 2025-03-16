import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import TabButton from './common/TabButton';
import ClothingPreview from './ClothingPreview';
import BasicsTabPanel from './tab-panels/BasicsTabPanel';
import AppearanceTabPanel from './tab-panels/AppearanceTabPanel';
import EnvironmentTabPanel from './tab-panels/EnvironmentTabPanel';
import PhotographyTabPanel from './tab-panels/PhotographyTabPanel';
import AdvancedTabPanel from './tab-panels/AdvancedTabPanel';

function FashionModelPreview({ clothingImage, onImageGenerated }) {
  const [loading, setLoading] = useState(false);
  
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: uploaded clothing image */}
        <div className="md:col-span-1">
          <ClothingPreview clothingImage={clothingImage} />
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
                <BasicsTabPanel
                  gender={gender}
                  trackChange={trackChange}
                  bodySize={bodySize}
                  height={height}
                  bodySizeOptions={bodySizeOptions}
                  heightOptions={heightOptions}
                />
              )}
              
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <AppearanceTabPanel
                  bodyType={bodyType}
                  age={age}
                  ethnicity={ethnicity}
                  trackChange={trackChange}
                  bodyTypeOptions={bodyTypeOptions}
                  ageOptions={ageOptions}
                  ethnicityOptions={ethnicityOptions}
                />
              )}
              
              {/* Environment Tab */}
              {activeTab === 'environment' && (
                <EnvironmentTabPanel
                  background={background}
                  pose={pose}
                  trackChange={trackChange}
                  backgroundOptions={backgroundOptions}
                  poseOptions={poseOptions}
                />
              )}
              
              {/* Photography Tab */}
              {activeTab === 'photography' && (
                <PhotographyTabPanel
                  cameraAngle={cameraAngle}
                  lens={lens}
                  trackChange={trackChange}
                  cameraAngleOptions={cameraAngleOptions}
                  lensOptions={lensOptions}
                />
              )}
              
              {/* Advanced Tab - Prompt Editor */}
              {activeTab === 'advanced' && (
                <AdvancedTabPanel
                  customPrompt={customPrompt}
                  isUsingCustomPrompt={isUsingCustomPrompt}
                  setCustomPrompt={setCustomPrompt}
                  setIsUsingCustomPrompt={setIsUsingCustomPrompt}
                  buildEnhancedPrompt={buildEnhancedPrompt}
                />
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