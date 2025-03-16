#!/bin/bash
set -e

echo "==============================="
echo "AI Fashion Model App - Updater"
echo "==============================="
echo

# Configuration
DOCKER_USERNAME="jay2323"  # Your Docker Hub username
VERSION=$(date +"%Y%m%d.%H%M")  # Version tag based on current date/time
BACKEND_DIR="."
FRONTEND_DIR="./ai-photo-editor-frontend"

# Check if logged in to Docker Hub
echo "Checking Docker Hub authentication..."
if ! docker system info --format '{{.RegistryConfig.IndexConfigs}}' | grep -q 'docker.io'; then
    echo "Not logged in to Docker Hub. Please run 'docker login' first."
    exit 1
fi
echo "✅ Docker Hub authentication confirmed"

# Fix: Improve git status check to avoid false positives
if command -v git &> /dev/null && [ -d .git ]; then
    # Only count actual changes, ignore line ending and whitespace differences
    GIT_STATUS=$(git status --porcelain=v1 --untracked-files=no --ignore-submodules=all | grep -v "^$$")
    if [ -n "$GIT_STATUS" ]; then
        echo "⚠️ You have uncommitted changes. Consider committing before updating images."
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ Git repository is clean"
    fi
fi

# Stop running containers to avoid conflicts
echo "Stopping running containers (if any)..."
docker-compose down 2>/dev/null || true
echo "✅ Environment prepared"

# Build and push backend
echo "Building backend image..."
cd $BACKEND_DIR
docker build -t $DOCKER_USERNAME/fashion-ai-backend:$VERSION -t $DOCKER_USERNAME/fashion-ai-backend:latest .
echo "✅ Backend image built"

echo "Pushing backend images to Docker Hub..."
docker push $DOCKER_USERNAME/fashion-ai-backend:$VERSION
docker push $DOCKER_USERNAME/fashion-ai-backend:latest
echo "✅ Backend images pushed"

# Build and push frontend
echo "Building frontend image..."
cd $FRONTEND_DIR
docker build -t $DOCKER_USERNAME/fashion-ai-frontend:$VERSION -t $DOCKER_USERNAME/fashion-ai-frontend:latest .
echo "✅ Frontend image built"

echo "Pushing frontend images to Docker Hub..."
docker push $DOCKER_USERNAME/fashion-ai-frontend:$VERSION
docker push $DOCKER_USERNAME/fashion-ai-frontend:latest
echo "✅ Frontend images pushed"

# Return to the project root
cd ..

# Update the image tags in docker-compose.yml if it exists
if [ -f "docker-compose.yml" ]; then
    echo "Updating docker-compose.yml with new image tags..."
    
    # Backup the original file
    cp docker-compose.yml docker-compose.yml.bak
    
    # Update the image tags using platform-independent sed (works in both Linux and WSL)
    sed -i.bak "s|image: $DOCKER_USERNAME/fashion-ai-backend:.*|image: $DOCKER_USERNAME/fashion-ai-backend:$VERSION|" docker-compose.yml
    sed -i.bak "s|image: $DOCKER_USERNAME/fashion-ai-frontend:.*|image: $DOCKER_USERNAME/fashion-ai-frontend:$VERSION|" docker-compose.yml
    
    # Remove backup files created by sed
    rm -f docker-compose.yml.bak
    echo "✅ docker-compose.yml updated"
fi

# Also update docker-compose.prod.yml if it exists
if [ -f "docker-compose.prod.yml" ]; then
    echo "Updating docker-compose.prod.yml with new image tags..."
    
    # Backup the original file
    cp docker-compose.prod.yml docker-compose.prod.yml.bak
    
    # Update the image tags
    sed -i.bak "s|image: $DOCKER_USERNAME/fashion-ai-backend:.*|image: $DOCKER_USERNAME/fashion-ai-backend:$VERSION|" docker-compose.prod.yml
    sed -i.bak "s|image: $DOCKER_USERNAME/fashion-ai-frontend:.*|image: $DOCKER_USERNAME/fashion-ai-frontend:$VERSION|" docker-compose.prod.yml
    
    # Remove backup files created by sed
    rm -f docker-compose.prod.yml.bak
    echo "✅ docker-compose.prod.yml updated"
fi

echo
echo "🎉 Update completed successfully!"
echo
echo "New version tag: $VERSION"
echo
echo "To deploy locally:"
echo "docker-compose up -d"
echo
echo "To deploy on server, run:"
echo "1. Pull the latest images: docker-compose pull"
echo "2. Start containers: docker-compose up -d"
echo

# Ask if user wants to deploy locally
read -p "Deploy locally now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting local deployment..."
    docker-compose up -d
    echo "✅ Local deployment started"
    echo "Access the app at: http://localhost:${FRONTEND_PORT:-8080}"
fi