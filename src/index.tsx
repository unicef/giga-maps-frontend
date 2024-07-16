import { attachLogger } from 'effector-logger';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';
import registerServiceWorker from './serviceWorkerRegistration';

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