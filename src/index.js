// dotenv is not needed in the frontend; use CRA environment injection instead
import { Route } from 'react-router-dom';
import {
  // or createReactRouterV4Options
  createReactRouterV5Options,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
  ReactRouterVersion,
} from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { createBrowserHistory } from 'history';
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

initializeFaro({
  url: process.env.REACT_APP_FARO_URL || 'https://faro.grafana.net/api/collect/v1',
  app: {
    name: 'random-picture-frontend',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.REACT_APP_ENV || 'development',
  },
  instrumentations: [
    ...getWebInstrumentations({
      backendUrls,
      // Enable React Router v5 support
      reactRouterVersion: ReactRouterVersion.V5,
    }),
    new ReactIntegration({
      // Enable React Router v5 support
      router: createReactRouterV5Options({
        history: createBrowserHistory(),
        Route,
      }),
    }),
    new TracingInstrumentation({
      instrumentationOptions: {
        // Requests to these URLs have tracing headers attached.
        propagateTraceHeaderCorsUrls: [new RegExp('http://localhost*')],
      },
    }),
  ],
  trackGeolocation: true,
  trackUserActionsPreview: true,
})

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
