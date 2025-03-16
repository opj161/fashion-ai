#!/bin/bash

echo "==============================="
echo "AI Fashion Model App - Diagnostics"
echo "==============================="
echo

echo "1. Checking container status:"
docker-compose ps

echo
echo "2. Testing backend API health endpoint:"
curl -s http://localhost:5002/api/health

echo
echo "3. Testing frontend proxy to backend:"
curl -s http://localhost:8080/api/health

echo
echo "4. Checking backend environment variables:"
docker-compose exec backend env | grep GEMINI
docker-compose exec backend env | grep ALLOWED

echo
echo "Diagnostics complete! If you're still having issues, check the logs:"
echo "- Backend logs: docker-compose logs backend"
echo "- Frontend logs: docker-compose logs frontend"