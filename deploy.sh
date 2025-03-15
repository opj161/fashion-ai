#!/bin/bash
set -e

# Configuration
DOCKER_USERNAME="jay2323"  # Replace with your Docker Hub username
VERSION="1.0.0"            # Version tag

# Check if logged in to Docker Hub (more reliable method)
echo "Checking Docker Hub authentication..."
if ! docker system info --format '{{.RegistryConfig.IndexConfigs}}' | grep -q 'docker.io'; then
    echo "Not logged in to Docker Hub. Please run 'docker login' first."
    exit 1
fi
echo "Docker Hub authentication confirmed."

# Build and push backend
echo "Building backend image..."
docker build -t $DOCKER_USERNAME/fashion-ai-backend:$VERSION -t $DOCKER_USERNAME/fashion-ai-backend:latest .

echo "Pushing backend image to Docker Hub..."
docker push $DOCKER_USERNAME/fashion-ai-backend:$VERSION
docker push $DOCKER_USERNAME/fashion-ai-backend:latest

# Build and push frontend
echo "Building frontend image..."
cd ai-photo-editor-frontend
docker build -t $DOCKER_USERNAME/fashion-ai-frontend:$VERSION -t $DOCKER_USERNAME/fashion-ai-frontend:latest .

echo "Pushing frontend image to Docker Hub..."
docker push $DOCKER_USERNAME/fashion-ai-frontend:$VERSION
docker push $DOCKER_USERNAME/fashion-ai-frontend:latest

# Create and push a docker-compose file for easy deployment
cd ..
echo "Creating deployment docker-compose.yml..."

cat > docker-compose.prod.yml << EOL
version: '3.8'

services:
  backend:
    image: ${DOCKER_USERNAME}/fashion-ai-backend:latest
    container_name: fashion-ai-backend
    restart: unless-stopped
    environment:
      - GEMINI_API_KEY_01=\${GEMINI_API_KEY:?GEMINI_API_KEY is required}
      - HOST=0.0.0.0
      - PORT=\${BACKEND_PORT:-5002}
      - DEBUG=\${DEBUG:-false}
      - ALLOWED_ORIGINS=\${ALLOWED_ORIGINS:-http://\${HOST_IP:-localhost}:\${FRONTEND_PORT:-8080}}
    ports:
      - "\${BACKEND_PORT:-5002}:\${BACKEND_PORT:-5002}"
    networks:
      - fashion-ai-network

  frontend:
    image: ${DOCKER_USERNAME}/fashion-ai-frontend:latest
    container_name: fashion-ai-frontend
    restart: unless-stopped
    ports:
      - "\${FRONTEND_PORT:-8080}:80"
    depends_on:
      - backend
    networks:
      - fashion-ai-network

networks:
  fashion-ai-network:
    driver: bridge
EOL

# Create installation script for users
echo "Creating installation script..."

cat > install.sh << EOL
#!/bin/bash
set -e

echo "==============================="
echo "AI Fashion Model App - Installer"
echo "==============================="
echo

# Check for docker and docker-compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating environment configuration file..."
    
    # Get the Gemini API key
    read -p "Enter your Gemini API key: " GEMINI_API_KEY
    
    # Try to detect server IP address
    HOST_IP=\$(hostname -I | awk '{print \$1}')
    
    # Create .env file
    cat > .env << EOF
# Required: Your Gemini API key
GEMINI_API_KEY=\$GEMINI_API_KEY

# Server configuration
HOST_IP=\$HOST_IP        # Your server's IP address
BACKEND_PORT=5002       # Backend API port
FRONTEND_PORT=8080      # Frontend web port
DEBUG=false             # Set to true for debug mode
EOF

    echo "✅ Configuration file created!"
else
    echo "✅ Configuration file already exists."
fi

# Start the application
echo "Starting AI Fashion Model app..."
docker-compose -f docker-compose.prod.yml up -d

# Check if services are running
echo "Checking if services are running..."
sleep 5

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ AI Fashion Model app is now running!"
    echo
    source .env
    echo "🌐 Access the app at: http://\${HOST_IP:-localhost}:\${FRONTEND_PORT:-8080}"
    echo
    echo "To stop the app: docker-compose -f docker-compose.prod.yml down"
    echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
else
    echo "❌ Something went wrong. Check the logs with: docker-compose -f docker-compose.prod.yml logs"
fi
EOL

chmod +x install.sh

# Create README.md with installation instructions
echo "Creating README.md..."

cat > README.user.md << EOL
# AI Fashion Model Generator

Transform clothing product photos into professional fashion model images using AI. Perfect for e-commerce stores and fashion retailers.

## Quick Start

The easiest way to get started is using our installation script:

\`\`\`bash
curl -sL https://raw.githubusercontent.com/${DOCKER_USERNAME}/fashion-ai/main/install.sh | bash
\`\`\`

Then open http://localhost:8080 in your browser (or use your server's IP address).

## Manual Installation

1. Install Docker and Docker Compose
2. Create a directory for the application:
   \`\`\`bash
   mkdir fashion-ai && cd fashion-ai
   \`\`\`
3. Download the docker-compose.yml file:
   \`\`\`bash
   curl -o docker-compose.yml https://raw.githubusercontent.com/${DOCKER_USERNAME}/fashion-ai/main/docker-compose.prod.yml
   \`\`\`
4. Create a .env file with your configuration:
   \`\`\`bash
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   echo "HOST_IP=localhost" >> .env
   \`\`\`
5. Start the application:
   \`\`\`bash
   docker-compose up -d
   \`\`\`
6. Access it at http://localhost:8080

## Configuration

You can configure the application by editing the \`.env\` file:

| Variable | Description | Default |
|----------|-------------|---------|
| GEMINI_API_KEY | Your Gemini API key (required) | - |
| HOST_IP | Your server's IP address | localhost |
| BACKEND_PORT | Backend API port | 5002 |
| FRONTEND_PORT | Frontend web port | 8080 |
| DEBUG | Enable debug mode | false |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:8080 |
EOL

echo "All images built and pushed successfully!"
echo "Deployment files created: docker-compose.prod.yml, install.sh, and README.user.md"
echo "You can now share these files or host them in a GitHub repository for easy deployment."