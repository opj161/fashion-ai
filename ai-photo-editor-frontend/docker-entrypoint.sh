#!/bin/sh
set -e

echo "Starting Nginx with API proxy to backend:5002"

# Execute the default nginx command
exec "$@"