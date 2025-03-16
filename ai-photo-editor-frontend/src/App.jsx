import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import FashionModelPreview from './components/FashionModelPreview';
import GeneratedImageView from './components/GeneratedImageView'; // We'll create this component

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageMetadata, setGeneratedImageMetadata] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageUploaded = (imageData) => {
    setUploadedImage(imageData);
    setCurrentStep(2);
  };

  const handleImageGenerated = (imageData, metadata) => {
    setGeneratedImage(imageData);
    setGeneratedImageMetadata(metadata);
    setCurrentStep(3);
  };

  const handleBackToUpload = () => {
    setCurrentStep(1);
    setGeneratedImage(null);
    setGeneratedImageMetadata(null);
  };

  const handleBackToGenerate = () => {
    setCurrentStep(2);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Toaster position="top-center" />
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
          <Routes>
            <Route path="/" element={
              <div className="space-y-8">
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
        
        <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>AI Fashion Model Creator © {new Date().getFullYear()}</p>
            <p className="mt-1">Create professional fashion photography for your e-commerce store</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;