import { useState } from 'react';
import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { PlayStationDecisionCard } from './PlayStationDecisionCard';
import { useConversation } from './useConversation';
import { useFollowScroll } from './useFollowScroll';
import { TEAMS_PROMPT, TEAMS_STAGES, TEAMS_SECTION_COUNT } from './interactiveFixtures';
import { formatTeamsTime } from './teamsTime';
import {
  AdvisorIcon, ChevronLeft, ChevronRight, PlusIcon,
  TeamsMark, PeopleIcon, CalendarIcon,
  TeamsCopilotAsset, TeamsVideoAsset, TeamsActivityAsset,
  TeamsSearchAsset, TeamsComposeAsset, TeamsOverflowAsset, TeamsCheckAsset,
  TeamsImageAsset, TeamsChatRailAsset, TeamsSendAsset, EmojiIcon, PaperclipIcon, LoopIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  reducedMotion?: boolean;
  /** Injectable clock for deterministic timestamp tests. Defaults to Date.now. */
  now?: () => number;
}

const TEAM = 'Sony IP360';
const CONVERSATION = 'PlayStation Participation';
const ASSISTANT = 'Sony IP360 Advisor';
const CONTEXT_LABEL = 'Grounded in Sony IP360';
const PLACEHOLDER = 'Type a message';
const COPILOT_LEAD_IN =
  'Sony Pictures is requesting PlayStation participation in the Spider-Man EMEA connected fan opportunity. Here’s the decision brief for PlayStation.';

type View = 'planning' | 'advisor';

/**
 * Teams — the default/primary headless scene (HX-6V-D). Opens on an "IP360
 * Planning" channel showing a Sony IP360 Advisor notification of the governed
 * opportunity. The presenter selects the Advisor chat, then submits the
 * preloaded question; the PlayStation decision brief reveals progressively.
 *
 * Deterministic; no Microsoft/Copilot/Salesforce call. No fake participants,
 * dates, or unread counts.
 */
