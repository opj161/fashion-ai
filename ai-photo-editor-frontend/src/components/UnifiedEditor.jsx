import React, { useCallback } from 'react';
import { useEditor } from '../contexts/useEditor';  // Correct import path
import UnifiedEditorLayout from './UnifiedEditorLayout';
import ControlPanel from './ControlPanel';
import PreviewPanel from './PreviewPanel';
import TabButton from './common/TabButton';
import BasicsTabPanel from './tab-panels/BasicsTabPanel';
import AppearanceTabPanel from './tab-panels/AppearanceTabPanel';
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
    <div className="h-[calc(100vh-200px)] min-h-[600px]">
      <UnifiedEditorLayout
        controlPanel={controlPanelContent}
        previewPanel={previewPanelContent}
      />
    </div>
  );
}

export default UnifiedEditor;
