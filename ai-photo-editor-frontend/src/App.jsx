import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUpload from './components/ImageUpload';
import FashionModelPreview from './components/FashionModelPreview';
import GeneratedImageView from './components/GeneratedImageView';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageMetadata, setGeneratedImageMetadata] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // New workspace state management
  const [workspaceStates, setWorkspaceStates] = useState([]);
  const [showWorkspacePanel, setShowWorkspacePanel] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);

  // Generate unique ID for workspace states
  const generateStateId = () => `state-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Save current state function
  const saveCurrentState = (customName) => {
    // Only save if we have an uploaded image
    if (!uploadedImage) return;
    
    const newState = {
      id: generateStateId(),
      name: customName || `Version ${workspaceStates.length + 1}`,
      timestamp: new Date(),
      uploadedImage: uploadedImage,
      generatedImage: generatedImage,
      generatedImageMetadata: generatedImageMetadata,
      currentStep: currentStep
    };
    
    setWorkspaceStates(prev => [...prev, newState]);
    setActiveWorkspaceId(newState.id);
    toast.success(`Saved: ${newState.name}`);
  };

  // Restore a saved state
  const restoreState = (state) => {
    if (!state) return;
    
    setUploadedImage(state.uploadedImage);
    setGeneratedImage(state.generatedImage);
    setGeneratedImageMetadata(state.generatedImageMetadata);
    setCurrentStep(state.currentStep);
    setActiveWorkspaceId(state.id);
    toast.success(`Restored: ${state.name}`);
  };
  
  // Handle image upload
  const handleImageUploaded = (imageData) => {
    setUploadedImage(imageData);
    setCurrentStep(2);
  };

  // Handle image generation
  const handleImageGenerated = (imageData, metadata) => {
    setGeneratedImage(imageData);
    setGeneratedImageMetadata(metadata);
    setCurrentStep(3);
    
    // Auto-save after generation
    const autoSaveName = `Generated ${new Date().toLocaleTimeString()}`;
    saveCurrentState(autoSaveName);
  };

  // Navigation functions
  const handleBackToUpload = () => {
    setCurrentStep(1);
  };

  const handleBackToGenerate = () => {
    setCurrentStep(2);
  };

  // Step indicator component
  const StepIndicator = ({ number, label, active, completed, onClick }) => {
    const isClickable = onClick && (completed || active);
    
    return (
      <div 
        className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={isClickable ? onClick : undefined}
      >
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center 
          ${active ? 'bg-primary-600 text-white' : 
            completed ? 'bg-green-500 text-white' : 
            'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
        `}>
          {completed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            number
          )}
        </div>
        <span className={`text-sm mt-1 ${active ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Toaster position="top-center" />
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
          {/* Workspace Panel - New */}
          <div className={`workspace-panel mb-6 ${uploadedImage ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Workspace
                {activeWorkspaceId && <span className="text-sm ml-2 text-gray-500 dark:text-gray-400">
                  ({workspaceStates.find(s => s.id === activeWorkspaceId)?.name || 'Unsaved'})
                </span>}
              </h2>
              <div className="space-x-2">
                <button 
                  onClick={() => setShowWorkspacePanel(!showWorkspacePanel)}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {showWorkspacePanel ? 'Hide History' : 'Show History'}
                </button>
                <button 
                  onClick={() => {
                    const name = prompt('Name this version (optional):');
                    saveCurrentState(name || undefined);
                  }}
                  className="px-3 py-1 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700 rounded hover:bg-primary-100 dark:hover:bg-primary-800/40"
                >
                  Save Version
                </button>
              </div>
            </div>
            
            {/* Workspace History Panel */}
            {showWorkspacePanel && workspaceStates.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 p-4 bg-white dark:bg-gray-800/50 border dark:border-gray-700 rounded-lg">
                {workspaceStates.map((state) => (
                  <div 
                    key={state.id}
                    onClick={() => restoreState(state)}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition hover:shadow-md ${
                      state.id === activeWorkspaceId
                        ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                        : 'hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                      {state.generatedImage ? (
                        <img 
                          src={`data:image/jpeg;base64,${state.generatedImage}`} 
                          alt={state.name}
                          className="w-full h-full object-cover"
                        />
                      ) : state.uploadedImage ? (
                        <img 
                          src={`data:image/jpeg;base64,${state.uploadedImage}`} 
                          alt={state.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No image
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <span className="text-xs text-white">
                          {state.currentStep === 1 ? 'Upload' : state.currentStep === 2 ? 'Generate' : 'Edit'}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {state.name}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent onClick
                            if (confirm(`Delete "${state.name}"?`)) {
                              setWorkspaceStates(prev => prev.filter(s => s.id !== state.id));
                              if (state.id === activeWorkspaceId) {
                                setActiveWorkspaceId(null);
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm3 8a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(state.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Routes>
            <Route path="/" element={
              <div className="space-y-8">
                {/* Step indicators with direct navigation */}
                <div className="flex justify-between items-center">
                  <StepIndicator 
                    number={1} 
                    label="Upload" 
                    active={currentStep === 1}
                    completed={currentStep > 1}
                    onClick={() => {
                      if (uploadedImage) {
                        setCurrentStep(1);
                      }
                    }}
                  />
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                  <StepIndicator 
                    number={2} 
                    label="Generate" 
                    active={currentStep === 2}
                    completed={currentStep > 2}
                    onClick={() => {
                      if (uploadedImage && currentStep >= 2) {
                        setCurrentStep(2);
                      }
                    }}
                  />
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                  <StepIndicator 
                    number={3} 
                    label="Edit/Export" 
                    active={currentStep === 3}
                    completed={false}
                    onClick={() => {
                      if (generatedImage && currentStep >= 3) {
                        setCurrentStep(3);
                      }
                    }}
                  />
                </div>
                
                {/* Step 1: Upload Image */}
                <div className={`${currentStep !== 1 ? 'hidden' : ''}`}>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Step 1: Upload Your Clothing Image
                  </h2>
                  <ImageUpload onImageUploaded={handleImageUploaded} />
                </div>
                
                {/* Step 2: Generate Fashion Model */}
                <div className={`${currentStep !== 2 ? 'hidden' : ''}`}>
                  <div className="flex items-center mb-4">
                    <button 
                      onClick={handleBackToUpload}
                      className="mr-3 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      ← Back to Upload
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Step 2: Generate a Fashion Model
                    </h2>
                  </div>
                  <FashionModelPreview 
                    clothingImage={uploadedImage} 
                    onImageGenerated={handleImageGenerated}
                  />
                </div>
                
                {/* Step 3: View Generated Image */}
                <div className={`${currentStep !== 3 ? 'hidden' : ''}`}>
                  <div className="flex items-center mb-4">
                    <button 
                      onClick={handleBackToGenerate}
                      className="mr-3 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      ← Back to Generation Options
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Your Fashion Model Image
                    </h2>
                  </div>
                  <GeneratedImageView 
                    image={generatedImage} 
                    metadata={generatedImageMetadata} 
                  />
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;