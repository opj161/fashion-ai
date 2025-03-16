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
  }
};

export default api;