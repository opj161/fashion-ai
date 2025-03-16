import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

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
  },
  
  generateFashionModel: async (prompt, clothingImageData) => {
    // This is essentially an alias to editImage for semantic clarity
    return api.editImage(prompt, clothingImageData);
  }
};

export default api;