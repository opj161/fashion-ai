import api from './api';

const STORAGE_KEY = 'fashion-ai-projects';

// Project structure:
// {
//   id: string,
//   name: string,
//   createdAt: Date,
//   updatedAt: Date,
//   originalImage: string (base64),
//   generatedImage: string (base64),
//   editHistory: Array,
//   templateSettings: Object,
//   tags: Array
// }

const projectService = {
  getProjects() {
    try {
      const projects = localStorage.getItem(STORAGE_KEY);
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error retrieving projects:', error);
      return [];
    }
  },

  saveProject(project) {
    try {
      const projects = this.getProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      // Update or add the project
      if (existingIndex >= 0) {
        projects[existingIndex] = {
          ...project,
          updatedAt: new Date().toISOString()
        };
      } else {
        projects.push({
          ...project,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  },

  deleteProject(id) {
    try {
      const projects = this.getProjects().filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },

  exportProject(id) {
    const project = this.getProjects().find(p => p.id === id);
    if (!project) return null;
    
    // Create a downloadable JSON file
    const blob = new Blob([JSON.stringify(project)], { type: 'application/json' });
    return URL.createObjectURL(blob);
  },

  importProject(jsonData) {
    try {
      const project = JSON.parse(jsonData);
      return this.saveProject(project);
    } catch (error) {
      console.error('Error importing project:', error);
      return false;
    }
  },

  // New functions for cloud storage
  async saveImageToCloud(imageData, metadata = {}) {
    try {
      const response = await api.saveImage(imageData, metadata);
      return response.id;
    } catch (error) {
      console.error('Error saving image to cloud:', error);
      return null;
    }
  },

  async getImageFromCloud(imageId) {
    try {
      const response = await api.getImage(imageId);
      return response;
    } catch (error) {
      console.error('Error getting image from cloud:', error);
      return null;
    }
  },

  // Enhanced save with cloud storage
  async saveProjectWithCloudStorage(project) {
    try {
      // First, save images to cloud storage if they're not already
      let updatedProject = { ...project };
      
      // If original image exists and doesn't have a cloud ID
      if (project.originalImage && !project.originalImageId) {
        const imageId = await this.saveImageToCloud(project.originalImage, { 
          type: 'original',
          projectName: project.name || 'Untitled Project' 
        });
        
        if (imageId) {
          updatedProject.originalImageId = imageId;
        }
      }
      
      // If generated image exists and doesn't have a cloud ID
      if (project.generatedImage && !project.generatedImageId) {
        const imageId = await this.saveImageToCloud(project.generatedImage, { 
          type: 'generated',
          projectName: project.name || 'Untitled Project',
          templateSettings: project.templateSettings
        });
        
        if (imageId) {
          updatedProject.generatedImageId = imageId;
        }
      }
      
      // Save to local storage
      return this.saveProject(updatedProject);
    } catch (error) {
      console.error('Error saving project with cloud storage:', error);
      // Fallback to regular save
      return this.saveProject(project);
    }
  }
};

export default projectService;