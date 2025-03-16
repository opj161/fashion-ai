import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import FashionModelPreview from './components/FashionModelPreview';
import ImageEditor from './components/ImageEditor';
import ProjectsPanel from './components/ProjectsPanel';
import projectService from './services/projectService';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [activeSection, setActiveSection] = useState('upload');
  const [currentProject, setCurrentProject] = useState({
    name: '',
    templateSettings: null,
    tags: [],
    editHistory: []
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const previewRef = useRef(null);
  const editorRef = useRef(null);
  
  // Dark mode setup
  useEffect(() => {
    // Check for preferred theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const handleImageUploaded = (imageData) => {
    setUploadedImage(imageData);
    setActiveSection('generate');
    setCurrentProject(prev => ({
      ...prev,
      originalImage: imageData,
      updatedAt: new Date().toISOString()
    }));
    setUnsavedChanges(true);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFashionGenerated = (imageData, templateSettings) => {
    setGeneratedImage(imageData);
    setActiveSection('edit');
    setCurrentProject(prev => ({
      ...prev,
      generatedImage: imageData,
      templateSettings,
      editHistory: [{ image: imageData, prompt: 'Original Generation' }],
      updatedAt: new Date().toISOString()
    }));
    setUnsavedChanges(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Update the handleSaveProject function

const handleSaveProject = async () => {
  // Show prompt for project name if not set
  let projectName = currentProject.name;
  if (!projectName) {
    projectName = prompt('Enter a name for your project:', `Fashion Project ${new Date().toLocaleDateString()}`);
    if (!projectName) return; // User cancelled
  }

  // Show saving indicator
  toast.loading('Saving project...');
  
  const projectToSave = {
    ...currentProject,
    name: projectName,
    id: currentProject.id || Date.now().toString()
  };

  // Use the enhanced save with cloud storage
  const success = await projectService.saveProjectWithCloudStorage(projectToSave);
  
  // Dismiss loading toast
  toast.dismiss();
  
  if (success) {
    setCurrentProject(projectToSave);
    setUnsavedChanges(false);
    toast.success('Project saved successfully!');
  } else {
    toast.error('Failed to save project');
  }
};

  const handleLoadProject = (project) => {
    if (unsavedChanges && !confirm('You have unsaved changes. Load another project anyway?')) {
      return;
    }
    
    setCurrentProject(project);
    setUploadedImage(project.originalImage);
    setGeneratedImage(project.generatedImage);
    
    // Determine which step to activate based on available data
    if (project.generatedImage) {
      setActiveSection('edit');
      setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (project.originalImage) {
      setActiveSection('generate');
      setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      setActiveSection('upload');
    }
    
    setUnsavedChanges(false);
    toast.success(`Loaded project: ${project.name || 'Untitled'}`);
  };

  const handleImageEdited = (imageData, editHistory) => {
    setCurrentProject(prev => ({
      ...prev,
      generatedImage: imageData,
      editHistory: editHistory || prev.editHistory,
      updatedAt: new Date().toISOString()
    }));
    setUnsavedChanges(true);
  };

  const handleReset = () => {
    if (unsavedChanges && !confirm('You have unsaved changes. Start over anyway?')) {
      return;
    }
    
    setUploadedImage(null);
    setGeneratedImage(null);
    setActiveSection('upload');
    setCurrentProject({
      name: '',
      templateSettings: null,
      tags: [],
      editHistory: []
    });
    setUnsavedChanges(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header section with logo and steps */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-primary-400 to-indigo-600 
                  dark:from-primary-600 dark:to-indigo-800 rounded-full p-3 shadow-lg">
              <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V3M5.5 8.5L4 7M18.5 8.5L20 7M17 17.8L17.8 21L12 19L6.2 21L7 17.8M7 15C7 11.134 9.13401 8 12 8C14.866 8 17 11.134 17 15H7Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Collab</h1>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Virtual Fashion Model</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Transform your product photos into professional fashion model images 
            with AI. Perfect for e-commerce stores and fashion retailers.
          </p>
        </div>

        {/* Project toolbar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Project name..."
              value={currentProject.name}
              onChange={(e) => {
                setCurrentProject(prev => ({ ...prev, name: e.target.value }));
                setUnsavedChanges(true);
              }}
              className="border dark:border-gray-700 rounded-l px-3 py-2 bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 
                        focus:ring-primary-500"
            />
            <button
              onClick={handleSaveProject}
              disabled={!uploadedImage}
              className={`px-4 py-2 rounded-r border-y border-r ${
                unsavedChanges 
                  ? 'bg-primary-600 dark:bg-primary-700 text-white border-primary-600 dark:border-primary-700' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              } ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700 dark:hover:bg-primary-600'}`}
            >
              {unsavedChanges ? 'Save Changes' : 'Saved'}
            </button>
            
            {/* Display tags if any */}
            {currentProject.tags && currentProject.tags.length > 0 && (
              <div className="ml-3 flex flex-wrap gap-1">
                {currentProject.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 
                                         px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed floating progress indicator */}
        <div className="fixed top-20 right-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg 
                        border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="space-y-2 text-sm">
            <div className={`flex items-center ${activeSection === 'upload' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs ${
                activeSection === 'upload' 
                  ? 'bg-primary-600 dark:bg-primary-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>1</div>
              Upload
            </div>
            <div className={`flex items-center ${activeSection === 'generate' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs ${
                activeSection === 'generate' 
                  ? 'bg-primary-600 dark:bg-primary-500 text-white' 
                  : uploadedImage ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
              }`}>2</div>
              Generate
            </div>
            <div className={`flex items-center ${activeSection === 'edit' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs ${
                activeSection === 'edit' 
                  ? 'bg-primary-600 dark:bg-primary-500 text-white' 
                  : generatedImage ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
              }`}>3</div>
              Edit
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <button
              onClick={handleSaveProject}
              disabled={!uploadedImage}
              className={`w-full text-xs py-1 px-2 rounded ${
                unsavedChanges && uploadedImage
                  ? 'bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } transition-colors duration-200 ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {unsavedChanges ? 'Save' : 'Saved'}
            </button>
            {(uploadedImage || generatedImage) && (
              <button
                onClick={handleReset}
                className="w-full text-xs py-1 px-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                        dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Main content sections */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Section 1: Upload */}
          <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 
                               ${activeSection === 'upload' ? 'border-primary-600 dark:border-primary-500' : 'border-transparent'} 
                               transition-all duration-300`}>
            <div className="flex items-center mb-4">
              <div className={`${
                activeSection === 'upload' 
                  ? 'bg-primary-600 dark:bg-primary-500' 
                  : 'bg-gray-400 dark:bg-gray-600'
                } text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 transition-colors duration-300`}>1</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Your Clothing Item</h2>
            </div>
            <ImageUploader 
              onImageUploaded={handleImageUploaded} 
              isActive={activeSection === 'upload'}
              onActivate={() => setActiveSection('upload')}
              initialImage={uploadedImage}
            />
          </section>

          {/* Section 2: Generate */}
          <section 
            ref={previewRef}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 
                        ${activeSection === 'generate' ? 'border-primary-600 dark:border-primary-500' : 'border-transparent'} 
                        ${!uploadedImage ? 'opacity-50 pointer-events-none' : ''} transition-all duration-300`}
          >
            <div className="flex items-center mb-4">
              <div className={`${
                activeSection === 'generate' 
                  ? 'bg-primary-600 dark:bg-primary-500' 
                  : 'bg-gray-400 dark:bg-gray-600'
                } text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 transition-colors duration-300`}>2</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Your Fashion Model</h2>
              {uploadedImage && activeSection !== 'generate' && (
                <button 
                  onClick={() => setActiveSection('generate')}
                  className="ml-auto text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 
                            text-sm bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  Return to this step
                </button>
              )}
            </div>
            {uploadedImage ? (
              <FashionModelPreview 
                clothingImage={uploadedImage}
                onImageGenerated={handleFashionGenerated}
                isActive={activeSection === 'generate'}
                initialSettings={currentProject.templateSettings}
              />
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="mb-2 text-4xl">👕</div>
                <p>Upload a clothing item to continue</p>
              </div>
            )}
          </section>

          {/* Section 3: Edit */}
          <section 
            ref={editorRef}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 
                        ${activeSection === 'edit' ? 'border-primary-600 dark:border-primary-500' : 'border-transparent'} 
                        ${!generatedImage ? 'opacity-50 pointer-events-none' : ''} transition-all duration-300`}
          >
            <div className="flex items-center mb-4">
              <div className={`${
                activeSection === 'edit' 
                  ? 'bg-primary-600 dark:bg-primary-500' 
                  : 'bg-gray-400 dark:bg-gray-600'
                } text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 transition-colors duration-300`}>3</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fine-tune Your Image</h2>
              {generatedImage && activeSection !== 'edit' && (
                <button 
                  onClick={() => setActiveSection('edit')}
                  className="ml-auto text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 
                            text-sm bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  Return to this step
                </button>
              )}
            </div>
            {generatedImage ? (
              <ImageEditor 
                initialImage={generatedImage} 
                isActive={activeSection === 'edit'}
                initialHistory={currentProject.editHistory}
                onImageEdited={handleImageEdited}
              />
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="mb-2 text-4xl">✨</div>
                <p>Generate a fashion model image first</p>
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Projects Panel */}
      <ProjectsPanel onLoadProject={handleLoadProject} />
      
      <Footer />
    </div>
  );
}

export default App;