# Frontend Microservice

A modern React application that provides an intuitive interface for image processing with real-time filters and advanced image manipulation capabilities. This service communicates with the image processor microservice to deliver a seamless user experience.

## 🏗️ Microservice Architecture

This is one of three independent microservices in the Full Stack Image App:

```
Frontend (React:3000) → Image Processor (Docker:3002) → Picture Server (Lambda:3001) → External APIs
```

### Related Services
- **[Image Processor](../image-processor/README.md)**: RESTful API for image transformations 
- **[Picture Server](../picture-server/README.md)**: Serverless image source
- **[Project Overview](../README.md)**: Main project documentation

### Service Independence
- **Static Deployment**: Can be deployed to any static hosting service
- **Framework Agnostic**: React-based but easily adaptable to other frameworks  
- **Independent Development**: Hot reload and independent development workflow
- **CDN Ready**: Optimized build output suitable for CDN distribution

## ✨ Features

- 🎨 **Real-Time Image Processing**: Apply filters without refreshing images
- 🖼️ **Persistent Image State**: Filters applied to the same image for comparison
- 🎛️ **Advanced Filter Controls**: Preset filters and custom adjustment sliders
- 📱 **Responsive Design**: Modern glassmorphism UI that works on all devices
- 🚀 **Service Health Dashboard**: Monitor all microservices status
- ⚡ **Performance Optimized**: Efficient state management and image handling
- 🔄 **Smart State Management**: React hooks for optimal re-rendering
- 🎯 **User Experience**: Intuitive interface with visual feedback

## 🎨 User Interface

### Modern Design System
- **Glassmorphism**: Translucent elements with backdrop blur effects
- **Responsive Layout**: Mobile-first design with breakpoint optimization
- **Dark Theme**: Modern dark interface with accent colors
- **Smooth Animations**: CSS transitions and hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Component Architecture
- **App.js**: Main application component with state management
- **FilterControls**: Reusable filter selection and adjustment components
- **ImageDisplay**: Optimized image rendering with loading states
- **StatusDashboard**: Service health monitoring interface

## 🛠️ Development Setup

### Prerequisites

- **Node.js 18+**: Required for React development
- **npm**: Package manager (comes with Node.js)

### Quick Start (Standalone)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The application will open at [http://localhost:3000](http://localhost:3000) with hot reload enabled.

### Integration with Full Stack App

```bash
# From the root directory, start all services
npm run dev-smart

# Or start just the frontend
npm run start-frontend
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   ├── favicon.ico        # App icon
│   └── manifest.json      # PWA manifest
├── src/
│   ├── App.js            # Main application component
│   ├── App.css           # Glassmorphism styles
│   ├── index.js          # React entry point
│   ├── index.css         # Global styles
│   └── reportWebVitals.js # Performance monitoring
├── build/                # Production build output
├── package.json          # Dependencies and scripts
└── .env.example         # Environment configuration template
```

## 🔧 Configuration

### Environment Variables

For convenience, an `.env.example` file is provided with all required and optional environment variables. Copy this to create your `.env` file in the frontend directory:

```bash
# Image Processor Service URL
REACT_APP_IMAGE_PROCESSOR_URL=http://localhost:3002

# Picture Server URL (for direct access if needed)
REACT_APP_PICTURE_SERVER_URL=http://localhost:3001

# Development settings
REACT_APP_NODE_ENV=development
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm test` | Run test suite in watch mode |
| `npm run build` | Create optimized production build |
| `npm run eject` | Eject from Create React App (one-way) |

## 🎯 Key Features Implementation

### Intelligent Image State Management

The application maintains image state to prevent unnecessary re-fetching:

```javascript
const [currentImage, setCurrentImage] = useState(null);
const [processedImage, setProcessedImage] = useState(null);
const [filters, setFilters] = useState({});

// Apply filters to the same image
const applyFilters = async (newFilters) => {
  const response = await fetch('/api/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters: newFilters })
  });
  const result = await response.json();
  setProcessedImage(result.processedImage);
};
```

