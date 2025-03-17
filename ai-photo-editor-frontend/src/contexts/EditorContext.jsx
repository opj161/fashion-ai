import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import api from '../services/api';
import { EditorContext, initialState, editorReducer, ACTION_TYPES } from './editorContextState';

// Provider component
export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Create functions to dispatch actions
  const uploadImage = useCallback((imageData) => {
    dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload: imageData });
  }, []);

  const setGenerating = useCallback((isGenerating) => {
    dispatch({ type: ACTION_TYPES.SET_GENERATING, payload: isGenerating });
  }, []);

  const updateOption = useCallback((key, value) => {
    dispatch({ 
      type: ACTION_TYPES.UPDATE_OPTION, 
      payload: { key, value } 
    });
  }, []);
  
  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ACTION_TYPES.SET_ACTIVE_TAB, payload: tab });
  }, []);
  
  const setCustomPrompt = useCallback((prompt) => {
    dispatch({ type: ACTION_TYPES.SET_CUSTOM_PROMPT, payload: prompt });
  }, []);
  
  const setIsUsingCustomPrompt = useCallback((isUsing) => {
    dispatch({ type: ACTION_TYPES.SET_IS_USING_CUSTOM_PROMPT, payload: isUsing });
  }, []);
  
  const setHistoryIndex = useCallback((index) => {
    dispatch({ type: ACTION_TYPES.SET_HISTORY_INDEX, payload: index });
  }, []);
  
  const setShowGallery = useCallback((show) => {
    dispatch({ type: ACTION_TYPES.SET_SHOW_GALLERY, payload: show });
  }, []);
  
  const resetApp = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_APP });
  }, []);

  // Build enhanced prompt based on options
  const buildEnhancedPrompt = useCallback(() => {
    const opts = state.options;
    
    // Start with a common beginning for all prompts
    let prompt = 'CREATE A PHOTOREALISTIC IMAGE of a ';
    
    // Add gender
    prompt += `${opts.gender} fashion model `;
    
    // Add appearance details if non-default
    const attributes = [];
    if (opts.bodyType !== 'default') attributes.push(`with ${opts.bodyType} body type`);
    if (opts.bodySize !== 'default') attributes.push(`with ${opts.bodySize} body size`);
    if (opts.height !== 'default') attributes.push(`of ${opts.height} height`);
    if (opts.age !== 'default') attributes.push(`in ${opts.age} age range`);
    if (opts.ethnicity !== 'default') attributes.push(`of ${opts.ethnicity} ethnicity`);
    
    if (attributes.length > 0) {
      prompt += attributes.join(", ") + ", ";
    }
    
    // Add pose if non-default
    if (opts.pose !== 'default') {
      prompt += `in a ${opts.pose} pose `;
    }
    
    // Add clothing item reference
    prompt += 'wearing the provided clothing item. ';
    
    // Add background
    prompt += `The setting is a ${opts.background} background. `;
    
    // Add photography settings if non-default
    if (opts.cameraAngle !== 'default' || opts.lens !== 'default') {
      prompt += 'Photograph with ';
      
      if (opts.cameraAngle !== 'default') {
        prompt += `a ${opts.cameraAngle} camera angle `;
      }
      
      if (opts.lens !== 'default') {
        if (opts.cameraAngle !== 'default') prompt += 'and ';
        prompt += `a ${opts.lens} lens `;
      }
      
      prompt += '. ';
    }
    
    // Add quality directive
    prompt += 'Professional fashion photography lighting with perfect exposure and color accuracy.';
    
    return prompt;
  }, [state.options]);

  const generateImage = useCallback(async () => {
    try {
      setGenerating(true);
      
      // Determine which prompt to use
      const promptToUse = state.isUsingCustomPrompt 
        ? state.customPrompt
        : buildEnhancedPrompt();
      
      // Call API to generate image
      const data = await api.editImage(promptToUse, state.originalImage);
      
      if (data.imageData) {
        // Create metadata object with complete information
        const metadata = {
          prompt: promptToUse,
          // Include all options in metadata
          gender: state.options.gender,
          bodyType: state.options.bodyType !== 'default' ? state.options.bodyType : null,
          bodySize: state.options.bodySize !== 'default' ? state.options.bodySize : null,
          height: state.options.height !== 'default' ? state.options.height : null,
          age: state.options.age !== 'default' ? state.options.age : null,
          ethnicity: state.options.ethnicity !== 'default' ? state.options.ethnicity : null,
          background: state.options.background,
          pose: state.options.pose !== 'default' ? state.options.pose : null,
          cameraAngle: state.options.cameraAngle !== 'default' ? state.options.cameraAngle : null,
          lens: state.options.lens !== 'default' ? state.options.lens : null,
          isCustomPrompt: state.isUsingCustomPrompt,
          tags: [], // Initialize with empty tags array
          createdAt: new Date().toISOString()
        };
        
        // Save to cloud if possible
        try {
          const savedImageData = await api.saveImage(data.imageData, metadata);
          // Update state with generated image and cloud ID
          dispatch({ 
            type: ACTION_TYPES.IMAGE_GENERATED, 
            payload: {
              imageData: data.imageData, 
              metadata,
              id: savedImageData.id
            }
          });
          toast.success('Model generated successfully!');
        } catch (saveError) {
          // Still update state even if cloud save fails
          dispatch({ 
            type: ACTION_TYPES.IMAGE_GENERATED, 
            payload: {
              imageData: data.imageData, 
              metadata,
              id: null
            }
          });
          toast.success('Model generated successfully!');
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setGenerating(false);
      toast.error('Failed to generate model. Please try again.');
    }
  }, [state.isUsingCustomPrompt, state.customPrompt, state.originalImage, state.options, buildEnhancedPrompt, setGenerating]);

  // Handle gallery image selection
  const handleGalleryImageSelected = useCallback((image) => {
    if (image?.imageData) {
      dispatch({ 
        type: ACTION_TYPES.SET_GALLERY_IMAGE, 
        payload: {
          generatedImage: image.imageData,
          metadata: image.metadata || {},
          id: image.id || null
        }
      });
      toast.success('Image loaded from gallery');
    }
  }, []);

  // Build the context value object
  const contextValue = {
    ...state,
    uploadImage,
    generateImage,
    updateOption,
    setActiveTab,
    setCustomPrompt,
    setIsUsingCustomPrompt,
    setHistoryIndex,
    setShowGallery,
    handleGalleryImageSelected,
    resetApp,
    buildEnhancedPrompt,
    setGenerating
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

EditorProvider.propTypes = {
  children: PropTypes.node.isRequired
};