export function TeamsScene({ context, activationUrl, reducedMotion = false, now = Date.now }: Props) {
  const [view, setView] = useState<View>('planning');
  const [prompt, setPrompt] = useState(TEAMS_PROMPT);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const convo = useConversation({
    progressStages: TEAMS_STAGES,
    sectionCount: TEAMS_SECTION_COUNT,
    reducedMotion,
    stageMs: reducedMotion ? 150 : 1550,   // ~4.7s reasoning across 3 states
    revealMs: reducedMotion ? 70 : 640,    // ~4.5–5s progressive reveal (7 steps)
  });
  const scrollRef = useFollowScroll<HTMLDivElement>(`${view}:${convo.phase}:${convo.currentStage ?? ''}:${convo.revealed}`);

  // Submit wrapper: capture the local time ONCE, clear the composer to the
  // placeholder, then run the conversation. Guards against duplicate sends.
  const submit = () => {
    if (convo.submitted || convo.busy) return;
    setSentAt(now());
    setPrompt('');
    convo.submit();
  };
  const onComposerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    // Shift+Enter: allow default newline.
  };
  const canSend = prompt.trim().length > 0 && !convo.submitted && !convo.busy;

  const { audience, governance, modelScores, releaseMoments, opCoRoles, evidenceSignals } = context;
  const engagement = modelScores.find((m) => m.label === 'Engagement Score');
  const crossAffinity = modelScores.find((m) => m.label === 'Cross-Affinity Score');
  const whitespace = modelScores.find((m) => m.label === 'Whitespace Score');
  const lead = opCoRoles.find((r) => r.participationStatus === 'Accountable');
  const participants = opCoRoles.filter((r) => r.participationStatus === 'Pending');
  const bnd = releaseMoments.find((r) => r.title === 'Spider-Man: Brand New Day');
  const bsv = releaseMoments.find((r) => r.title === 'Beyond the Spider-Verse');

  return (
    <div className="tms" data-theme="teams">
      <div className="tms-topbar">
        <div className="tms-topbar-left">
          <button className="tms-icon-btn" aria-label="Back"><ChevronLeft size={16} /></button>
          <button className="tms-icon-btn" aria-label="Forward"><ChevronRight size={16} /></button>
        </div>
        <div className="tms-search"><TeamsSearchAsset size={15} /><span>Search</span></div>
        <div className="tms-topbar-right">
          <button className="tms-topbar-more" aria-label="Settings and more" title="Settings and more"><TeamsOverflowAsset size={16} /></button>
          <button className="tms-profile" aria-label="Brian Englund, available">
            <span className="tms-profile-name">Brian Englund</span>
            <span className="tms-profile-avatar" aria-hidden="true">
              BE<span className="tms-presence" />
            </span>
          </button>
        </div>
      </div>

      <div className="tms-body">
        {/* Icon-only app rail. Each destination shows its correct symbol: the
            Teams brand mark, a speech-bubble Chat, a camera Meet, a people
            Teams glyph, the genuine multicolor Copilot mark, a calendar, and a
            bell Activity. (Committed PNGs that did not visibly match — chat=
            panel, teams=grid, calendar=contact card — are replaced with crisp
            outline SVGs; genuine assets are kept only where they truly match.) */}
        <nav className="tms-rail" aria-label="Teams">
          <div className="tms-rail-brand" aria-hidden="true"><TeamsMark size={28} /></div>
          <button className="tms-rail-item tms-rail-item-active" aria-label="Chat" title="Chat"><TeamsChatRailAsset size={24} /></button>
          <button className="tms-rail-item" aria-label="Meet" title="Meet"><TeamsVideoAsset size={22} /></button>
          <button className="tms-rail-item" aria-label="Teams" title="Teams"><PeopleIcon size={22} /></button>
          <button className="tms-rail-item" aria-label="Copilot" title="Copilot"><TeamsCopilotAsset size={24} /></button>
          <button className="tms-rail-item" aria-label="Calendar" title="Calendar"><CalendarIcon size={22} /></button>
          <button className="tms-rail-item" aria-label="Activity" title="Activity"><TeamsActivityAsset size={22} /></button>
        </nav>

        {/* Chat navigation sidebar — selecting the Advisor enters the chat */}
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
              <li className={`tms-chat ${view === 'planning' ? 'tms-chat-active' : ''}`}>
                <button className="tms-chat-btn" onClick={() => setView('planning')}>
                  <span className="tms-chat-avatar tms-chat-avatar-plain" aria-hidden="true">IP</span>
                  <span className="tms-chat-meta">
                    <span className="tms-chat-name">IP360 Planning</span>
                    <span className="tms-chat-preview">Channel</span>
                  </span>
                </button>
              </li>
              <li className={`tms-chat ${view === 'advisor' ? 'tms-chat-active' : ''}`} aria-current={view === 'advisor' ? 'true' : undefined}>
                <button className="tms-chat-btn" onClick={() => setView('advisor')}>
                  <span className="tms-chat-avatar tms-chat-avatar-advisor" aria-hidden="true"><AdvisorIcon size={27} /></span>
                  <span className="tms-chat-meta">
                    <span className="tms-chat-name">{ASSISTANT}</span>
                    <span className="tms-chat-preview">{CONVERSATION}</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main pane switches between the planning-channel notification and the
            Advisor direct chat. */}
        {view === 'planning' ? (
          <section className="tms-main" aria-label="IP360 Planning">
            <header className="tms-conv-header">
              <span className="tms-conv-avatar tms-conv-avatar-plain" aria-hidden="true">IP</span>
              <div className="tms-conv-titles">
                <span className="tms-conv-title">IP360 Planning</span>
                <span className="tms-conv-sub">{TEAM} · Channel</span>
              </div>
              <div className="tms-conv-actions" aria-hidden="true"><TeamsVideoAsset size={18} /><TeamsOverflowAsset size={16} /></div>
            </header>
            <div className="tms-messages" ref={scrollRef}>
              <div className="tms-turn tms-turn-assistant">
                <span className="tms-turn-avatar" aria-hidden="true"><AdvisorIcon size={20} /></span>
                <div className="tms-turn-content">
                  <div className="tms-turn-meta">
                    <span className="tms-turn-name">{ASSISTANT}</span>
                    <span className="tms-context-label">{CONTEXT_LABEL}</span>
                  </div>
                  {/* Teams-native adaptive card — same information hierarchy as
                      the Slack notification, rendered in Teams styling. Wide,
                      responsive two-column layout (collapses to one column when
                      width genuinely requires it via CSS). */}
                  <article className="tms-notify" aria-label="Governed opportunity notification">
                    <div className="tms-notify-head">
                      <span className="tms-notify-tag">Cross-Sony Collaboration Request</span>
                    </div>
                    <h2 className="tms-notify-title">Spider-Man EMEA opportunity ready for review</h2>
                    <p className="tms-notify-source">Source: Governed Sony IP360 CRM signals</p>
                    <p className="tms-notify-audience">Audience: {audience.name}</p>

                    {/* Metric chips */}
                    <div className="tms-notify-metrics">
                      <span className="tms-chip"><b>{audience.size}</b> qualified {context.region} audience</span>
                      <span className="tms-chip"><b>{audience.opportunityScore}</b> opportunity / priority · #{audience.qualifiedOpportunityRank}</span>
                      <span className="tms-chip"><b>{engagement?.value}</b> engagement score</span>
                      <span className="tms-chip"><b>{crossAffinity?.value}</b> cross-affinity score</span>
                      <span className="tms-chip"><b>{whitespace?.value}</b> whitespace score</span>
                    </div>

                    <div className="tms-notify-grid">
                      {/* LEFT column */}
                      <div className="tms-notify-col">
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">Why now</h3>
                          <p>{context.scenes.slack.whyNow}</p>
                        </section>
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">IP moments</h3>
                          <ul className="tms-notify-moments">
                            <li><b>{bnd?.title}</b> — {bnd?.status}</li>
                            <li><b>{bsv?.title}</b> — {bsv?.status}</li>
                          </ul>
                        </section>
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">Connected fan idea</h3>
                          <p>{context.scenes.slack.experienceSummary}. Pictures-led fan moment extended through eligible PlayStation and Sony Music experiences.</p>
                        </section>
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">Contributing signals</h3>
                          <ul className="tms-notify-signals">
                            {evidenceSignals.map((s) => <li key={s.label}>{s.label}</li>)}
                          </ul>
                        </section>
                      </div>

                      {/* RIGHT column */}
                      <div className="tms-notify-col">
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">OpCo status</h3>
                          <ul className="tms-notify-opcos">
                            {lead && (
                              <li><span className="tms-dot tms-dot-lead" aria-hidden="true" /><b>{lead.name}</b> — {lead.role}</li>
                            )}
                            {participants.map((p) => (
                              <li key={p.name}><span className="tms-dot tms-dot-pending" aria-hidden="true" /><b>{p.name}</b> — Participation pending</li>
                            ))}
                          </ul>
                        </section>
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">Lifecycle</h3>
                          <p>{governance.currentLifecycleStage} → {governance.nextLifecycleStage}</p>
                          <p className="tms-notify-rights">Rights review — pending</p>
                        </section>
                        <section className="tms-notify-block">
                          <h3 className="tms-notify-h">Decisions needed</h3>
                          <ol className="tms-notify-decisions">
                            {context.decisions.shared.map((d) => <li key={d}>{d}</li>)}
                          </ol>
                        </section>
                      </div>
                    </div>

                    <div className="tms-notify-banner">{governance.statusBanner}</div>
                    <button className="tms-notify-cta" onClick={() => setView('advisor')}>
                      Open Sony IP360 Advisor →
                    </button>
                  </article>
                </div>
              </div>
            </div>
            <div className="tms-composer" aria-hidden="true">
              <div className="tms-composer-box"><span className="tms-composer-input">Message IP360 Planning</span></div>
            </div>
          </section>
        ) : (
          <section className="tms-main" aria-label="Conversation">
            <header className="tms-conv-header">
              <span className="tms-conv-avatar" aria-hidden="true"><AdvisorIcon size={22} /></span>
              <div className="tms-conv-titles">
                <span className="tms-conv-title">{ASSISTANT}</span>
                <span className="tms-conv-sub">{TEAM} · {CONVERSATION}</span>
              </div>
              <div className="tms-conv-actions">
                <button className="tms-conv-action" aria-label="Video call" title="Video call"><TeamsVideoAsset size={18} /></button>
                <button className="tms-conv-action" aria-label="More options" title="More options"><TeamsOverflowAsset size={16} /></button>
              </div>
            </header>

            <div className="tms-messages" ref={scrollRef}>
              {convo.submitted && sentAt !== null && (
                <div className="tms-daysep"><span>{formatTeamsTime(sentAt)}</span></div>
              )}

              {convo.submitted && (
                <div className="tms-turn tms-turn-user">
                  <div className="tms-user-wrap">
                    <div className="tms-bubble tms-bubble-user">{TEAMS_PROMPT}</div>
                    <span className="tms-delivery"><TeamsCheckAsset size={13} /> Sent</span>
                  </div>
                </div>
              )}

              {convo.submitted && (
                <div className="tms-turn tms-turn-assistant">
                  <span className="tms-turn-avatar" aria-hidden="true"><AdvisorIcon size={20} /></span>
                  <div className="tms-turn-content">
                    <div className="tms-turn-meta">
                      <span className="tms-turn-name">{ASSISTANT}</span>
                      <span className="tms-context-label">{CONTEXT_LABEL}</span>
                    </div>

                    {convo.phase === 'thinking' && convo.currentStage && (
                      <div className="tms-progress" role="status" aria-live="polite">
                        <span className="tms-progress-mark" aria-hidden="true"><AdvisorIcon size={16} /></span>
                        <span key={convo.currentStage} className="tms-progress-text">{convo.currentStage}</span>
                      </div>
                    )}

                    {(convo.phase === 'revealing' || convo.phase === 'done') && (
                      <>
                        <div className="tms-bubble tms-bubble-assistant tms-ps-reveal">{COPILOT_LEAD_IN}</div>
                        <PlayStationDecisionCard
                          context={context}
                          activationUrl={activationUrl}
                          revealed={convo.phase === 'done' ? TEAMS_SECTION_COUNT : convo.revealed}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Teams composer with tool controls */}
            <div className="tms-composer">
              <div className="tms-composer-box">
                <textarea
                  className="tms-composer-field"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={onComposerKeyDown}
                  disabled={convo.busy || convo.phase === 'done'}
                  rows={1}
                  placeholder={PLACEHOLDER}
                  aria-label="Message Sony IP360 Advisor"
                />
                <div className="tms-composer-tools">
                  <button className="tms-tool" aria-label="Emoji" title="Emoji" tabIndex={-1}><EmojiIcon size={18} /></button>
                  <button className="tms-tool" aria-label="Attach file" title="Attach file" tabIndex={-1}><PaperclipIcon size={18} /></button>
                  <button className="tms-tool" aria-label="Attach image" title="Attach image" tabIndex={-1}><TeamsImageAsset size={18} /></button>
                  <button className="tms-tool" aria-label="Loop component" title="Loop component" tabIndex={-1}><LoopIcon size={18} /></button>
                  <button className="tms-tool" aria-label="More actions" title="More actions" tabIndex={-1}><PlusIcon size={18} /></button>
                  <span className="tms-tool-divider" aria-hidden="true" />
                  <button
                    className="tms-composer-sendbtn"
                    onClick={submit}
                    disabled={!canSend}
                    aria-label="Send"
                    title="Send"
                  >
                    <TeamsSendAsset size={20} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
