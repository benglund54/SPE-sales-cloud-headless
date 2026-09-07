import { useState } from 'react';
import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ExecutiveBrief } from './ExecutiveBrief';
import { useConversation } from './useConversation';
import { useFollowScroll } from './useFollowScroll';
import { CLAUDE_PROMPT, CLAUDE_STAGES, CLAUDE_SECTION_COUNT } from './interactiveFixtures';
import {
  ClaudeStar, ClaudeThinkingMark, ClaudeDesignAsset,
  ClaudeGhostIcon, ClaudeProjectsIcon, ClaudeArtifactsIcon, ClaudeCodeIcon, ClaudeCustomizeIcon,
  PlusIcon, SearchIcon,
  MicIcon, ChevronDownIcon, DownloadIcon, SidebarToggleIcon, SlidersIcon,
  ShareIcon, PencilIcon, TrendIcon, GradCapIcon, CoffeeIcon,
} from './icons';
import type { CSSProperties } from 'react';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  reducedMotion?: boolean;
}

const CLAUDE_LEAD_IN =
  'Here’s the decision brief. The opportunity is strong enough to advance to cross-OpCo review, but not to activation.';
// Time-neutral greeting for the presentation — never a time-of-day calculation.
const GREETING = 'Brian Englund returns!';
const CONVERSATION_TITLE = 'Sony IP Council executive brief';
const HOME_PLACEHOLDER = 'How can I help you today?';
const CONVO_PLACEHOLDER = 'Write a message…';
// Subdued recent-chat rows (decorative). Kept realistic without any
// synthetic/demo/mock wording, which the governed narrative disallows.
const RECENT_CHATS = [
  'Salesforce connector recent accounts',
  'Executive briefing UI review for Sony',
  'Interactive Tableau dashboard layout',
];
// Suggestion chips (decorative) — icon + label.
const SUGGESTIONS: { label: string; Icon: (p: { size?: number; className?: string; style?: CSSProperties }) => JSX.Element }[] = [
  { label: 'Code', Icon: ClaudeCodeIcon },
  { label: 'Write', Icon: PencilIcon },
  { label: 'Strategize', Icon: TrendIcon },
  { label: 'Learn', Icon: GradCapIcon },
  { label: 'Life stuff', Icon: CoffeeIcon },
];

/**
 * Familiar Claude WEB-CHAT scene (HX-6V-L) — replaces the former Cowork shell.
 * Two states in one React tree:
 *   • home        — greeting + large preloaded composer + suggestion pills
 *   • conversation — user bubble, deterministic thinking, then the governed
 *                    Sony IP360 executive brief revealed progressively.
 * Deterministic: no live Claude call, no token streaming, no web research —
 * all content is the governed fixture. The thinking/writing mark is the supplied
 * animated GIF used directly (no CSS animation on top); reduced motion swaps to
 * the static starburst.
 */
