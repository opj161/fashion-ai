import axios from 'axios';

// Use relative paths - will be proxied through nginx
const api = {
  generateImage: async (prompt) => {
    try {
      const response = await axios.post('/api/generate-image', { prompt });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to generate image" };
    }
  },
  
  editImage: async (prompt, imageData) => {
    try {
      const response = await axios.post('/api/edit-image', { prompt, imageData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to edit image" };
    }
  },
  
  // Add cloud storage API methods
  saveImage: async (imageData, metadata = {}) => {
    try {
      const response = await axios.post('/api/images/save', { 
        imageData, 
        metadata 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to save image" };
    }
  },
  
  getImage: async (imageId) => {
    try {
      const response = await axios.get(`/api/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to retrieve image" };
    }
  },
  
  updateImageMetadata: async (imageId, metadata) => {
    try {
      const response = await axios.put(`/api/images/${imageId}/metadata`, { metadata });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update image metadata" };
    }
  },
  
  listImages: async (limit = 50, offset = 0, tag = null) => {
    try {
      let url = `/api/images?limit=${limit}&offset=${offset}`;
      if (tag) url += `&tag=${tag}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to list images" };
    }
  }
};

export default api;