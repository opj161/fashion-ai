# AI Photo Editor Backend

This is the backend server for the AI Photo Editor app. It handles API calls to the Gemini API for image generation and editing.

## Features

- Image generation endpoint
- Image editing endpoint
- Secure API key management
- Error handling

## Prerequisites

- Python 3.9+
- pip (Python package manager)

## Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Configure environment variables:

Either use the provided .env file or set your Gemini API key as an environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

## Running the Server

Development mode:

```bash
python app.py
```

Production mode (using gunicorn):

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Deployment to Render

This application includes configuration for easy deployment to [Render](https://render.com).

### Setup Instructions

1. Create a new account or log in to Render.com

2. From the Render dashboard, click on the `New +` button and select `Blueprint`

3. Connect your GitHub repository that contains this backend code

4. Render will automatically detect the `render.yaml` configuration

5. Add your environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key for content safety checks
   - `GEMINI_API_KEY_01`: Your primary Gemini API key
   - `ALLOWED_ORIGINS`: The URL of your frontend application (if hosted separately)

6. Click `Apply` to start the deployment

### Manual Deployment (Alternative)

If you prefer to manually deploy without using Blueprints:

1. From the Render dashboard, click on the `New +` button and select `Web Service`

2. Connect your GitHub repository

3. Configure your web service with the following settings:
   - **Name**: ai-photo-editor-backend (or your preferred name)
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   
4. Add the environment variables listed above

5. Click `Create Web Service`

### Security Notes

⚠️ **Important**: Never commit your `.env` file containing actual API keys to version control. Use the provided `.env.example` as a template and set up environment variables in Render's dashboard.

### Handling Rate Limits

The app is configured to use multiple Gemini API keys in rotation. You can add additional keys through Render's environment variables (GEMINI_API_KEY_02, GEMINI_API_KEY_03, etc.).


## API Endpoints

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Response**: `{"status": "ok", "message": "Backend server is running"}`

### Generate Image
- **URL**: `/api/generate-image`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "prompt": "A description of the image to generate"
  }
  ```
- **Response**:
  ```json
  {
    "text": "Description of the generated image",
    "imageData": "base64-encoded image data"
  }
  ```

### Edit Image
- **URL**: `/api/edit-image`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "prompt": "A description of the edit to make",
    "imageData": "base64-encoded image data"
  }
  ```
- **Response**:
  ```json
  {
    "text": "Description of the edited image",
    "imageData": "base64-encoded image data"
  }
  ```
