import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function ImageGenerator({ onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const data = await api.generateImage(prompt);
      setResult(data);
      onImageGenerated(data.imageData);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create an AI Image</h2>
        <p className="text-gray-600">Describe the image you want to generate</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border rounded-lg p-3 h-32"
            placeholder="Describe the image you want to create..."
            disabled={loading}
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading || !prompt.trim()}
          >
            {loading ? <LoadingSpinner /> : 'Generate Image'}
          </button>
        </div>
      </form>

      {result && result.text && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">AI Description:</h3>
          <p className="text-gray-700">{result.text}</p>
        </div>
      )}

      {result && result.imageData && (
        <div className="mt-4 flex justify-center">
          <div className="border p-2 rounded-lg shadow-md">
            <img 
              src={`data:image/jpeg;base64,${result.imageData}`} 
              alt="Generated" 
              className="max-w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;