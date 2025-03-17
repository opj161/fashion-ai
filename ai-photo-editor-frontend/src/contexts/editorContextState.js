import { createContext } from 'react';

// Initial state
export const initialState = {
  originalImage: null,
  generatedImage: null,
  isGenerating: false,
  editHistory: [],
  historyIndex: -1,
  options: {
    gender: 'female',
    bodyType: 'default',
    bodySize: 'default',
    height: 'default',
    age: 'default',
    ethnicity: 'default',
    background: 'outdoor-nature',
    pose: 'natural',
    cameraAngle: 'default',
    lens: 'default',
  },
  imageId: null,
  metadata: null,
  isUsingCustomPrompt: false,
  customPrompt: '',
  activeTab: 'basics',
  showGallery: false
};

// Action types
export const ACTION_TYPES = {
  UPLOAD_IMAGE: 'UPLOAD_IMAGE',
  SET_GENERATING: 'SET_GENERATING',
  IMAGE_GENERATED: 'IMAGE_GENERATED',
  UPDATE_OPTION: 'UPDATE_OPTION',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_CUSTOM_PROMPT: 'SET_CUSTOM_PROMPT',
  SET_IS_USING_CUSTOM_PROMPT: 'SET_IS_USING_CUSTOM_PROMPT',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SET_HISTORY_INDEX: 'SET_HISTORY_INDEX',
  SET_SHOW_GALLERY: 'SET_SHOW_GALLERY',
  SET_GALLERY_IMAGE: 'SET_GALLERY_IMAGE',
  RESET_APP: 'RESET_APP'
};

// Create context
export const EditorContext = createContext(null);

// Reducer function
export function editorReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPLOAD_IMAGE:
      return { ...state, originalImage: action.payload };
    
    case ACTION_TYPES.SET_GENERATING:
      return { ...state, isGenerating: action.payload };
    
    case ACTION_TYPES.IMAGE_GENERATED:
      return { 
        ...state, 
        generatedImage: action.payload.imageData, 
        metadata: action.payload.metadata,
        imageId: action.payload.id,
        isGenerating: false,
        // Add to history if it's a new image
        editHistory: [
          action.payload.imageData, 
          ...state.editHistory
        ].slice(0, 10), // Keep only last 10 items
        historyIndex: 0
      };
    
    case ACTION_TYPES.UPDATE_OPTION:
      return { 
        ...state, 
        options: {
          ...state.options,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ACTION_TYPES.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
      
    case ACTION_TYPES.SET_CUSTOM_PROMPT:
      return { ...state, customPrompt: action.payload };
      
    case ACTION_TYPES.SET_IS_USING_CUSTOM_PROMPT:
      return { ...state, isUsingCustomPrompt: action.payload };
      
    case ACTION_TYPES.ADD_TO_HISTORY:
      return {
        ...state,
        editHistory: [action.payload, ...state.editHistory].slice(0, 10),
        historyIndex: 0
      };
      
    case ACTION_TYPES.SET_HISTORY_INDEX:
      return {
        ...state,
        historyIndex: action.payload,
        generatedImage: state.editHistory[action.payload]
      };
      
    case ACTION_TYPES.SET_SHOW_GALLERY:
      return { ...state, showGallery: action.payload };
      
    case ACTION_TYPES.SET_GALLERY_IMAGE:
      return {
        ...state,
        originalImage: action.payload.originalImage || state.originalImage,
        generatedImage: action.payload.generatedImage,
        metadata: action.payload.metadata,
        imageId: action.payload.id
      };
      
    case ACTION_TYPES.RESET_APP:
      return initialState;
    
    default:
      return state;
  }
}
