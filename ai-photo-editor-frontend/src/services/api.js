/**
 * API service for interacting with the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }
  return response.json();
};

const api = {
  // Generate an image based on a prompt
  generateImage: async (prompt) => {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return handleResponse(response);
  },

  // Edit an existing image
  editImage: async (prompt, imageData) => {
    const response = await fetch(`${API_URL}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, image: imageData })
    });
    return handleResponse(response);
  },

  // Save an image to the cloud storage
  saveImage: async (imageData, metadata) => {
    const response = await fetch(`${API_URL}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: imageData, 
        metadata 
      })
    });
    return handleResponse(response);
  },

  // Get an image by ID
  getImage: async (id) => {
    const response = await fetch(`${API_URL}/images/${id}`);
    return handleResponse(response);
  },

  // List all images with optional filtering
  listImages: async (limit = 10, offset = 0, tag = null) => {
    let url = `${API_URL}/images?limit=${limit}&offset=${offset}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Update image metadata (e.g., update tags)
  updateImageMetadata: async (id, metadata) => {
    const response = await fetch(`${API_URL}/images/${id}/metadata`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata })
    });
    return handleResponse(response);
  }
};

export default api;