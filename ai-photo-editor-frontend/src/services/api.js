import axios from 'axios';

// Use runtime config with fallback to environment variable and finally to default
const API_URL = window.RUNTIME_CONFIG?.API_URL || 
                import.meta.env.VITE_API_URL || 
                'http://localhost:5002';

const api = {
  // Rest of your code remains unchanged
  generateImage: async (prompt) => {
    try {
      const response = await axios.post(`${API_URL}/api/generate-image`, { prompt });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to generate image" };
    }
  },
  
  // Other methods remain unchanged
};

export default api;