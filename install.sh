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
    HOST_IP=$(hostname -I | awk '{print $1}')
    
    # Create .env file
    cat > .env << EOF
# Required: Your Gemini API key
GEMINI_API_KEY=$GEMINI_API_KEY

# Server configuration
HOST_IP=$HOST_IP        # Your server's IP address
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
    echo "🌐 Access the app at: http://${HOST_IP:-localhost}:${FRONTEND_PORT:-8080}"
    echo
    echo "To stop the app: docker-compose -f docker-compose.prod.yml down"
    echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
else
    echo "❌ Something went wrong. Check the logs with: docker-compose -f docker-compose.prod.yml logs"
fi
