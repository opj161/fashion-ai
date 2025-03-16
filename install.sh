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

# Check for docker-compose (both v1 and v2 syntax)
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating environment configuration file..."
    
    # Get the Gemini API key
    read -p "Enter your Gemini API key: " GEMINI_API_KEY
    
    if [ -z "$GEMINI_API_KEY" ]; then
        echo "❌ API key is required."
        exit 1
    fi
    
    # Create .env file
    cat > .env << EOF
# Required: Your Gemini API key
GEMINI_API_KEY=$GEMINI_API_KEY

# Optional configuration (defaults will be used if not specified)
FRONTEND_PORT=8080
BACKEND_PORT=5002
DEBUG=false
EOF

    echo "✅ Configuration file created!"
else
    echo "✅ Configuration file already exists."
fi

# Download docker-compose.prod.yml if it doesn't exist
echo "Downloading configuration file..."
curl -s -o docker-compose.yml https://raw.githubusercontent.com/jayrom23/fashion-ai/main/docker-compose.prod.yml

# Start the application
echo "Starting AI Fashion Model app..."
docker-compose pull
docker-compose down -v 2>/dev/null || true
docker-compose up -d

# Check if services are running
echo "Checking if services are running..."
sleep 5

if docker-compose ps | grep -q "Up"; then
    echo "✅ AI Fashion Model app is now running!"
    echo
    echo "🌐 Access the app at: http://localhost:${FRONTEND_PORT:-8080}"
    echo
    echo "To stop the app: docker-compose down"
    echo "To view logs: docker-compose logs -f"
else
    echo "❌ Something went wrong. Check the logs with: docker-compose logs"
fi