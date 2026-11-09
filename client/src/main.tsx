import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SonyExperience } from './sony/SonyExperience';
import './themes/base.css';
import './themes/claude.css';
import './themes/chatgpt.css';
import './themes/google.css';
import './themes/slack.css';
import './themes/teams.css';
import './App.css';

// Pathname gate: the Sony Headless 360 experience lives at /sony-headless-360.
// Every other path renders the existing seller-demo App unchanged.
// Sony Sales Cloud (Phase 1 visual shell) lives at /sales-cloud, lazy-loaded so
// it adds nothing to the existing bundles.
const isSalesCloudRoute = window.location.pathname.replace(/\/+$/, '') === '/sales-cloud';
const SalesCloudExperience = React.lazy(() =>
  import('./sales-cloud/SalesCloudRoute')
);

const isSonyRoute = window.location.pathname.replace(/\/+$/, '') === '/sony-headless-360';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSalesCloudRoute ? (
      <Suspense fallback={null}>
        <SalesCloudExperience />
      </Suspense>
    ) : (
      isSonyRoute ? <SonyExperience /> : <App />
    )}
  </React.StrictMode>
);
