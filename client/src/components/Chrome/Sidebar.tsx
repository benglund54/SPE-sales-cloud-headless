import type { ThemeId } from '../../types';
import { themes } from '../../themes';
import { ChannelList } from './ChannelList';
import { ChatGPTLogo } from '../icons/ChatGPTLogo';

const CLAUDE_LOGO_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAUCAYAAAA0nZtFAAACyUlEQVR4AezXC27cMAwEUDcX6/ZkTU/W9mStnrGT0B955WyADZAEnogih0OK/rR5mr5+FhP4GshiHNN0NJBL48LzdWU3c3Px48Am+CCHnn632ta2jF/rgRAg9K9J/Lzie1v5gL8enA9w8Rr1oZfe9KgnZzndTB0IsQj9aEoV39r+V4PL4VPsL8cHQ/p8U1sZiGE4KBGCfxgr4BhSdfPhV98jbf3s9T7cUwZSh0G0J6AY9OI9vycKenH+o/hRTC7gAHsEu1wDqQMYOawnYoSnoFfQO23gsWs9jYcnXmP8wA81Jg8SVwMnEOsBJ3wrvGgbSP0Yjhx0hKMZzYIBetV8h+QaThoQ16BVzhpHMRricqKvhnp8e1jzw9XT3IOBzMZe9p0+RUho3Aq1AXsDcgirfQWfWPXFphl9w8BNrNrxWeU4qx7C4Ys96xkIMiTAfg8oDO+h1dM4oz8fuAnlnIYDzfV6GUglvEbut0wfKCnscQX7e5HDjeqoj+usbH0AHUP1JHrSNv9TRZZ4CyM8HEV9tFJ4LnpL/ETcAU/QJz2llwxhoeEJMaHp+iPhanYXd32EZxh4hgCLwl31cwH65zKmyXn3erk0oYuBCELbT6YnwN6DGM5erPoMzZ4usEdQ/8U74kfzLJ/mXv/ONd/AJ4yGegcFcqAWermSxJGG2HtIo3IAx1qbseev4Etttl4Sj6a9u2zFCT/7Xo2a4zWWJ1+N5Dx7QgiBoSQJIUkSJQGeYQBbDJdN3N4aHX55tKzVjwc41U+vx+fHVz854YupIR6I6cnemhx7Mfz04Juy+ahKEpAI7gr4I87AxKwEA7yAT7OAxx9bLpsP6OJD9bPlAhvYQAMf9MpHC8da92zAwwc2DVyQhwPim4HMzvZLIiACW3ILLS7+NULAF5PPjp8PbvmTE1720bHyRctqD0c58nAhPL4Z9ZWZHZ/9138AAAD//9ELolsAAAAGSURBVAMA57y+KQl6DsEAAAAASUVORK5CYII=';

interface Props {
  theme: ThemeId;
}

function ClaudeRail() {
  return (
    <div className="app-rail claude-rail">
      <div className="rail-top">
        <button className="rail-icon" title="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        </button>
        <button className="rail-icon" title="New chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div className="rail-middle">
        <button className="rail-icon" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button className="rail-icon" title="Chats">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </button>
        <button className="rail-icon" title="Projects">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
        </button>
        <button className="rail-icon" title="Integrations">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>
      </div>
    </div>
  );
}

function SlackRail() {
  return (
    <div className="app-rail slack-rail">
      <div className="rail-top">
        <div className="rail-logo">
          <svg width="20" height="20" viewBox="0 0 127 127" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
            <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
            <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z" fill="#2EB67D"/>
            <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E"/>
          </svg>
        </div>
      </div>
      <div className="rail-middle">
        <button className="rail-icon-labeled rail-icon-active" title="Home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </button>
        <button className="rail-icon-labeled" title="DMs">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span>DMs</span>
        </button>
        <button className="rail-icon-labeled" title="Activity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span>Activity</span>
        </button>
        <button className="rail-icon-labeled" title="Sales">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
          <span>Sales</span>
        </button>
        <button className="rail-icon-labeled" title="Files">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
          <span>Files</span>
        </button>
      </div>
      <div className="rail-bottom">
        <button className="rail-icon-labeled" title="More">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          <span>More</span>
        </button>
      </div>
    </div>
  );
}

