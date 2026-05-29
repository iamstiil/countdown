import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Setup MSW mock server in both development and production
// Certify MSW's Service Worker is available before starting React app
import('../mocks/browser')
  .then(async ({ worker }) => {
    // On GitHub Pages the app is served from `/countdown/`, so the worker
    // script lives at `/countdown/mockServiceWorker.js`. `import.meta.env.BASE_URL`
    // ends with a slash, matching whatever `base` is set to in vite.config.ts.
    return worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    })
  }) // Run <App /> when Service Worker is ready to intercept requests
  .then(() => {
    root.render(<App />)
  })