### Filter System

**Preset Filters:**
- Vintage, Black & White, Sepia
- Vibrant, Cool, Warm, Dramatic

**Custom Adjustments:**
- Brightness, Contrast, Saturation
- Hue rotation, Blur, Sharpening

### Service Communication

The frontend communicates exclusively with the image processor:

```javascript
// Fetch available filters
const getFilters = async () => {
  const response = await fetch('http://localhost:3002/filters');
  return response.json();
};

// Process image with filters
const processImage = async (filters) => {
  const response = await fetch('http://localhost:3002/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters })
  });
  return response.json();
};
```

### Service Health Dashboard

The frontend includes a built-in service health monitoring dashboard:

```javascript
// Service health check
const checkServiceHealth = async () => {
  const services = [
    {name: 'Image Processor', url: `${process.env.REACT_APP_IMAGE_PROCESSOR_URL}/health`},
    {name: 'Picture Server', url: `${process.env.REACT_APP_PICTURE_SERVER_URL}/hello`}
  ];
  
  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const response = await fetch(service.url);
        const data = await response.json();
        return { 
          name: service.name, 
          status: response.ok ? 'online' : 'error',
          details: data 
        };
      } catch (error) {
        return { name: service.name, status: 'offline', error: error.message };
      }
    })
  );
  
  return results;
};
```

To view the service health status:
1. Click the "Service Status" button in the application
2. Each service shows:
   - Status indicator (green = online, red = offline)
   - Response time
   - Version information
   - Dependency status

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Glassmorphism CSS

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
}

.filter-controls {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## 🚀 Deployment Options

### Static Hosting

The React app builds to static files suitable for any hosting service:

**Netlify:**
```bash
# Build the project
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=build
```

**Vercel:**
```bash
# Build and deploy
npx vercel --prod
```

**AWS S3 + CloudFront:**
```bash
# Build the project
npm run build

# Sync to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete
```

### Docker Deployment

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🧪 Testing

### Unit Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- --testNamePattern="App"
```

### Integration Testing

Test the complete user workflow:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('applies filter to image', async () => {
  render(<App />);
  
  // Wait for image to load
  await waitFor(() => {
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  // Apply vintage filter
  fireEvent.click(screen.getByText('Vintage'));
  
  // Verify filter was applied
  await waitFor(() => {
    expect(screen.getByText('Filter applied')).toBeInTheDocument();
  });
});
```

## 🔍 Performance Optimization

### Build Optimization

- **Code Splitting**: Automatic with React.lazy()
- **Tree Shaking**: Removes unused code
- **Minification**: CSS and JS compression
- **Asset Optimization**: Image and font optimization

### Runtime Performance

- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive operations
- **Lazy Loading**: Load images and components on demand
- **Service Worker**: Cache static assets (PWA ready)

## 🤝 Integration Patterns

### Microservices Communication

**Service Discovery:**
```javascript
// Environment-based URLs
const IMAGE_PROCESSOR_URL = process.env.REACT_APP_IMAGE_PROCESSOR_URL || 'http://localhost:3002';

// Health check all services
const checkServiceHealth = async () => {
  try {
    const imageProcessorHealth = await fetch(`${IMAGE_PROCESSOR_URL}/health`);
    return { imageProcessor: imageProcessorHealth.ok };
  } catch (error) {
    return { imageProcessor: false };
  }
};
```

**Error Handling:**
```javascript
const handleServiceError = (error, service) => {
  console.error(`${service} service error:`, error);
  setServiceStatus(prev => ({ ...prev, [service]: 'error' }));
  // Show user-friendly error message
  setNotification(`${service} is temporarily unavailable`);
};
```

## 📚 Resources

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)
- [CSS Glassmorphism](https://css.glass/)

## 🔗 Related Services

- **Image Processor**: [../image-processor/README.md](../image-processor/README.md)
- **Picture Server**: [../picture-server/README.md](../picture-server/README.md)
- **Full Stack Documentation**: [../README.md](../README.md)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
