# AI Fashion Model Generator

Transform clothing product photos into professional fashion model images using AI. Perfect for e-commerce stores and fashion retailers.

## Quick Start

The easiest way to get started is using our installation script:

```bash
curl -sL https://raw.githubusercontent.com/jay2323/fashion-ai/main/install.sh | bash
```

Then open http://localhost:8080 in your browser (or use your server's IP address).

## Manual Installation

1. Install Docker and Docker Compose
2. Create a directory for the application:
   ```bash
   mkdir fashion-ai && cd fashion-ai
   ```
3. Download the docker-compose.yml file:
   ```bash
   curl -o docker-compose.yml https://raw.githubusercontent.com/jay2323/fashion-ai/main/docker-compose.prod.yml
   ```
4. Create a .env file with your configuration:
   ```bash
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   echo "HOST_IP=localhost" >> .env
   ```
5. Start the application:
   ```bash
   docker-compose up -d
   ```
6. Access it at http://localhost:8080

## Configuration

You can configure the application by editing the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| GEMINI_API_KEY | Your Gemini API key (required) | - |
| HOST_IP | Your server's IP address | localhost |
| BACKEND_PORT | Backend API port | 5002 |
| FRONTEND_PORT | Frontend web port | 8080 |
| DEBUG | Enable debug mode | false |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:8080 |
