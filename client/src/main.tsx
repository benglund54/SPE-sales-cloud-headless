import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './themes/base.css';
import './themes/claude.css';
import './themes/chatgpt.css';
import './themes/google.css';
import './themes/slack.css';
import './themes/teams.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
