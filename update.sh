#!/bin/bash
set -e

echo "==============================="
echo "AI Fashion Model App - Updater"
echo "==============================="

# Configuration
DOCKER_USERNAME="jay2323"
VERSION=$(date +"%Y%m%d.%H%M")
BACKEND_DIR="."
FRONTEND_DIR="./ai-photo-editor-frontend"

# Check if logged in to Docker Hub
echo "Checking Docker Hub authentication..."
if ! docker info | grep -q 'Username'; then
    echo "Not logged in to Docker Hub. Please run 'docker login' first."
    exit 1
fi

# Stop running containers
echo "Stopping running containers (if any)..."
docker-compose down 2>/dev/null || true

# Build and push backend
echo "Building backend image..."
docker build -t $DOCKER_USERNAME/fashion-ai-backend:$VERSION -t $DOCKER_USERNAME/fashion-ai-backend:latest .
echo "Pushing backend images..."
docker push $DOCKER_USERNAME/fashion-ai-backend:$VERSION
docker push $DOCKER_USERNAME/fashion-ai-backend:latest

# Build and push frontend
echo "Building frontend image..."
cd $FRONTEND_DIR
docker build -t $DOCKER_USERNAME/fashion-ai-frontend:$VERSION -t $DOCKER_USERNAME/fashion-ai-frontend:latest .
echo "Pushing frontend images..."
docker push $DOCKER_USERNAME/fashion-ai-frontend:$VERSION
docker push $DOCKER_USERNAME/fashion-ai-frontend:latest

# Return to project root
cd ..

# Update docker-compose files
for file in docker-compose.yml docker-compose.prod.yml; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    cp $file $file.bak
    sed -i "s|image: $DOCKER_USERNAME/fashion-ai-backend:.*|image: $DOCKER_USERNAME/fashion-ai-backend:$VERSION|" $file
    sed -i "s|image: $DOCKER_USERNAME/fashion-ai-frontend:.*|image: $DOCKER_USERNAME/fashion-ai-frontend:$VERSION|" $file
  fi
done

echo
echo "🎉 Update completed successfully!"
echo "New version tag: $VERSION"
echo
echo "To deploy locally:"
echo "docker-compose up -d"
echo
echo "To deploy on server:"
echo "docker-compose pull && docker-compose up -d"

# Deploy locally if requested
read -p "Deploy locally now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Starting local deployment..."
  docker-compose up -d
fi