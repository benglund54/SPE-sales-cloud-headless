import { useState } from 'react';
import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { PlayStationDecisionCard } from './PlayStationDecisionCard';
import { useConversation } from './useConversation';
import { useFollowScroll } from './useFollowScroll';
import { TEAMS_PROMPT, TEAMS_STAGES, TEAMS_SECTION_COUNT } from './interactiveFixtures';
import {
  TeamsLogo, AdvisorIcon, TeamsChatIcon, VideoIcon, PeopleIcon, BellIcon,
  SearchIcon, ChevronLeft, ChevronRight, DotsIcon, SendIcon, PlusIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  reducedMotion?: boolean;
}

const TEAM = 'Sony IP360';
const CONVERSATION = 'PlayStation Participation';
const ASSISTANT = 'Sony IP360 Advisor';
const CONTEXT_LABEL = 'Grounded in Sony IP360';
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
export function TeamsScene({ context, activationUrl, reducedMotion = false }: Props) {
  const [view, setView] = useState<View>('planning');
  const [prompt, setPrompt] = useState(TEAMS_PROMPT);
  const convo = useConversation({
    progressStages: TEAMS_STAGES,
    sectionCount: TEAMS_SECTION_COUNT,
    reducedMotion,
  });
  const scrollRef = useFollowScroll<HTMLDivElement>(`${view}:${convo.phase}:${convo.currentStage ?? ''}:${convo.revealed}`);

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
          <button className="tms-icon-btn" aria-label="Back"><ChevronLeft size={15} /></button>
          <button className="tms-icon-btn" aria-label="Forward"><ChevronRight size={15} /></button>
        </div>
        <div className="tms-search"><SearchIcon size={14} /><span>Search</span></div>
        <div className="tms-topbar-right"><span className="tms-account">Sony IP360</span></div>
      </div>

      <div className="tms-body">
        {/* App rail */}
        <nav className="tms-rail" aria-label="Teams">
          <div className="tms-rail-brand" aria-hidden="true"><TeamsLogo size={28} /></div>
          <div className="tms-rail-item tms-rail-item-active"><TeamsChatIcon size={22} /><span>Chat</span></div>
          <div className="tms-rail-item"><VideoIcon size={22} /><span>Meet</span></div>
          <div className="tms-rail-item"><PeopleIcon size={22} /><span>Teams</span></div>
          <div className="tms-rail-item"><AdvisorIcon size={20} /><span>Copilot</span></div>
          <div className="tms-rail-item"><BellIcon size={22} /><span>Activity</span></div>
        </nav>

        {/* Chat navigation sidebar — selecting the Advisor enters the chat */}
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
                  <span className="tms-chat-avatar" aria-hidden="true"><AdvisorIcon size={18} /></span>
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
              <div className="tms-conv-actions" aria-hidden="true"><VideoIcon size={18} /><DotsIcon size={16} /></div>
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
              <div className="tms-composer-box"><span className="tms-composer-input">Message IP360 Planning</span><span className="tms-composer-send"><SendIcon size={18} /></span></div>
            </div>
          </section>
        ) : (
          <section className="tms-main" aria-label="Conversation">
            <header className="tms-conv-header">
              <span className="tms-conv-avatar" aria-hidden="true"><AdvisorIcon size={20} /></span>
              <div className="tms-conv-titles">
                <span className="tms-conv-title">{ASSISTANT}</span>
                <span className="tms-conv-sub">{TEAM} · {CONVERSATION}</span>
              </div>
              <div className="tms-conv-actions" aria-hidden="true"><VideoIcon size={18} /><DotsIcon size={16} /></div>
            </header>

            <div className="tms-messages" ref={scrollRef}>
              {convo.submitted && (
                <div className="tms-turn tms-turn-user">
                  <div className="tms-bubble tms-bubble-user">{TEAMS_PROMPT}</div>
                </div>
              )}

              {convo.submitted && (
                <div className="tms-turn tms-turn-assistant">
                  <span className="tms-turn-avatar" aria-hidden="true"><AdvisorIcon size={18} /></span>
                  <div className="tms-turn-content">
                    <div className="tms-turn-meta">
                      <span className="tms-turn-name">{ASSISTANT}</span>
                      <span className="tms-context-label">{CONTEXT_LABEL}</span>
                    </div>

                    {convo.phase === 'thinking' && convo.currentStage && (
                      <div className="tms-progress" role="status">
                        <span className="tms-progress-dot" aria-hidden="true" />
                        <span>{convo.currentStage}</span>
                      </div>
                    )}

                    {(convo.phase === 'revealing' || convo.phase === 'done') && (
                      <>
                        <div className="tms-bubble tms-bubble-assistant">{COPILOT_LEAD_IN}</div>
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

            {/* Interactive composer with the preloaded prompt */}
            <div className="tms-composer">
              <div className="tms-composer-box">
                <textarea
                  className="tms-composer-field"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={convo.handleComposerKeyDown}
                  disabled={convo.busy || convo.phase === 'done'}
                  rows={1}
                  aria-label="Message Sony IP360 Advisor"
                />
                <button
                  className="tms-composer-sendbtn"
                  onClick={convo.submit}
                  disabled={convo.busy || convo.phase === 'done' || convo.submitted}
                  aria-label="Send"
                >
                  <SendIcon size={18} />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
