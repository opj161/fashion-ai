Collecting workspace information# AI Fashion Model Generator - Comprehensive Project Overview

This web application transforms clothing product photos into professional fashion model images using AI (specifically Google's Gemini AI). It's designed for e-commerce stores and fashion retailers who want to showcase their products on virtual models with customizable appearance and environment settings.

## Application Architecture

### Tech Stack
- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Python/Flask API server
- **AI Integration**: Google Gemini AI API
- **Deployment**: Docker & Docker Compose
- **Storage**: Local storage (standard), cloud storage (optional feature)

### Project Structure
```
ai-photo-editor-backend/          # Main backend directory
├── app.py                        # Flask server
├── key_manager.py                # Gemini API key management
├── storage.py                    # Image storage utilities
├── Dockerfile                    # Backend container definition
├── docker-compose.yml            # Development orchestration
├── docker-compose.prod.yml       # Production orchestration
└── ai-photo-editor-frontend/     # Frontend React application
    ├── src/
    │   ├── components/           # React components
    │   │   ├── FashionModelPreview.jsx        # Core generation component
    │   │   ├── tab-panels/                    # Tabbed interface panels
    │   │   │   ├── BasicsTabPanel.jsx         # Gender & basic sizing
    │   │   │   ├── AppearanceTabPanel.jsx     # Body type, age, ethnicity 
    │   │   │   ├── EnvironmentTabPanel.jsx    # Background & pose
    │   │   │   ├── PhotographyTabPanel.jsx    # Camera & lens settings
    │   │   │   └── AdvancedTabPanel.jsx       # Prompt editing
    │   │   ├── common/                        # Reusable UI components
    │   │   │   ├── AttributeSelect.jsx        # Select dropdown with description
    │   │   │   ├── TabButton.jsx              # Tab navigation button
    │   │   │   ├── CardContainer.jsx          # Card UI wrapper
    │   │   │   └── InfoBox.jsx                # Information display box
    │   │   ├── ClothingPreview.jsx            # Image preview component
    │   │   ├── ImageEditor.jsx                # Post-generation editing
    │   │   ├── ImageUploader.jsx              # File upload handling
    │   │   ├── ProjectsPanel.jsx              # Saved projects management
    │   │   ├── Header.jsx                     # Application header
    │   │   └── Footer.jsx                     # Application footer
    │   ├── services/
    │   │   ├── api.js                         # Backend API client
    │   │   └── projectService.js              # Project management
    │   ├── data/
    │   │   ├── fashionOptions.js              # UI option definitions
    │   │   └── promptBuilder.js               # AI prompt construction
    │   ├── styles/
    │   │   └── constants.js                   # Styling constants
    │   ├── hooks/
    │   │   └── useComponentStyles.js          # Style management hook
    │   ├── App.jsx                            # Main application component
    │   └── index.jsx                          # Application entry point
    └── Dockerfile                             # Frontend container definition
```

## Core Application Workflow

The application implements a 3-step workflow:

1. **Upload**: User uploads a clothing item photo
   - High-quality product images work best
   - Plain backgrounds are recommended
   - Interface: ImageUploader.jsx

2. **Generate**: User customizes and generates a fashion model image
   - Organized in tabs for progressive disclosure
   - Options include model appearance, environment, photography settings
   - Customization handled by FashionModelPreview.jsx and tab panels
   - Advanced users can edit the AI prompt directly

3. **Edit/Export**: User can fine-tune and download the generated image
   - Quick edit options for common adjustments
   - Edit history for comparing versions
   - Download in high resolution
   - Interface: ImageEditor.jsx

## Key Features

### 1. Progressive Disclosure of Options
Options are organized in tabs to prevent overwhelming users:
- **Basics**: Gender, body size, height
- **Appearance**: Body type, age, ethnicity  
- **Environment**: Background setting, pose style
- **Photography**: Camera angle, lens/depth of field
- **Advanced**: Direct prompt editing

### 2. Default Option System
Each attribute has a "Default" option that doesn't add to the prompt, allowing the AI to make appropriate choices based on context. Default values are visually distinct with dashed borders.

### 3. Non-Linear Workflow
The application supports saving multiple workspace states ("versions") that users can switch between, encouraging experimentation without fear of losing previous work.

### 4. AI Prompt Construction
The application builds structured AI prompts with sections:
- **Subject**: Model description (gender, body type, etc.)
- **Setting**: Environment description
- **Style**: Photography style guidance
- **Technical**: Camera and lighting specifications

### 5. Project Management
- Save projects locally
- Export/import projects
- Quick access to recent projects
- Optional cloud storage integration

## Technical Details

### State Management
- React hooks for component state
- Tracked modifications to generate appropriate prompts
- Workspace states for non-linear workflow

### Styling System
- Tailwind CSS with consistent styling constants
- Dark/light mode support with theme toggle
- Responsive design for all screen sizes
- Card-based UI components for consistency

### Performance Optimizations
- Memoization with `useMemo` and `useCallback`
- Conditional rendering to minimize DOM updates
- Asynchronous API calls with loading states

### Deployment Options
1. Docker Hub Installation (pre-built images)
2. One-Command Installation Script
3. Unraid Configuration
4. Manual setup for development

### Configuration
Environment variables control:
- API keys for Gemini AI
- Network ports and hostnames
- Debug options
- CORS settings

## Authentication & Security
- API keys stored in environment variables
- Key rotation management for high-volume usage
- Rate limiting protection

This comprehensive overview should provide all the necessary context to understand the application's architecture, functionality, and technical implementation details.