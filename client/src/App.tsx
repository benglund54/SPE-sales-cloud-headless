import { ThemeProvider } from './context/ThemeContext';
import { DetailPanelProvider } from './context/DetailPanelContext';
import { useTheme } from './hooks/useTheme';
import { Chat } from './components/Chat/Chat';
import { Sidebar } from './components/Chrome/Sidebar';
import { Header } from './components/Chrome/Header';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import { DetailPanel } from './components/DetailPanel/DetailPanel';

function SlackToolbar() {
  return (
    <div className="slack-toolbar">
      <div className="slack-toolbar-left">
        <button className="slack-toolbar-btn" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="slack-toolbar-btn" aria-label="Forward">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button className="slack-toolbar-btn" aria-label="History">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
      </div>
      <div className="slack-toolbar-center">
        <div className="slack-toolbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Search Luminary Studios</span>
        </div>
      </div>
      <div className="slack-toolbar-right">
        <span className="slack-toolbar-feedback">🐙 Give Feedback</span>
        <button className="slack-toolbar-btn" aria-label="User">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <span className="slack-toolbar-caret">▾</span>
        <button className="slack-toolbar-btn" aria-label="Help">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const { activeTheme, themeConfig } = useTheme();

  return (
    <div className="app-outer" data-theme={activeTheme}>
      {activeTheme === 'slack' && <SlackToolbar />}
      <div className="app-container">
        {(themeConfig.hasSidebar || themeConfig.hasAppRail) && <Sidebar theme={activeTheme} />}
        <div className="app-main">
          {themeConfig.hasHeader && <Header theme={activeTheme} />}
          <Chat />
        </div>
        <DetailPanel />
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DetailPanelProvider>
        <AppContent />
      </DetailPanelProvider>
    </ThemeProvider>
  );
}
