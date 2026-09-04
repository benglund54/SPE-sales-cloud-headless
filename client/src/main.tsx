import React from 'react';
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
const isSonyRoute = window.location.pathname.replace(/\/+$/, '') === '/sony-headless-360';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSonyRoute ? <SonyExperience /> : <App />}
  </React.StrictMode>
);
