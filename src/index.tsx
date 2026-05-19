import './tailwind.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

// attachLogger();

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// if (process.env.NODE_ENV === 'production') {
//   registerServiceWorker();
// } 