export function ClaudeScene({ context, activationUrl, reducedMotion = false }: Props) {
  const [prompt, setPrompt] = useState(CLAUDE_PROMPT);
  const convo = useConversation({
    progressStages: CLAUDE_STAGES,
    sectionCount: CLAUDE_SECTION_COUNT,
    // Thinking ≈ 3.9s (5 stages × 780ms); response build ≈ 5.8s (9 increments
    // × 640ms) with a ~260ms entrance; ≈ 10–11s total Send→done.
    stageMs: 780,
    revealMs: 640,
    reducedMotion,
  });
  // Gentler, contained follow: reveal only enough to keep the newest content
  // above the composer (never slams past unread sections; never the viewport).
  const scrollRef = useFollowScroll<HTMLDivElement>(
    `${convo.phase}:${convo.stageIndex}:${convo.revealed}`,
    { smooth: true, reducedMotion, mode: 'frontier' }
  );

  // The view is derived from submission — a single tree, no reload/flash.
  const inConversation = convo.submitted;

  // Submit wrapper: guard duplicates, clear the composer, begin the sequence.
  const submit = () => {
    if (convo.submitted || convo.busy) return;
    setPrompt('');
    convo.submit();
  };
  const onKeyDown = (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    // Shift+Enter: newline (default).
  };
  const canSend = prompt.trim().length > 0 && !convo.busy && !convo.submitted;

  return (
    <div className="claw" data-theme="claude">
      {/* ---- Fixed light Claude sidebar (both states) --------------------- */}
      <aside className="claw-sidebar" aria-label="Claude">
        {/* Wordmark as styled serif text so it blends into #FBFBF9 with no
            white box or halo (the raster asset has an opaque background). */}
        <div className="claw-brand"><span className="claw-brand-text">Claude</span></div>

        <nav className="claw-nav" aria-label="Claude navigation">
          <button className={`claw-nav-item claw-nav-new${inConversation ? '' : ' claw-nav-selected'}`} tabIndex={-1}><PlusIcon size={18} /><span>New</span></button>
          <button className="claw-nav-item" tabIndex={-1}><ClaudeProjectsIcon size={18} /><span>Projects</span></button>
          <button className="claw-nav-item" tabIndex={-1}><ClaudeArtifactsIcon size={18} /><span>Artifacts</span></button>
          <button className="claw-nav-item" tabIndex={-1}><ClaudeCodeIcon size={18} /><span>Code</span></button>
          <button className="claw-nav-item" tabIndex={-1}><ClaudeCustomizeIcon size={18} /><span>Customize</span></button>
        </nav>

        <div className="claw-recents">
          <div className="claw-recents-head">
            <span>Chats and tasks</span>
            <SlidersIcon size={15} className="claw-recents-filter" />
          </div>
          {/* The IP Council brief is always the first chat item; it gains the
              selected treatment only once a conversation is active. */}
          <button
            className={`claw-chat${inConversation ? ' claw-chat-active' : ''}`}
            aria-current={inConversation ? 'true' : undefined}
            tabIndex={-1}
          >
            <span className={`claw-chat-dot${inConversation ? '' : ' claw-chat-dot-idle'}`} aria-hidden="true" />{CONVERSATION_TITLE}
          </button>
          {RECENT_CHATS.map((c) => (
            <button key={c} className="claw-chat" tabIndex={-1}>
              <span className="claw-chat-dot claw-chat-dot-idle" aria-hidden="true" />{c}
            </button>
          ))}
        </div>

        <button className="claw-nav-item claw-design" tabIndex={-1}>
          <ClaudeDesignAsset size={20} className="claw-design-icon" /><span>Design</span>
        </button>

        <div className="claw-account">
          <span className="claw-avatar" aria-hidden="true">BE</span>
          <span className="claw-account-name">Brian Englund</span>
          <ChevronDownIcon size={14} className="claw-account-caret" />
          <span className="claw-account-tools" aria-hidden="true">
            <DownloadIcon size={15} /><SearchIcon size={15} /><SidebarToggleIcon size={15} />
          </span>
        </div>
      </aside>

      {/* ---- Main pane ---------------------------------------------------- */}
      <section className="claw-main" aria-label="Claude">
        {inConversation ? (
          <>
            <header className="claw-convo-header">
              <div className="claw-convo-title">
                <span>{CONVERSATION_TITLE}</span>
                <ChevronDownIcon size={15} className="claw-convo-caret" />
              </div>
              <button className="claw-share" tabIndex={-1}><ShareIcon size={14} /><span>Share</span></button>
            </header>

            <div className="claw-thread" ref={scrollRef}>
              <div className="claw-turn claw-turn-user">
                <div className="claw-user-bubble">{CLAUDE_PROMPT}</div>
              </div>

              <div className="claw-turn claw-turn-assistant">
                {convo.phase === 'thinking' ? (
                  // One active reasoning line only — completed phrases are
                  // REPLACED via the crossfade, never stacked into a checklist.
                  // The animated mark sits immediately to the left and stays
                  // spatially stable (never remounts, never blinks).
                  <div className="cla-reasoning" role="status" aria-live="polite">
                    <div className="cla-reason-step cla-reason-active">
                      <ClaudeThinkingMark size={20} static={reducedMotion} className="cla-thinking-mark" />
                      <span key={convo.currentStage ?? ''} className="cla-reason-text cla-reason-crossfade">
                        {convo.currentStage}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Reveal step 1 — the opening recommendation sentence. */}
                    <p className="claw-lead-in sony-brief-reveal">{CLAUDE_LEAD_IN}</p>
                    {/* Reveal steps 2..9 — the governed brief (revealed - 1),
                        rendered as a native answer (no outer card via CSS). */}
                    <ExecutiveBrief
                      context={context}
                      activationUrl={activationUrl}
                      revealed={convo.phase === 'done' ? undefined : Math.max(0, convo.revealed - 1)}
                    />
                    {/* Writing frontier — beneath the newest content, removed
                        cleanly once the brief has fully rendered. */}
                    {convo.phase === 'revealing' && (
                      <div className="cla-writing" role="status" aria-live="polite">
                        <ClaudeThinkingMark size={16} static={reducedMotion} className="cla-writing-mark" />
                        <span>Writing…</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Compact, pinned conversation composer. */}
            <div className="claw-composer claw-composer-convo">
              <div className="claw-composer-box">
                <button className="claw-composer-plus" tabIndex={-1} aria-hidden="true"><PlusIcon size={18} /></button>
                <textarea
                  className="claw-composer-field"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={convo.busy || convo.phase === 'done'}
                  rows={1}
                  placeholder={CONVO_PLACEHOLDER}
                  aria-label="Write a message to Claude"
                />
                <div className="claw-composer-right">
                  <MicIcon size={17} className="claw-composer-mic" />
                  <span className="claw-status-dot" aria-hidden="true" />
                </div>
              </div>
              <div className="claw-composer-meta" aria-hidden="true">
                <span className="claw-model">Sonnet 5</span><span className="claw-effort">Medium</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="claw-home-top">
              <button className="claw-home-util" tabIndex={-1} aria-label="Claude menu">
                <ClaudeGhostIcon size={18} />
              </button>
            </div>

            <div className="claw-home">
              <h1 className="claw-greeting">
                <ClaudeStar size={30} className="claw-greeting-star" /> {GREETING}
              </h1>

              {/* Large preloaded home composer — one real rounded container
                  (.claw-composer-box) with a dedicated multiline text region on
                  top and the control row below (space-between column). The
                  prompt wraps in the text region and never leaves the box. */}
              <div className="claw-composer claw-composer-home">
                <div className="claw-composer-box">
                  <div className="claw-composer-textrow">
                    <textarea
                      className="claw-composer-field claw-composer-field-home"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={onKeyDown}
                      rows={2}
                      placeholder={HOME_PLACEHOLDER}
                      aria-label="Message Claude"
                    />
                    <span className="claw-status-dot" aria-hidden="true" />
                  </div>
                  <div className="claw-home-tools">
                    <button className="claw-composer-plus" tabIndex={-1} aria-hidden="true"><PlusIcon size={18} /></button>
                    <div className="claw-mode" role="group" aria-label="Mode">
                      <span className="claw-mode-seg claw-mode-seg-active">Chat</span>
                      <span className="claw-mode-seg">Cowork</span>
                    </div>
                    <span className="claw-home-model" aria-hidden="true">
                      <span className="claw-model">Sonnet 5</span><span className="claw-effort">Medium</span>
                      <MicIcon size={17} className="claw-composer-mic" />
                      <ChevronDownIcon size={15} />
                    </span>
                    <button
                      className="claw-send"
                      onClick={submit}
                      disabled={!canSend}
                      aria-label="Send"
                      title="Send"
                    >↑</button>
                  </div>
                </div>
              </div>

              <div className="claw-suggestions">
                {SUGGESTIONS.map(({ label, Icon }) => (
                  <button key={label} className="claw-suggestion" tabIndex={-1} aria-label={label}>
                    <Icon size={16} /><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
