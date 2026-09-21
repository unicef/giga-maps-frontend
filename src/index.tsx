import './tailwind.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { initSentry } from '~/core/sentry';

import App from './app';
import './core/analytics';

// Initialize Sentry SDK before React application renders
initSentry();

// attachLogger();

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
