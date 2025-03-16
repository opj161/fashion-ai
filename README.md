# AI Fashion Model Generator

Transform clothing product photos into professional fashion model images using AI. Perfect for e-commerce stores and fashion retailers.

![AI Fashion App](https://collab.refashion.cc/preview.jpg)

## Features

- 👕 Upload clothing item photos
- 👗 Generate fashion model images with your products
- 👜 Customize model gender, background, and photography style
- 🖼️ Edit and fine-tune generated images
- 🌓 Dark/light mode support
- 🚀 Easy one-click installation

## Deployment Options

### Option 1: Docker Hub Installation (Recommended)

The easiest way to deploy is using our pre-built Docker images:

1. Create a project directory and enter it:
```bash
mkdir fashion-ai && cd fashion-ai
```

2. Create a docker-compose.yml file:
```bash
curl -O https://raw.githubusercontent.com/jayrom23/fashion-ai/main/docker-compose.prod.yml
```

3. Create a .env file with your Gemini API key:
```bash
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
echo "HOST_IP=localhost" >> .env
```

4. Start the application:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

5. Access the application at http://localhost:8080

### Option 2: One-Command Installation Script

Or use our installation script which guides you through setup:

```bash
curl -sL https://raw.githubusercontent.com/jayrom23/fashion-ai/main/install.sh | bash
```

### Option 3: For Unraid Users

1. Go to the "Apps" tab in your Unraid dashboard
2. Click "Add Container"
3. Add two containers:

   **Backend Container:**
   - Repository: `jay2323/fashion-ai-backend:latest`
   - Name: `fashion-ai-backend`
   - Port: `5002:5002`
   - Environment Variables:
     - `GEMINI_API_KEY_01=your_gemini_api_key_here`
     - `HOST=0.0.0.0`
     - `PORT=5002`
     - `DEBUG=false`
     - `ALLOWED_ORIGINS=http://your_unraid_ip:8080`

   **Frontend Container:**
   - Repository: `jay2323/fashion-ai-frontend:latest`
   - Name: `fashion-ai-frontend`
   - Port: `8080:80`

## Configuration

You can configure the application by editing the .env file:

| Variable | Description | Default |
|----------|-------------|---------|
| GEMINI_API_KEY | Your Gemini API key (required) | - |
| HOST_IP | Your server's IP address | localhost |
| BACKEND_PORT | Backend API port | 5002 |
| FRONTEND_PORT | Frontend web port | 8080 |
| DEBUG | Enable debug mode | false |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:8080 |

## Usage Instructions

1. **Upload** - Upload your clothing item photo
   - Use high-quality product photos
   - Images with plain backgrounds work best
   - For best results, use photos where the item is displayed flat or on a mannequin

2. **Generate** - Create a fashion model image
   - Select a template style
   - Customize gender, background, and photography style
   - Generate the model image (takes 15-30 seconds)

3. **Edit** - Fine-tune your image
   - Use quick edit options or custom instructions
   - View your edit history
   - Download the final image

## Troubleshooting

**Image generation fails:**
- Ensure your Gemini API key is valid
- Check your internet connection
- Try a different template or settings

**Cannot access the web interface:**
- Verify the containers are running: `docker-compose ps`
- Check the logs: `docker-compose logs`
- Make sure ports 5002 and 8080 are not being used by other services

**CORS errors in browser console:**
- Add the frontend URL to ALLOWED_ORIGINS in the .env file
- Restart the containers after making changes

## Development Setup

For local development:

```bash
# Clone the repository
git clone https://github.com/jayrom23/fashion-ai.git
cd fashion-ai

# Install backend dependencies
pip install -r requirements.txt

# Run backend
python app.py

# In a separate terminal, install frontend dependencies
cd ai-photo-editor-frontend
npm install

# Run frontend development server
npm run dev
```

## License

MIT License