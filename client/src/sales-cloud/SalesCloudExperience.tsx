import { useState } from 'react';
import { useFollowScroll } from '../sony/useFollowScroll';
import { formatTeamsTime } from '../sony/teamsTime';
import {
  ChevronLeft, ChevronRight, PlusIcon, TeamsMark, PeopleIcon, CalendarIcon,
  TeamsCopilotAsset, TeamsVideoAsset, TeamsActivityAsset, TeamsSearchAsset,
  TeamsComposeAsset, TeamsOverflowAsset, TeamsImageAsset,
  TeamsChatRailAsset, TeamsSendAsset, EmojiIcon, PaperclipIcon, LoopIcon,
} from '../sony/icons';
import { SALES_CLOUD_CONFIG as C } from './config';

interface Sent {
  id: number;
  text: string;
  at: number;
}

/**
 * /sales-cloud — Phase 1 visual foundation. Reuses the existing `.tms-*`
 * Teams-style shell classes and icons, with no legacy-scene content and no network
 * calls. Sending a message only shows a clear "not connected" notice; no CRM
 * answers are generated. This is a simulated interface, not a Microsoft Teams
 * integration, and the assistant is not Salesforce Agentforce.
 */
export function SalesCloudExperience({ now = Date.now }: { now?: () => number }) {
  const [prompt, setPrompt] = useState('');
  const [sent, setSent] = useState<Sent[]>([]);
  const scrollRef = useFollowScroll<HTMLDivElement>(`${sent.length}`);

  const canSend = prompt.trim().length > 0;
  const submit = () => {
    if (!canSend) return;
    setSent((s) => [...s, { id: s.length + 1, text: prompt.trim(), at: now() }]);
    setPrompt('');
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="sony-shell">
      <div className="sony-scene-viewport">
        <div className="sony-scene-inner">
          <div className="tms" data-theme="teams" data-experience="sales-cloud">
            <div className="tms-topbar">
              <div className="tms-topbar-left">
                <button className="tms-icon-btn" aria-label="Back"><ChevronLeft size={16} /></button>
                <button className="tms-icon-btn" aria-label="Forward"><ChevronRight size={16} /></button>
              </div>
              <div className="tms-search"><TeamsSearchAsset size={15} /><span>Search</span></div>
              <div className="tms-topbar-right">
                <button className="tms-topbar-more" aria-label="Settings and more" title="Settings and more"><TeamsOverflowAsset size={16} /></button>
                <button className="tms-profile" aria-label={`${C.userName}, available`}>
                  <span className="tms-profile-name">{C.userName}</span>
                  <span className="tms-profile-avatar" aria-hidden="true">
                    {C.userInitials}<span className="tms-presence" />
                  </span>
                </button>
              </div>
            </div>

            <div className="tms-body">
              <nav className="tms-rail" aria-label="Teams-style navigation">
                <div className="tms-rail-brand" aria-hidden="true"><TeamsMark size={28} /></div>
                <button className="tms-rail-item tms-rail-item-chat-selected" aria-label="Chat" title="Chat"><TeamsChatRailAsset size={31} /></button>
                <button className="tms-rail-item" aria-label="Meet" title="Meet"><TeamsVideoAsset size={22} /></button>
                <button className="tms-rail-item" aria-label="Teams" title="Teams"><PeopleIcon size={22} /></button>
                <button className="tms-rail-item" aria-label="Copilot" title="Copilot"><TeamsCopilotAsset size={24} /></button>
                <button className="tms-rail-item" aria-label="Calendar" title="Calendar"><CalendarIcon size={22} /></button>
                <button className="tms-rail-item" aria-label="Activity" title="Activity"><TeamsActivityAsset size={22} /></button>
              </nav>

              <aside className="tms-sidebar" aria-label="Chat">
                <div className="tms-sidebar-head">
                  <span className="tms-sidebar-title">Chat</span>
                  <div className="tms-sidebar-head-actions">
                    <button className="tms-sb-action" aria-label="Search chat" title="Search"><TeamsSearchAsset size={15} /></button>
                    <button className="tms-sb-action" aria-label="Meet now" title="Meet now"><TeamsVideoAsset size={16} /></button>
                    <button className="tms-sb-action" aria-label="New chat" title="New chat"><TeamsComposeAsset size={15} /></button>
                  </div>
                </div>
                <div className="tms-sidebar-filters" aria-hidden="true">
                  <span className="tms-filter tms-filter-active">Recent</span>
                  <span className="tms-filter">Unread</span>
                  <span className="tms-filter">Meeting chats</span>
                </div>
                <div className="tms-sidebar-section">
                  <span className="tms-sidebar-label">Favorites</span>
                  <ul className="tms-chats">
                    <li className="tms-chat tms-chat-active" aria-current="true">
                      <button className="tms-chat-btn">
                        <span className="tms-chat-avatar tms-chat-avatar-plain" aria-hidden="true">{C.assistantInitials}</span>
                        <span className="tms-chat-meta">
                          <span className="tms-chat-name">{C.assistantName}</span>
                          <span className="tms-chat-preview">{C.assistantPreview}</span>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </aside>

              <section className="tms-main" aria-label="Conversation">
                <header className="tms-conv-header">
                  <span className="tms-conv-avatar tms-conv-avatar-plain" aria-hidden="true">{C.assistantInitials}</span>
                  <div className="tms-conv-titles">
                    <span className="tms-conv-title">{C.assistantName}</span>
                    <span className="tms-conv-sub">{C.team} · {C.statusLabel}</span>
                  </div>
                  <div className="tms-conv-actions">
                    <button className="tms-conv-action" aria-label="Video call" title="Video call"><TeamsVideoAsset size={18} /></button>
                    <button className="tms-conv-action" aria-label="More options" title="More options"><TeamsOverflowAsset size={16} /></button>
                  </div>
                </header>

                <div className="tms-messages" ref={scrollRef}>
                  {sent.length === 0 ? (
                    <div className="crm-empty" data-testid="crm-empty">
                      <span className="crm-empty-avatar" aria-hidden="true">{C.assistantInitials}</span>
                      <h1 className="crm-empty-title">{C.emptyTitle}</h1>
                      <p className="crm-empty-intro">{C.emptyIntro}</p>
                      <p className="crm-empty-heading">{C.suggestionsHeading}</p>
                      <div className="crm-chips" role="group" aria-label="Example prompts">
                        {C.suggestedPrompts.map((p) => (
                          <button key={p} className="crm-chip" onClick={() => setPrompt(p)}>{p}</button>
                        ))}
                      </div>
                      <p className="crm-empty-note">{C.suggestionsNote}</p>
                    </div>
                  ) : (
                    sent.map((m, i) => (
                      <div key={m.id} className="crm-exchange">
                        {i === 0 && <div className="tms-daysep"><span>{formatTeamsTime(m.at)}</span></div>}
                        <div className="tms-turn tms-turn-user">
                          <div className="tms-user-wrap">
                            <div className="tms-bubble tms-bubble-user">{m.text}</div>
                            <span className="tms-delivery">Not sent</span>
                          </div>
                        </div>
                        <div className="tms-turn tms-turn-assistant">
                          <span className="tms-turn-avatar crm-turn-avatar" aria-hidden="true">{C.assistantInitials}</span>
                          <div className="tms-turn-content">
                            <div className="tms-turn-meta">
                              <span className="tms-turn-name">{C.assistantName}</span>
                              <span className="tms-context-label">{C.statusLabel}</span>
                            </div>
                            <div className="crm-notice" role="status">{C.notConnectedNotice}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="tms-composer">
                  <div className="tms-composer-box">
                    <textarea
                      className="tms-composer-field"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={onKeyDown}
                      rows={1}
                      placeholder={C.composerPlaceholder}
                      aria-label={`Message ${C.assistantName}`}
                    />
                    <div className="tms-composer-tools">
                      <button className="tms-tool" aria-label="Emoji" title="Emoji" tabIndex={-1}><EmojiIcon size={18} /></button>
                      <button className="tms-tool" aria-label="Attach file" title="Attach file" tabIndex={-1}><PaperclipIcon size={18} /></button>
                      <button className="tms-tool" aria-label="Attach image" title="Attach image" tabIndex={-1}><TeamsImageAsset size={18} /></button>
                      <button className="tms-tool" aria-label="Loop component" title="Loop component" tabIndex={-1}><LoopIcon size={18} /></button>
                      <button className="tms-tool" aria-label="More actions" title="More actions" tabIndex={-1}><PlusIcon size={18} /></button>
                      <span className="tms-tool-divider" aria-hidden="true" />
                      <button className="tms-composer-sendbtn" onClick={submit} disabled={!canSend} aria-label="Send" title="Send">
                        <TeamsSendAsset size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="crm-disclosure">{C.disclosure}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
