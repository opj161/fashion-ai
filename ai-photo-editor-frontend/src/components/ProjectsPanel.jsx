import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import projectService from '../services/projectService';

function ProjectsPanel({ onLoadProject }) {
  const [projects, setProjects] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = () => {
    const allProjects = projectService.getProjects();
    setProjects(allProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  };
  
  const handleExport = (id, event) => {
    event.stopPropagation();
    const url = projectService.exportProject(id);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `fashion-project-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Project exported successfully');
    }
  };
  
  const handleDelete = (id, event) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      projectService.deleteProject(id);
      loadProjects();
      toast.success('Project deleted successfully');
    }
  };
  
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = projectService.importProject(e.target.result);
        if (success) {
          loadProjects();
          toast.success('Project imported successfully');
        } else {
          toast.error('Failed to import project');
        }
      } catch (error) {
        toast.error('Invalid project file');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 bg-primary-600 dark:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors z-20"
        aria-label="Projects"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>
      
      {showPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 h-full overflow-y-auto shadow-lg animate-slide-in-right">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Projects</h2>
              <button 
                onClick={() => setShowPanel(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {/* Import/New buttons */}
              <div className="flex gap-2 mb-4">
                <label className="flex-1 cursor-pointer">
                  <div className="py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <span className="text-gray-800 dark:text-gray-200">Import Project</span>
                  </div>
                  <input 
                    type="file" 
                    accept="application/json" 
                    onChange={handleImport} 
                    className="hidden" 
                  />
                </label>
              </div>
              
              {/* Project list */}
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map(project => (
                    <div 
                      key={project.id}
                      onClick={() => {
                        onLoadProject(project);
                        setShowPanel(false);
                      }}
                      className="border dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex">
                        {/* Generated image thumbnail */}
                        <div className="w-32 h-24 bg-gray-100 dark:bg-gray-900 overflow-hidden flex items-center justify-center">
                          {project.generatedImage ? (
                            <img 
                              src={`data:image/jpeg;base64,${project.generatedImage}`}
                              alt="Fashion model" 
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-gray-600 text-xl">No Image</div>
                          )}
                        </div>
                        
                        {/* Project details */}
                        <div className="flex-1 p-3">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900 dark:text-white">{project.name || `Project ${project.id.slice(-4)}`}</h3>
                            <span className="text-xs text-gray-500">{new Date(project.updatedAt).toLocaleDateString()}</span>
                          </div>
                          
                          {project.tags && project.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {project.tags.map((tag, i) => (
                                <span 
                                  key={i}
                                  className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="mt-2 flex justify-end gap-2">
                            <button 
                              onClick={(e) => handleExport(project.id, e)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => handleDelete(project.id, e)}
                              className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📂</div>
                  <p>No saved projects yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPanel;