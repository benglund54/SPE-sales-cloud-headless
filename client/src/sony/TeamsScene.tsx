import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { PlayStationDecisionCard } from './PlayStationDecisionCard';
import {
  TeamsLogo, SonyAdvisorMark, TeamsChatIcon, VideoIcon, PeopleIcon, BellIcon,
  SearchIcon, ChevronLeft, ChevronRight, DotsIcon, SendIcon, PlusIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const TEAM = 'Sony IP360';
const CONVERSATION = 'PlayStation Participation';
const ASSISTANT = 'Sony IP360 Advisor';
const CONTEXT_LABEL = 'Grounded in Sony IP360';

const USER_PROMPT = 'What does PlayStation need to decide?';
const COPILOT_LEAD_IN =
  'Sony Pictures is requesting PlayStation participation in the Spider-Man EMEA connected fan opportunity. Here’s the decision brief for PlayStation.';

/**
 * Reference-exact Microsoft Teams desktop shell (semantic React + CSS). Pale
 * blue app background, narrow app rail, chat navigation sidebar, centered top
 * search field, large white conversation panel. The PlayStation decision is an
 * adaptive-card-style message inside a Sony IP360 Advisor conversation.
 *
 * Deterministic; no Microsoft/Copilot/Salesforce call. No fake participants,
 * profile images, test messages, dates, or unread counts from the reference.
 */
export function TeamsScene({ context, activationUrl }: Props) {
  return (
    <div className="tms" data-theme="teams">
      {/* Top search/window bar */}
      <div className="tms-topbar">
        <div className="tms-topbar-left">
          <button className="tms-icon-btn" aria-label="Back"><ChevronLeft size={15} /></button>
          <button className="tms-icon-btn" aria-label="Forward"><ChevronRight size={15} /></button>
        </div>
        <div className="tms-search"><SearchIcon size={14} /><span>Search</span></div>
        <div className="tms-topbar-right">
          <span className="tms-account">Sony IP360</span>
        </div>
      </div>

      <div className="tms-body">
        {/* App rail — Teams brand at top, then navigation */}
        <nav className="tms-rail" aria-label="Teams">
          <div className="tms-rail-brand" aria-hidden="true"><TeamsLogo size={28} /></div>
          <div className="tms-rail-item tms-rail-item-active"><TeamsChatIcon size={22} /><span>Chat</span></div>
          <div className="tms-rail-item"><VideoIcon size={22} /><span>Meet</span></div>
          <div className="tms-rail-item"><PeopleIcon size={22} /><span>Teams</span></div>
          <div className="tms-rail-item"><SonyAdvisorMark size={20} /><span>Copilot</span></div>
          <div className="tms-rail-item"><BellIcon size={22} /><span>Activity</span></div>
        </nav>

        {/* Chat navigation sidebar */}
        <aside className="tms-sidebar" aria-label="Chat">
          <div className="tms-sidebar-head">
            <span className="tms-sidebar-title">Chat</span>
            <div className="tms-sidebar-head-actions" aria-hidden="true">
              <SearchIcon size={15} /><VideoIcon size={16} /><PlusIcon size={15} />
            </div>
          </div>
          <div className="tms-sidebar-filters" aria-hidden="true">
            <span className="tms-filter tms-filter-active">Recent</span>
            <span className="tms-filter">Unread</span>
          </div>
          <div className="tms-sidebar-section">
            <span className="tms-sidebar-label">Favorites</span>
            <ul className="tms-chats">
              <li className="tms-chat tms-chat-active" aria-current="true">
                <span className="tms-chat-avatar" aria-hidden="true"><SonyAdvisorMark size={16} /></span>
                <span className="tms-chat-meta">
                  <span className="tms-chat-name">{ASSISTANT}</span>
                  <span className="tms-chat-preview">{CONVERSATION}</span>
                </span>
              </li>
              <li className="tms-chat">
                <span className="tms-chat-avatar tms-chat-avatar-plain" aria-hidden="true">IP</span>
                <span className="tms-chat-meta">
                  <span className="tms-chat-name">IP360 Planning</span>
                  <span className="tms-chat-preview">Group</span>
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Conversation panel */}
        <section className="tms-main" aria-label="Conversation">
          <header className="tms-conv-header">
            <span className="tms-conv-avatar" aria-hidden="true"><SonyAdvisorMark size={20} /></span>
            <div className="tms-conv-titles">
              <span className="tms-conv-title">{ASSISTANT}</span>
              <span className="tms-conv-sub">{TEAM} · {CONVERSATION}</span>
            </div>
            <div className="tms-conv-actions" aria-hidden="true">
              <VideoIcon size={18} /><DotsIcon size={16} />
            </div>
          </header>

          <div className="tms-messages">
            <div className="tms-turn tms-turn-user">
              <div className="tms-bubble tms-bubble-user">{USER_PROMPT}</div>
            </div>

            <div className="tms-turn tms-turn-assistant">
              <span className="tms-turn-avatar" aria-hidden="true"><SonyAdvisorMark size={18} /></span>
              <div className="tms-turn-content">
                <div className="tms-turn-meta">
                  <span className="tms-turn-name">{ASSISTANT}</span>
                  <span className="tms-context-label">{CONTEXT_LABEL}</span>
                </div>
                <div className="tms-bubble tms-bubble-assistant">{COPILOT_LEAD_IN}</div>
                <PlayStationDecisionCard context={context} activationUrl={activationUrl} />
              </div>
            </div>
          </div>

          {/* Native composer */}
          <div className="tms-composer" aria-hidden="true">
            <div className="tms-composer-box">
              <span className="tms-composer-input">Type a message</span>
              <span className="tms-composer-send"><SendIcon size={18} /></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
