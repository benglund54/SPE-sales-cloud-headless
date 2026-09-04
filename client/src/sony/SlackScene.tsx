import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { CollaborationRequest } from './CollaborationRequest';
import {
  SlackMark, SearchIcon, ChevronLeft, ChevronRight, ClockIcon, HelpIcon,
  HomeIcon, ChatBubbleIcon, BellIcon, PlusIcon, DotsIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const WORKSPACE = 'Sony';
const CHANNEL = 'sony-ip360-fy27';

/** Channels shown in the workspace sidebar (no unread counts / no people). */
const CHANNELS = ['sony-ip360-fy27', 'general', 'ip-strategy', 'emea-planning'];

/**
 * Reference-exact Slack desktop shell (semantic React + CSS; no screenshot
 * backgrounds). Dark far-left app rail, dark-gray Sony workspace sidebar, light
 * channel content, native top search bar and composer. The Sony IP360 Advisor
 * posts the Cross-Sony Collaboration Request as an app message in the channel.
 *
 * No fake human sender, timestamp, unread/member counts, reactions, or the
 * reference's synthetic-demo disclaimer — approved governance copy is retained.
 */
export function SlackScene({ context, activationUrl }: Props) {
  return (
    <div className="slk" data-theme="slack">
      {/* Top window/search bar */}
      <div className="slk-topbar">
        <div className="slk-topbar-nav">
          <button className="slk-icon-btn" aria-label="Back"><ChevronLeft size={16} /></button>
          <button className="slk-icon-btn" aria-label="Forward"><ChevronRight size={16} /></button>
          <button className="slk-icon-btn" aria-label="History"><ClockIcon size={16} /></button>
        </div>
        <div className="slk-search">
          <SearchIcon size={15} />
          <span>Search {WORKSPACE}</span>
        </div>
        <div className="slk-topbar-right">
          <button className="slk-icon-btn" aria-label="Help"><HelpIcon size={16} /></button>
        </div>
      </div>

      <div className="slk-body">
        {/* Far-left app rail */}
        <nav className="slk-rail" aria-label="Slack">
          <div className="slk-rail-ws" aria-hidden="true">
            <span className="slk-rail-ws-badge">S</span>
            <span className="slk-rail-ws-name">ONY</span>
          </div>
          <div className="slk-rail-items">
            <div className="slk-rail-item slk-rail-item-active">
              <HomeIcon size={20} /><span>Home</span>
            </div>
            <div className="slk-rail-item"><ChatBubbleIcon size={20} /><span>DMs</span></div>
            <div className="slk-rail-item"><BellIcon size={20} /><span>Activity</span></div>
            <div className="slk-rail-item"><DotsIcon size={20} /><span>More</span></div>
          </div>
          <div className="slk-rail-add" aria-hidden="true"><PlusIcon size={18} /></div>
        </nav>

        {/* Workspace sidebar */}
        <aside className="slk-sidebar" aria-label="Workspace">
          <div className="slk-sidebar-head">
            <span className="slk-ws-title">{WORKSPACE}</span>
            <span className="slk-ws-caret" aria-hidden="true">▾</span>
          </div>
          <div className="slk-find"><SearchIcon size={13} /><span>Find a conversation…</span></div>
          <div className="slk-sidebar-section">
            <span className="slk-sidebar-label">Channels</span>
            <ul className="slk-channels">
              {CHANNELS.map((c) => (
                <li
                  key={c}
                  className={`slk-channel ${c === CHANNEL ? 'slk-channel-active' : ''}`}
                  aria-current={c === CHANNEL ? 'true' : undefined}
                >
                  <span className="slk-channel-hash">#</span>
                  <span className="slk-channel-name">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Channel content */}
        <section className="slk-main" aria-label="Channel">
          <header className="slk-channel-header">
            <div className="slk-channel-title">
              <SlackMark size={18} />
              <span className="slk-channel-h"># {CHANNEL}</span>
            </div>
            <div className="slk-channel-tabs">
              <span className="slk-tab slk-tab-active">Messages</span>
              <span className="slk-tab">Add canvas</span>
            </div>
          </header>

          <div className="slk-messages">
            <div className="slk-msg">
              <div className="slk-msg-avatar slk-msg-avatar-app" aria-hidden="true">
                <SlackMark size={22} />
              </div>
              <div className="slk-msg-body">
                <div className="slk-msg-meta">
                  <span className="slk-msg-sender">Sony IP360 Advisor</span>
                  <span className="slk-msg-appbadge">APP</span>
                </div>
                <CollaborationRequest context={context} activationUrl={activationUrl} />
              </div>
            </div>
          </div>

          {/* Native composer */}
          <div className="slk-composer" aria-hidden="true">
            <div className="slk-composer-box">
              <div className="slk-composer-toolbar">
                <span className="slk-composer-tool">B</span>
                <span className="slk-composer-tool"><i>I</i></span>
                <span className="slk-composer-tool">S</span>
                <span className="slk-composer-tool">🔗</span>
              </div>
              <div className="slk-composer-input">Message #{CHANNEL}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