function TeamsRail() {
  return (
    <div className="app-rail teams-rail">
      <div className="rail-top">
        <div className="rail-logo">
          <svg width="30" height="30" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="teams-grad-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5B5FC7"/>
                <stop offset="100%" stopColor="#7B83EB"/>
              </linearGradient>
              <linearGradient id="teams-grad-2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7B83EB"/>
                <stop offset="100%" stopColor="#9EA4F0"/>
              </linearGradient>
            </defs>
            <circle cx="18" cy="5.5" r="3" fill="url(#teams-grad-2)"/>
            <circle cx="23" cy="8" r="2" fill="url(#teams-grad-2)" opacity="0.8"/>
            <rect x="12" y="8" width="12" height="12" rx="3" fill="url(#teams-grad-2)"/>
            <rect x="18" y="8" width="8" height="12" rx="3" fill="url(#teams-grad-2)" opacity="0.7"/>
            <rect x="3" y="11" width="13" height="14" rx="3" fill="url(#teams-grad-1)"/>
            <text x="9.5" y="21.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif">T</text>
          </svg>
        </div>
      </div>
      <div className="rail-middle">
        <button className="rail-icon-labeled" title="Activity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span>Activity</span>
        </button>
        <button className="rail-icon-labeled rail-icon-active" title="Distribution Desk">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span>Chat</span>
          <span className="teams-rail-badge">7</span>
        </button>
        <button className="rail-icon-labeled" title="Rights Channels">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span>Teams</span>
        </button>
        <button className="rail-icon-labeled" title="Deal Rooms">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
          <span>Calls</span>
        </button>
        <button className="rail-icon-labeled" title="Rights Library">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
          <span>Files</span>
        </button>
      </div>
      <div className="rail-bottom">
        <button className="rail-icon-labeled" title="More">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          <span>More</span>
        </button>
        <button className="rail-icon-labeled" title="Apps">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
          <span>Apps</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ theme }: Props) {
  const config = themes[theme];

  return (
    <>
      {theme === 'claude' && <ClaudeRail />}
      {theme === 'slack' && <SlackRail />}
      {theme === 'teams' && <TeamsRail />}

      {config.hasSidebar && (
        <div className="sidebar">
          <div className="sidebar-header">
            {theme === 'claude' && (
              <>
                <div className="sidebar-top-row claude-top-row">
                  <img className="claude-logo-image" src={CLAUDE_LOGO_PNG} alt="Claude" />
                  <button className="sidebar-icon-btn" title="Toggle sidebar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="18"/></svg>
                  </button>
                </div>
                <nav className="sidebar-nav claude-nav">
                  <button className="sidebar-nav-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New chat
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Search
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Chats
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                    Projects
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l2.4 4.8L20 10l-4 3.8.95 5.2L12 16.8 7.05 19l.95-5.2L4 10l5.6-2.2L12 3z"/></svg>
                    Artifacts
                  </button>
                </nav>
              </>
            )}
            {theme === 'chatgpt' && (
              <>
                <div className="sidebar-top-row">
                  <div className="chatgpt-brand">
                    <span className="chatgpt-logo-wrap" aria-label="ChatGPT logo">
                      <ChatGPTLogo size={18} color="#111111" />
                    </span>
                    <span className="chatgpt-brand-name">ChatGPT</span>
                  </div>
                  <button className="sidebar-icon-btn" title="New chat">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </button>
                </div>
                <nav className="sidebar-nav">
                  <button className="sidebar-nav-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    New chat
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Search chats
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                    Library
                  </button>
                  <button className="sidebar-nav-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V6l10 6-10 6z"/><path d="M4 6h1"/><path d="M4 12h1"/><path d="M4 18h1"/></svg>
                    Luminary GPTs
                  </button>
                  <button className="sidebar-nav-item">
                    <span className="sidebar-nav-dots">...</span>
                    More
                  </button>
                </nav>
              </>
            )}
            {theme === 'google' && (
              <>
                <button className="sidebar-new-chat google-new-chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  New chat
                </button>
              </>
            )}
            {theme === 'slack' && (
              <>
                <div className="sidebar-top-row">
                  <span className="sidebar-title slack-workspace-title">Luminary Studios</span>
                  <div className="sidebar-header-actions">
                    <button className="sidebar-icon-btn" title="Preferences">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.7 0 1.31.4 1.51 1H21a2 2 0 010 4h-.09c-.2.61-.81 1-1.51 1z"/></svg>
                    </button>
                    <button className="sidebar-icon-btn" title="Compose">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    </button>
                  </div>
                </div>
                <div className="sidebar-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <span>Filter conversations...</span>
                </div>
              </>
            )}
            {theme === 'teams' && (
              <>
                <div className="sidebar-top-row">
                  <span className="sidebar-title">Studio Distribution</span>
                  <div className="sidebar-header-actions">
                    <button className="sidebar-icon-btn" title="More">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    <button className="sidebar-icon-btn" title="Search">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                  </div>
                </div>
                <div className="sidebar-filter-tabs">
                  <button className="filter-tab filter-tab-active">Priority</button>
                  <button className="filter-tab">Markets</button>
                  <button className="filter-tab">Deals</button>
                  <button className="teams-collapse-btn" title="Collapse filters">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>
              </>
            )}
          </div>
          <ChannelList theme={theme} />
          {theme === 'chatgpt' && (
            <div className="sidebar-footer">
              <div className="sidebar-user">
                <div className="sidebar-luminary-logo luminary-logo-mark" aria-label="Luminary Studios">
                  <span className="luminary-logo-badge">L</span>
                  <span className="luminary-logo-text">Luminary</span>
                </div>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-name">Luminary Studios</span>
                  <span className="sidebar-user-plan">Enterprise workspace</span>
                </div>
                <button className="sidebar-upgrade-btn">Manage</button>
              </div>
            </div>
          )}
          {theme === 'claude' && (
            <div className="sidebar-footer claude-footer">
              <div className="sidebar-user claude-footer-user">
                <div className="sidebar-luminary-logo claude-luminary-logo luminary-logo-mark" aria-label="Luminary Studios">
                  <span className="luminary-logo-badge">L</span>
                  <span className="luminary-logo-text">Luminary</span>
                </div>
                <div className="claude-footer-meta-row">
                  <div className="sidebar-user-info">
                    <span className="sidebar-user-name">Luminary Studios</span>
                    <span className="sidebar-user-plan">Studio workspace</span>
                  </div>
                  <button className="sidebar-upgrade-btn">Open</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
