// Initialize Faro before any other code
import { initFaroWithTracing } from '@michelin/faro-react-initialization-utils/withTracing';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Pull API and image processor base URLs from env vars
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const imageProcessorUrl = process.env.REACT_APP_IMAGE_PROCESSOR_URL || 'http://localhost:3002';
const backendUrls = [
  new RegExp(`^${apiUrl}.*`),
  new RegExp(`^${imageProcessorUrl}.*`)
];

initFaroWithTracing(
  {
    url: process.env.REACT_APP_FARO_URL, // Faro URL for sending telemetry data
    name: 'Random-Picture-Frontend',
    version: '1.0.0',
    env: 'production',
    backendUrls, // use dynamic list
  },
  {
    trackGeolocation: true, // Enable geolocation tracking
    trackUserActionsPreview: true, // Enable user actions tracking
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
