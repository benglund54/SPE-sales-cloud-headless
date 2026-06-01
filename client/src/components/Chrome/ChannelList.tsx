import type { ThemeId } from '../../types';

interface Props {
  theme: ThemeId;
}

function ClaudeWorkspaceList() {
  const recents = [
    'Interactive rights workspace',
    'Rights renewal planning memo',
    'Studio distribution flow draft',
    'Territory windowing assumptions',
    'Partner risk mitigation notes',
    'Luminary rights QBR prep',
    'Executive briefing outline',
  ];

  return (
    <div className="channel-list claude-recents">
      <div className="channel-list-label">Recents</div>
      <ul className="channel-list-items">
        {recents.map((item) => (
          <li key={item} className={`channel-item claude-recents-item ${item === 'Interactive rights workspace' ? 'channel-item-active' : ''}`}>
            <span className="claude-recents-text">{item}</span>
            <span className="claude-recents-more">···</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatGPTRecents() {
  const projects = [
    'Headless 360 Demo Summary',
    'SE Security Risk Assessment',
    'Archer Portal Confirmation',
    'FDE Nomination Process Steps',
    'FDE Pod Request Draft',
  ];

  const recents = [
    'Claude prompt for demo',
    'Salesforce renewal response',
    'Netgear meeting summary',
    'Demo talk track request',
    'Rights risk review draft',
  ];

  return (
    <>
      <div className="channel-list">
        <div className="channel-list-label">Projects</div>
        <ul className="channel-list-items">
          {projects.map((item) => (
            <li key={item} className="channel-item chatgpt-channel-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="channel-list">
        <div className="channel-list-label">Recents</div>
        <ul className="channel-list-items">
          {recents.map((item) => (
            <li key={item} className={`channel-item chatgpt-channel-item ${item === 'Claude prompt for demo' ? 'channel-item-active' : ''}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function GoogleChatSidebar() {
  return (
    <>
      <div className="channel-list">
        <div className="channel-list-label google-section-label">
          <span className="section-arrow">&#9662;</span> Shortcuts
        </div>
        <ul className="channel-list-items">
          <li className="channel-item channel-item-active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Home
          </li>
          <li className="channel-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            Mentions
          </li>
          <li className="channel-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Starred
          </li>
        </ul>
      </div>
      <div className="channel-list">
        <div className="channel-list-label google-section-label">
          <span className="section-arrow">&#9662;</span> Direct messages
        </div>
        <ul className="channel-list-items">
          {['Jannet Linder', 'Derek Shao', 'Cynthia Hoac', 'Jon Lea', 'Will Lee'].map((name) => (
            <li key={name} className="channel-item google-dm-item">
              <div className="google-dm-avatar">{name[0]}</div>
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="channel-list">
        <div className="channel-list-label google-section-label">
          <span className="section-arrow">&#9662;</span> Spaces
        </div>
        <div className="google-spaces-actions">
          <span className="google-spaces-text">Create a space and collaborate</span>
          <a className="google-spaces-link" href="#">Find a space to join</a>
        </div>
      </div>
      <div className="channel-list">
        <div className="channel-list-label google-section-label">
          <span className="section-arrow">&#9662;</span> Apps
        </div>
        <div className="google-spaces-actions">
          <span className="google-spaces-text">No apps yet</span>
          <a className="google-spaces-link" href="#">Explore apps</a>
        </div>
      </div>
    </>
  );
}

function SlackDMList() {
  const sections = [
    { label: 'Threads', count: 6 },
    { label: 'Huddles' },
    { label: 'Recap' },
    { label: 'Drafts & sent', count: 18 },
    { label: 'Bookmarks' },
    { label: 'Renewal watchlist', active: true },
  ];
  const channels = [
    { name: 'tv-rights-command', unread: 5, active: true },
    { name: 'partner-renewals' },
    { name: 'latam-windowing' },
    { name: 'emea-licensing-risk', unread: 2 },
  ];
  const extConnections = [
    'ext-quantumstream-media',
    'ext-novabrand-entertainment',
    'ext-pinnacle-studios',
  ];
  const dms = ['Maya Chen', 'Diego Alvarez', 'Ava Patel', 'Noah Bennett'];

  return (
    <div className="channel-list slack-workspace-list">
      <div className="slack-section-group">
        <ul className="channel-list-items">
          {sections.map((section) => (
            <li key={section.label} className={`channel-item slack-workspace-item ${section.active ? 'channel-item-active' : ''}`}>
              <span className="slack-workspace-bullet">{section.active ? '●' : '◦'}</span>
              <span className="slack-workspace-text">{section.label}</span>
              {section.count ? <span className="slack-workspace-count">{section.count}</span> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="channel-list-label slack-section-title">Luminary Studios</div>
      <ul className="channel-list-items">
        <li className="channel-item slack-channel-heading">Luminary Studios</li>
        {channels.map((channel) => (
          <li key={channel.name} className={`channel-item slack-channel-item ${channel.active ? 'channel-item-active' : ''}`}>
            <span className="slack-channel-prefix">#</span>
            <span className="slack-channel-name">{channel.name}</span>
            {channel.unread ? <span className="slack-channel-unread">{channel.unread}</span> : null}
          </li>
        ))}
      </ul>

      <div className="channel-list-label slack-section-title">External connections</div>
      <ul className="channel-list-items">
        {extConnections.map((item) => (
          <li key={item} className="channel-item slack-channel-item">
            <span className="slack-channel-prefix">⌂</span>
            <span className="slack-channel-name">{item}</span>
          </li>
        ))}
      </ul>

      <div className="channel-list-label slack-section-title">Direct messages</div>
      <ul className="channel-list-items">
        {dms.map((name) => (
          <li key={name} className="channel-item slack-dm-row">
            <span className="slack-dm-status" />
            <span className="slack-channel-name">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamsChatList() {
  const favorites = [
    { name: 'Luminary Rights Ops', icon: 'briefcase', unread: 4, tone: 'violet' },
    { name: 'LATAM Distribution', icon: 'globe', tone: 'teal' },
    { name: 'EMEA Licensing', icon: 'shield', unread: 2, tone: 'blue' },
    { name: 'Studio Distribution Command', icon: 'sparkles', tone: 'magenta' },
  ];
  const chats = [
    { name: 'QuantumStream Renewal', icon: 'bolt', time: '2m', tone: 'amber' },
    { name: 'Pinnacle Escalation', icon: 'alert', time: '9m', tone: 'red' },
    { name: 'Windowing Alignment', icon: 'calendar', time: '24m', tone: 'green' },
  ];

  const TeamIcon = ({ type }: { type: string }) => {
    if (type === 'briefcase') {
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>;
    }
    if (type === 'globe') {
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
    }
    if (type === 'shield') {
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l7 3v6c0 5-3.4 8.3-7 9-3.6-.7-7-4-7-9V6l7-3z" /></svg>;
    }
    if (type === 'sparkles') {
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" /><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" /></svg>;
    }
    if (type === 'bolt') {
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>;
    }
    if (type === 'alert') {
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 8v5" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>;
    }
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
  };

  return (
    <>
      <div className="channel-list">
        <ul className="channel-list-items">
          <li className="channel-item teams-item">
            <div className="teams-item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
            Distribution Assistant
          </li>
          <li className="channel-item teams-item">
            <div className="teams-item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            Deal Intelligence
          </li>
        </ul>
      </div>
      <div className="channel-list">
        <div className="channel-list-label">
          <span className="section-bullet">&#8226;</span> Executive Mentions
        </div>
        <div className="channel-list-label">
          <span className="section-bullet">&#8226;</span> Watchlist Threads
        </div>
      </div>
      <div className="channel-list">
        <div className="channel-list-label">Priority Teams</div>
        <ul className="channel-list-items">
          {favorites.map((team) => (
            <li key={team.name} className={`channel-item teams-item ${team.name === 'Studio Distribution Command' ? 'channel-item-active' : ''}`}>
              <div className={`teams-avatar teams-avatar-icon teams-avatar-${team.tone}`}><TeamIcon type={team.icon} /></div>
              <span className="teams-row-label">{team.name}</span>
              {team.unread ? <span className="teams-unread-pill">{team.unread}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="channel-list">
        <div className="channel-list-label">Deal Rooms</div>
        <ul className="channel-list-items">
          {chats.map((chat) => (
            <li key={chat.name} className="channel-item teams-item">
              <div className={`teams-avatar teams-avatar-icon teams-avatar-${chat.tone}`}><TeamIcon type={chat.icon} /></div>
              <span className="teams-row-label">{chat.name}</span>
              <span className="teams-row-meta">{chat.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function ChannelList({ theme }: Props) {
  switch (theme) {
    case 'claude':
      return <ClaudeWorkspaceList />;
    case 'chatgpt':
      return <ChatGPTRecents />;
    case 'google':
      return <GoogleChatSidebar />;
    case 'slack':
      return <SlackDMList />;
    case 'teams':
      return <TeamsChatList />;
    default:
      return null;
  }
}
