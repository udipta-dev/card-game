import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
// Bundled, not fetched: @fontsource ships the woff2 files through the build,
// so the faces survive offline and the CSP has nothing to block.
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/eb-garamond/latin-600.css';
import { App } from './app/App';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/app.css';
import './styles/ornament.css';
import './styles/polish.css';

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
