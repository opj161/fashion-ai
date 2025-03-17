import React, { useCallback, useState } from 'react';
import { useEditor } from '../contexts/useEditor';  // Correct import path
import UnifiedEditorLayout from './UnifiedEditorLayout';
import ControlPanel from './ControlPanel';
import PreviewPanel from './PreviewPanel';
import TabButton from './common/TabButton';
import BasicsTabPanel from './tab-panels/BasicsTabPanel';
import AppearanceTabPanel from './tab-panels/AppearanceTabPanel';
import EnvironmentTabPanel from './tab-panels/EnvironmentTabPanel'; // Add this import
import PhotographyTabPanel from './tab-panels/PhotographyTabPanel'; // Add this import
import AdvancedTabPanel from './tab-panels/AdvancedTabPanel'; // Add this import
import ImageUploader from './ImageUploader';
import RecentImagesGallery from './RecentImagesGallery';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

function UnifiedEditor() {
  const {
    originalImage,
    generatedImage,
    isGenerating,
    options,
    updateOption,
    activeTab,
    setActiveTab,
    uploadImage,
    generateImage,
    editHistory,
    showGallery,
    setShowGallery,
    handleGalleryImageSelected,
    setGenerating
  } = useEditor();
  
  const [customPrompt, setCustomPrompt] = useState('');
  const [isUsingCustomPrompt, setIsUsingCustomPrompt] = useState(false);

  const handleQuickEdit = useCallback(async (promptText) => {
    if (!generatedImage) {
      toast.error('No image to edit');
      return;
    }
    
    try {
      setGenerating(true);
      const loadingToast = toast.loading('Applying edit...');
      
      const data = await api.editImage(promptText, generatedImage);
      
      if (data && data.imageData) {
        // Create proper metadata with all required fields
        const metadata = {
          prompt: promptText,
          gender: options.gender,
          bodyType: options.bodyType !== 'default' ? options.bodyType : null,
          bodySize: options.bodySize !== 'default' ? options.bodySize : null,
          height: options.height !== 'default' ? options.height : null,
          age: options.age !== 'default' ? options.age : null,
          ethnicity: options.ethnicity !== 'default' ? options.ethnicity : null,
          background: options.background,
          pose: options.pose !== 'default' ? options.pose : null,
          cameraAngle: options.cameraAngle !== 'default' ? options.cameraAngle : null,
          lens: options.lens !== 'default' ? options.lens : null,
          isCustomPrompt: false,
          tags: [], // Initialize with empty tags array
          createdAt: new Date().toISOString()
        };
        
        // Update the image in the context
        handleGalleryImageSelected({
          imageData: data.imageData,
          metadata: metadata
        });
        
        // Dismiss the loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Edit applied successfully!');
      } else {
        throw new Error('Edit failed');
      }
    } catch (error) {
      console.error('Error during quick edit:', error);
      toast.error('Failed to apply edit');
    } finally {
      setGenerating(false);
    }
  }, [generatedImage, options, handleGalleryImageSelected, setGenerating]);
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${generatedImage}`;
    link.download = `fashion-model-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully');
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basics':
        return (
          <BasicsTabPanel
            gender={options.gender}
            trackChange={updateOption}
            bodySize={options.bodySize}
            height={options.height}
            bodySizeOptions={[
              { value: 'slim', label: 'Slim' },
              { value: 'average', label: 'Average' },
              { value: 'curvy', label: 'Curvy' }
            ]} 
            heightOptions={[
              { value: 'petite', label: 'Petite' },
              { value: 'average', label: 'Average' },
              { value: 'tall', label: 'Tall' }
            ]}
          />
        );
      case 'appearance':
        return (
          <AppearanceTabPanel
            bodyType={options.bodyType}
            age={options.age}
            ethnicity={options.ethnicity}
            trackChange={updateOption}
            bodyTypeOptions={[
              { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine based on clothing' },
              { value: 'hourglass', label: 'Hourglass', description: 'Balanced top and bottom with defined waist' },
              { value: 'athletic', label: 'Athletic', description: 'Toned with broader shoulders' },
              { value: 'pear', label: 'Pear', description: 'Narrower shoulders, wider hips' },
              { value: 'apple', label: 'Apple', description: 'Fuller mid-section, slimmer legs' },
              { value: 'rectangular', label: 'Rectangular', description: 'Balanced with less defined waist' }
            ]}
            ageOptions={[
              { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine based on clothing style' },
              { value: 'young-adult', label: 'Young Adult', description: '20s' },
              { value: 'adult', label: 'Adult', description: '30s-40s' },
              { value: 'mature', label: 'Mature', description: '50s-60s' },
              { value: 'senior', label: 'Senior', description: '65+' }
            ]}
            ethnicityOptions={[
              { value: 'default', label: 'Default (unspecified)', description: 'Let AI determine appropriate diversity' },
              { value: 'diverse', label: 'Diverse', description: 'Unspecified/mixed' },
              { value: 'caucasian', label: 'Caucasian', description: 'Fair/light skin tones' },
              { value: 'black', label: 'Black', description: 'Dark skin tones' },
              { value: 'asian', label: 'Asian', description: 'East/South Asian features' },
              { value: 'hispanic', label: 'Hispanic/Latino', description: 'Latin American features' },
              { value: 'middle-eastern', label: 'Middle Eastern', description: 'Middle Eastern features' }
            ]}
          />
        );
      case 'environment':
        return (
          <EnvironmentTabPanel
            background={options.background}
            pose={options.pose}
            trackChange={updateOption}
            backgroundOptions={[
              { value: 'studio-white', label: 'Studio White', description: 'Clean professional backdrop' },
              { value: 'studio-gradient', label: 'Studio Gradient', description: 'Smooth color transition' },
              { value: 'in-store', label: 'In-store', description: 'Retail environment' },
              { value: 'lifestyle-home', label: 'Lifestyle - Home', description: 'Casual home setting' },
              { value: 'lifestyle-office', label: 'Lifestyle - Office', description: 'Professional workplace' },
              { value: 'outdoor-urban', label: 'Outdoor - Urban', description: 'City street setting' },
              { value: 'outdoor-nature', label: 'Outdoor - Nature', description: 'Natural environment' }
            ]}
            poseOptions={[
              { value: 'natural', label: 'Natural', description: 'Relaxed, authentic pose' },
              { value: 'formal', label: 'Formal', description: 'Professional stance' },
              { value: 'casual', label: 'Casual', description: 'Relaxed, everyday pose' },
              { value: 'active', label: 'Active', description: 'Dynamic, movement-focused' }
            ]}
          />
        );
      case 'photography':
        return (
          <PhotographyTabPanel
            cameraAngle={options.cameraAngle}
            lens={options.lens}
            trackChange={updateOption}
            cameraAngleOptions={[
              { value: 'default', label: 'Default', description: 'Let AI choose the best angle', icon: '🎯' },
              { value: 'eye-level', label: 'Eye Level', description: 'Standard direct view', icon: '👁️' },
              { value: 'high-angle', label: 'High Angle', description: 'Looking down at subject', icon: '⬇️' },
              { value: 'low-angle', label: 'Low Angle', description: 'Looking up at subject', icon: '⬆️' },
              { value: 'three-quarter', label: '3/4 View', description: 'Angled perspective', icon: '↗️' }
            ]}
            lensOptions={[
              { value: 'default', label: 'Default (optimal)', description: 'Let AI choose the best lens settings' },
              { value: 'portrait', label: 'Portrait (85mm f/1.8)', description: 'Blurred background, flattering perspective' },
              { value: 'standard', label: 'Standard (50mm f/5.6)', description: 'Natural perspective, medium focus depth' },
              { value: 'wide', label: 'Wide (35mm f/8)', description: 'Sharp throughout, shows environment' },
              { value: 'telephoto', label: 'Telephoto (135mm f/2.8)', description: 'Compressed perspective, isolated subject' }
            ]}
          />
        );
      case 'advanced':
        return (
          <AdvancedTabPanel
            customPrompt={customPrompt}
            isUsingCustomPrompt={isUsingCustomPrompt}
            setCustomPrompt={setCustomPrompt}
            setIsUsingCustomPrompt={setIsUsingCustomPrompt}
            buildEnhancedPrompt={() => "CREATE A PHOTOREALISTIC IMAGE of a fashion model wearing this clothing item"}
          />
        );
      default:
        return null;
    }
  };
  
  const controlPanelContent = (
    <>
      <AnimatePresence mode="wait">
        {!originalImage ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ImageUploader onImageUploaded={uploadImage} />
          </motion.div>
        ) : (
          <motion.div
            key="controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ControlPanel
              currentImage={originalImage}
              hasUploadedImage={!!originalImage}
              imageUploader={<ImageUploader onImageUploaded={uploadImage} />}
              imageGenerationControls={(
                <>
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
                  <div className="py-4">
                    {renderTabContent()}
                  </div>
                </>
              )}
              loading={isGenerating}
              onGenerate={generateImage}
              onChangeImage={() => uploadImage(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {originalImage && (
        <div className="mt-6">
          <button 
            onClick={() => setShowGallery(!showGallery)}
            className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            {showGallery ? 'Hide Recent Images' : 'Show Recent Images'}
          </button>
          
          <AnimatePresence>
            {showGallery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <RecentImagesGallery 
                  onImageSelected={handleGalleryImageSelected}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
  
  const previewPanelContent = (
    <PreviewPanel
      generatedImage={generatedImage}
      isGenerating={isGenerating}
      editControls={(
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleQuickEdit("Make the background brighter")}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            Brighter Background
          </button>
          <button 
            onClick={() => handleQuickEdit("Add more contrast")}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            More Contrast
          </button>
          <button 
            onClick={() => handleQuickEdit("Make colors more vibrant")}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            Vibrant Colors
          </button>
        </div>
      )}
      onDownload={handleDownload}
      editHistory={editHistory}
    />
  );
  
  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] w-full">
      <UnifiedEditorLayout
        controlPanel={controlPanelContent}
        previewPanel={previewPanelContent}
      />
    </div>
  );
}

export default UnifiedEditor;
