import type { ThemeId } from '../../types';

interface Props {
  theme: ThemeId;
}

export function Header({ theme }: Props) {
  return (
    <div className="header">
      {theme === 'claude' && (
        <div className="header-content claude-header">
          <div className="claude-header-left">
            <span className="header-chat-title">Interactive rights workspace</span>
            <span className="header-dropdown-arrow">&#9662;</span>
          </div>
          <div className="claude-header-right">
            <span className="claude-plan-chip">Studio plan</span>
            <button className="claude-share-btn">Share</button>
          </div>
        </div>
      )}
      {theme === 'chatgpt' && (
        <div className="header-content chatgpt-header">
          <div className="header-center">
            <span className="header-wordmark">Luminary Studios</span>
            <span className="header-dropdown-arrow">&#9662;</span>
          </div>
          <div className="header-right">
            <span className="header-upgrade-link">Share</span>
          </div>
        </div>
      )}
      {theme === 'google' && (
        <div className="header-content google-header">
          <button className="google-hamburger" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          </button>
          <div className="google-logo-group">
            <svg width="24" height="24" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="google-chat-text">Chat</span>
          </div>
          <div className="google-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Search chat</span>
          </div>
          <div className="google-header-right">
            <div className="google-status">
              <span className="header-status-dot" />
              <span>Active</span>
              <span className="header-dropdown-arrow">&#9662;</span>
            </div>
            <button className="google-header-icon" aria-label="Help">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </button>
            <button className="google-header-icon" aria-label="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      )}
      {theme === 'slack' && (
        <div className="header-content slack-header">
          <div className="slack-header-left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
            <span className="header-contact-name"># tv-rights-command</span>
          </div>
          <div className="slack-header-tabs">
            <button className="slack-tab slack-tab-active">Messages</button>
            <button className="slack-tab">Renewals</button>
            <button className="slack-tab">Partner Notes</button>
            <button className="slack-tab">Files & links</button>
            <button className="slack-tab">+</button>
          </div>
          <div className="slack-header-right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </div>
        </div>
      )}
      {theme === 'teams' && (
        <div className="header-content teams-header">
          <div className="teams-header-utility">
            <button className="teams-utility-btn" aria-label="Back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="teams-utility-btn" aria-label="Forward">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <div className="teams-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.6" y2="16.6" /></svg>
              <span>Search</span>
            </div>
            <div className="teams-utility-right">
              <button className="teams-utility-btn" aria-label="More actions">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
              </button>
              <div className="teams-profile-dot" />
            </div>
          </div>
          <div className="teams-header-left">
            <div className="teams-channel-avatar">SD</div>
            <span className="header-channel-title">Studio Distribution Command</span>
          </div>
          <div className="teams-header-tabs">
            <button className="teams-tab teams-tab-active">Conversation</button>
            <button className="teams-tab">Licensing Board</button>
            <button className="teams-tab">Risk Register</button>
            <button className="teams-tab">+</button>
          </div>
        </div>
      )}
    </div>
  );
}
