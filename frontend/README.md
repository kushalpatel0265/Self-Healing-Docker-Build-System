# Self-Healing Docker Builds - Frontend

A modern, interactive React frontend for the Self-Healing Docker Builds system. This application provides a clean and intuitive interface to manage Docker builds, deployments, and AI-powered error resolution.

## Features

### 🏗️ Build Management
- **Start New Builds**: Trigger builds from Git repositories with customizable parameters
- **Real-time Status Updates**: Live monitoring of build progress and status changes
- **Build History**: View all builds with detailed status information and error messages

### 🚀 Deployment & CI/CD
- **Container Deployment**: Deploy built images to registries with security scanning
- **GitHub Actions Integration**: Dispatch workflows and monitor CI/CD pipelines
- **Multi-environment Support**: Configure deployments for different environments

### 🤖 AI-Powered Error Resolution
- **Error Analysis**: Submit build errors for AI-powered analysis
- **Automated Patch Proposals**: Get specific code fixes and configuration changes
- **Copy-to-Clipboard**: Easy implementation of suggested fixes

### 📊 Real-time Dashboard
- **Build Statistics**: Overview of success rates and current activity
- **Live Updates**: Automatic refresh for running builds
- **Status Indicators**: Visual representation of build health

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend server running on `http://localhost:8000`

### Installation

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx    # Main dashboard with build overview
│   │   ├── BuildManager.jsx # Build forms and management
│   │   └── AIPatchInterface.jsx # AI error resolution
│   ├── hooks/              # Custom React hooks
│   │   └── useRealTime.js  # Real-time updates and WebSocket
│   ├── services/           # API integration
│   │   └── api.js         # Axios configuration and endpoints
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx          # React entry point
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── index.html           # HTML template
```

## API Integration

The frontend connects to the backend API with automatic request/response logging:

### Build Endpoints
- `POST /api/v1/builds/start` - Start new build
- `GET /api/v1/builds/{id}` - Get build status
- `POST /api/v1/builds/{id}/deploy` - Deploy build
- `POST /api/v1/builds/{id}/dispatch` - Dispatch GitHub workflow

### AI Endpoints
- `POST /api/v1/ai/propose_patch` - Generate patch proposals

## Real-time Features

### Auto-refresh Behavior
- **Dashboard**: Refreshes every 10 seconds when active builds exist
- **Build Status**: Updates every 3 seconds for pending/running builds
- **Manual Refresh**: Available on all views

### WebSocket Support
Ready for WebSocket integration for instant updates (hook provided in `useRealTime.js`)

## Usage Guide

### Starting a New Build

1. **Navigate to Build Manager**
2. **Fill in the form:**
   - Repository URL (required)
   - Branch (default: main)
   - Dockerfile path (default: Dockerfile)
   - Image name (optional)
   - GitHub Actions toggle

3. **Click "Start Build"**
4. **Monitor progress** in Dashboard

### Deploying a Build

1. **Go to Build Manager → Deploy tab**
2. **Enter Build ID** from completed build
3. **Configure deployment:**
   - Registry (optional)
   - Tag (optional)  
   - Push to registry (checkbox)
   - Security scan (checkbox)

4. **Click "Deploy"**

### Using AI Patch Proposals

1. **Navigate to AI Patches tab**
2. **Describe the error:**
   - Error type (e.g., build_error, dependency_error)
   - Full error message
   - Line number (if applicable)

3. **Click "Generate Patch Proposal"**
4. **Review suggested fixes:**
   - File operations (replace, append, create)
   - Code snippets with copy buttons
   - Implementation instructions

## Styling & Design

### Design System
- **Colors**: Professional blue/gray palette with semantic status colors
- **Typography**: System fonts with clear hierarchy
- **Components**: Card-based layout with consistent spacing
- **Responsive**: Mobile-friendly grid system

### Status Indicators
- 🟡 **Pending**: Yellow badge with clock icon
- 🔵 **Running**: Blue badge with activity icon  
- 🟢 **Success**: Green badge with check icon
- 🔴 **Failed**: Red badge with X icon

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style
- ES6+ JavaScript with JSX
- Functional components with hooks
- Consistent naming conventions
- Modular component structure

## Configuration

### Proxy Setup
API requests are proxied to `localhost:8000` via Vite configuration:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

### Environment Variables
Create `.env.local` for custom configuration:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**API Connection Errors:**
- Ensure backend server is running on port 8000
- Check CORS configuration in backend
- Verify network connectivity

**Build Not Loading:**
- Check browser console for JavaScript errors
- Clear browser cache and cookies
- Restart development server

**WebSocket Connection:**
- Verify WebSocket endpoint in backend
- Check browser WebSocket support
- Review network proxy settings

## Contributing

1. Follow existing code style and component patterns
2. Add proper error handling for all API calls
3. Include responsive design considerations
4. Test on multiple browsers and devices
5. Update documentation for new features

## License

This project is part of the Self-Healing Docker Builds system.