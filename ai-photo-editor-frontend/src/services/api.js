import axios from 'axios';

// Use runtime config with fallback to environment variable and finally to default
const API_URL = window.RUNTIME_CONFIG?.API_URL || 
                import.meta.env.VITE_API_URL || 
                'http://localhost:5002';

console.log('Using API URL:', API_URL); // Add this for debugging

const api = {
  generateImage: async (prompt) => {
    try {
      const response = await axios.post(`${API_URL}/api/generate-image`, { prompt });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to generate image" };
    }
  },
  
  editImage: async (prompt, imageData) => {
    try {
      const response = await axios.post(`${API_URL}/api/edit-image`, { prompt, imageData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to edit image" };
    }
  }
};

export default api;