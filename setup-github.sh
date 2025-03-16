#!/bin/bash
set -e

echo "Setting up GitHub repository for Fashion AI app..."

# Initialize Git repository if not already done
if [ ! -d .git ]; then
  git init
  echo "Git repository initialized."
else
  echo "Git repository already exists."
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore file..."
  cat > .gitignore << EOL
# Environment variables
.env
.env.*
!.env.example

# Python
__pycache__/
*.py[cod]
*$py.class
venv/
env/

# Node
node_modules/
dist/
build/

# System files
.DS_Store
Thumbs.db
EOL
  echo ".gitignore file created."
else
  echo ".gitignore file already exists."
fi

# Create .env.example from .env.copy if needed
if [ ! -f .env.example ] && [ -f .env.copy ]; then
  echo "Creating .env.example file..."
  cp .env.copy .env.example
  echo ".env.example file created."
fi

# Stage files
echo "Staging files for initial commit..."
git add .
git add -f .env.example
git add -f *.sh

echo
echo "Files have been staged for your initial commit."
echo "Next steps:"
echo "1. Run: git commit -m \"Initial commit\""
echo "2. Create a repository on GitHub"
echo "3. Run: git remote add origin https://github.com/jayr/fashion-ai.git"
echo "4. Run: git push -u origin main"
echo