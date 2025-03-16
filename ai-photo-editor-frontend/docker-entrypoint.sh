#!/bin/sh
set -e

# Get API URL from environment with fallback
API_URL=${NGINX_ENV_API_URL:-"http://backend:5002"}

echo "Configuring frontend with API URL: $API_URL"

# Simple and reliable replacement
sed "s|{{API_URL}}|$API_URL|g" /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

# Execute the default nginx command
exec "$@"