import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { CollaborationRequest } from './CollaborationRequest';
import {
  SlackLogo, SonyAdvisorMark, SearchIcon, ChevronLeft, ChevronRight, ClockIcon, HelpIcon,
  HomeIcon, ChatBubbleIcon, BellIcon, PlusIcon, DotsIcon,
  ThreadsIcon, HeadphonesIcon, RecapIcon, DirectoryIcon, StarIcon, ComposeIcon, GearIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const WORKSPACE = 'Sony';
const CHANNEL = 'sony-ip360-fy27';
const CHANNELS = ['sony-ip360-fy27', 'general', 'ip-strategy', 'emea-planning'];

/**
 * Reference-exact Slack desktop shell (semantic React + CSS). Narrow dark global
 * app rail (workspace tile + Today/Home/DMs/Activity/Files/Agents/add/account),
 * dark-gray workspace sidebar (title row, Find-a-conversation, Threads/Huddles/
 * Recap/Directories, Starred, Channels with #sony-ip360-fy27 selected, DMs,
 * Apps), and a light channel surface with native header, tabs, and composer.
 *
 * The Sony IP360 Advisor posts a Block-Kit-style app message (its own Sony
 * identity — NOT the Slack logo). No fake human sender, timestamp, unread/member
 * counts, reactions, or the reference's synthetic-demo disclaimer.
 */
export function SlackScene({ context, activationUrl }: Props) {
  return (
    <div className="slk" data-theme="slack">
      {/* Top window/search bar */}
      <div className="slk-topbar">
        <div className="slk-topbar-nav">
          <button className="slk-icon-btn" aria-label="Back"><ChevronLeft size={15} /></button>
          <button className="slk-icon-btn" aria-label="Forward"><ChevronRight size={15} /></button>
          <button className="slk-icon-btn" aria-label="History"><ClockIcon size={15} /></button>
        </div>
        <div className="slk-search"><SearchIcon size={14} /><span>Search {WORKSPACE}</span></div>
        <div className="slk-topbar-right">
          <button className="slk-icon-btn" aria-label="Help"><HelpIcon size={15} /></button>
        </div>
      </div>

      <div className="slk-body">
        {/* Far-left global app rail */}
        <nav className="slk-rail" aria-label="Slack">
          <button className="slk-rail-ws" aria-label="Sony workspace">
            <span className="slk-rail-ws-tile">S</span>
          </button>
          <div className="slk-rail-items">
            <div className="slk-rail-item slk-rail-item-active"><HomeIcon size={19} /><span>Home</span></div>
            <div className="slk-rail-item"><ChatBubbleIcon size={19} /><span>DMs</span></div>
            <div className="slk-rail-item"><BellIcon size={19} /><span>Activity</span></div>
            <div className="slk-rail-item"><DirectoryIcon size={19} /><span>Files</span></div>
            <div className="slk-rail-item"><DotsIcon size={19} /><span>More</span></div>
          </div>
          <div className="slk-rail-bottom">
            <button className="slk-rail-add" aria-label="Add"><PlusIcon size={17} /></button>
            <div className="slk-rail-avatar" aria-hidden="true" />
          </div>
        </nav>

        {/* Workspace / channel sidebar */}
        <aside className="slk-sidebar" aria-label="Workspace">
          <div className="slk-sidebar-head">
            <span className="slk-ws-title">{WORKSPACE}</span>
            <span className="slk-ws-caret" aria-hidden="true">▾</span>
            <div className="slk-sidebar-head-actions" aria-hidden="true">
              <GearIcon size={14} /><ComposeIcon size={14} />
            </div>
          </div>
          <div className="slk-find"><SearchIcon size={13} /><span>Find a conversation…</span></div>

          <ul className="slk-quick">
            <li className="slk-quick-item"><ThreadsIcon size={16} /><span>Threads</span></li>
            <li className="slk-quick-item"><HeadphonesIcon size={16} /><span>Huddles</span></li>
            <li className="slk-quick-item"><RecapIcon size={16} /><span>Recap</span></li>
            <li className="slk-quick-item"><DirectoryIcon size={16} /><span>Directories</span></li>
          </ul>

          <div className="slk-sidebar-section">
            <span className="slk-sidebar-label"><StarIcon size={12} /> Starred</span>
          </div>

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
              <li className="slk-channel slk-channel-add"><span className="slk-channel-hash">+</span><span>Add channels</span></li>
            </ul>
          </div>

          <div className="slk-sidebar-section">
            <span className="slk-sidebar-label">Direct messages</span>
          </div>
          <div className="slk-sidebar-section">
            <span className="slk-sidebar-label">Apps</span>
            <ul className="slk-channels">
              <li className="slk-channel slk-channel-app">
                <span className="slk-channel-appdot" aria-hidden="true" />
                <span className="slk-channel-name">Sony IP360 Advisor</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Channel content */}
        <section className="slk-main" aria-label="Channel">
          <header className="slk-channel-header">
            <div className="slk-channel-title">
              <SlackLogo size={16} />
              <span className="slk-channel-h"># {CHANNEL}</span>
            </div>
            <div className="slk-channel-header-right">
              <div className="slk-channel-tabs">
                <span className="slk-tab slk-tab-active">Messages</span>
                <span className="slk-tab">Add canvas</span>
              </div>
              <div className="slk-channel-actions" aria-hidden="true">
                <SearchIcon size={15} /><DotsIcon size={15} />
              </div>
            </div>
          </header>

          <div className="slk-messages">
            <div className="slk-msg">
              <div className="slk-msg-avatar" aria-hidden="true">
                <SonyAdvisorMark size={24} />
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

          {/* Native composer with formatting + action rows */}
          <div className="slk-composer" aria-hidden="true">
            <div className="slk-composer-box">
              <div className="slk-composer-toolbar">
                <span className="slk-composer-tool" style={{ fontWeight: 700 }}>B</span>
                <span className="slk-composer-tool"><i>I</i></span>
                <span className="slk-composer-tool"><s>S</s></span>
                <span className="slk-composer-divider" />
                <span className="slk-composer-tool">🔗</span>
                <span className="slk-composer-tool">≡</span>
                <span className="slk-composer-tool">{'</>'}</span>
              </div>
              <div className="slk-composer-input">Message #{CHANNEL}</div>
              <div className="slk-composer-actions">
                <span className="slk-composer-tool"><PlusIcon size={15} /></span>
                <span className="slk-composer-tool">Aa</span>
                <span className="slk-composer-tool">😊</span>
                <span className="slk-composer-tool">@</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
