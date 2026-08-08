import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
// Bundled, not fetched: @fontsource ships the woff2 files through the build,
// so the faces survive offline and the CSP has nothing to block.
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/eb-garamond/latin-600.css';
import { App } from './app/App';
import { watchForNewBuild } from './pwa';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/app.css';
import './styles/ornament.css';
import './styles/polish.css';

registerSW({ immediate: true });
// autoUpdate hands the new worker control but leaves this document on the old
// assets, so without this the first visit after every deploy is stale.
watchForNewBuild();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
