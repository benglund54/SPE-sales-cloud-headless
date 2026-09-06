import { useState } from 'react';
import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ExecutiveBrief } from './ExecutiveBrief';
import { useConversation } from './useConversation';
import { useFollowScroll } from './useFollowScroll';
import { CLAUDE_PROMPT, CLAUDE_STAGES, CLAUDE_SECTION_COUNT } from './interactiveFixtures';
import {
  ClaudeWordmark, ClaudeStar, ClaudeThinkingMark,
  PlusIcon, FolderIcon, ArtifactIcon, CodeIcon, GearIcon, SearchIcon,
  MicIcon, ChevronDownIcon, DownloadIcon, SidebarToggleIcon, SlidersIcon, PaletteIcon,
  CloseIcon, ShareIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  reducedMotion?: boolean;
}

const CLAUDE_LEAD_IN =
  'Here’s the decision brief. The opportunity is strong enough to advance to cross-OpCo review, but not to activation.';
const GREETING = 'Good morning, Brian Englund';
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
const SUGGESTIONS = ['Code', 'Write', 'Strategize', 'Learn', 'Life stuff'];

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
    // Reasoning ≈ 4.1s (5 stages × 820ms), response build ≈ 6.5s (9 increments
    // × 720ms), ≈ 10–12s total Send→done.
    stageMs: 820,
    revealMs: 720,
    reducedMotion,
  });
  const scrollRef = useFollowScroll<HTMLDivElement>(
    `${convo.phase}:${convo.stageIndex}:${convo.revealed}`,
    { smooth: true, reducedMotion }
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
        <div className="claw-brand"><ClaudeWordmark size={22} /></div>

        <nav className="claw-nav" aria-label="Claude navigation">
          <button className="claw-nav-item claw-nav-new" tabIndex={-1}><PlusIcon size={16} /><span>New</span></button>
          <button className="claw-nav-item" tabIndex={-1}><FolderIcon size={16} /><span>Projects</span></button>
          <button className="claw-nav-item" tabIndex={-1}><ArtifactIcon size={16} /><span>Artifacts</span></button>
          <button className="claw-nav-item" tabIndex={-1}>
            <CodeIcon size={16} /><span>Code</span><span className="claw-upgrade-pill">Upgrade</span>
          </button>
          <button className="claw-nav-item" tabIndex={-1}><GearIcon size={16} /><span>Customize</span></button>
        </nav>

        <div className="claw-recents">
          <div className="claw-recents-head">
            <span>Chats and tasks</span>
            <SlidersIcon size={15} className="claw-recents-filter" />
          </div>
          {inConversation && (
            <button className="claw-chat claw-chat-active" aria-current="true" tabIndex={-1}>
              <span className="claw-chat-dot" aria-hidden="true" />{CONVERSATION_TITLE}
            </button>
          )}
          {RECENT_CHATS.map((c) => (
            <button key={c} className="claw-chat" tabIndex={-1}>
              <span className="claw-chat-dot claw-chat-dot-idle" aria-hidden="true" />{c}
            </button>
          ))}
        </div>

        <button className="claw-nav-item claw-design" tabIndex={-1}><PaletteIcon size={18} /><span>Design</span></button>

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
              <div className="claw-plan" aria-hidden="true">
                <span>Free plan · <a className="claw-upgrade-link">Upgrade</a></span>
                <CloseIcon size={13} className="claw-plan-close" />
              </div>
              <button className="claw-share" tabIndex={-1}><ShareIcon size={14} /><span>Share</span></button>
            </header>

            <div className="claw-thread" ref={scrollRef}>
              <div className="claw-turn claw-turn-user">
                <div className="claw-user-bubble">{CLAUDE_PROMPT}</div>
              </div>

              <div className="claw-turn claw-turn-assistant">
                {convo.phase === 'thinking' ? (
                  <div className="cla-reasoning" role="status" aria-live="polite">
                    {/* Completed states settle above, muted and stable. */}
                    {CLAUDE_STAGES.slice(0, convo.stageIndex).map((s) => (
                      <div key={s} className="cla-reason-step cla-reason-done">
                        <span className="cla-reason-check" aria-hidden="true">✓</span>
                        <span className="cla-reason-text">{s}</span>
                      </div>
                    ))}
                    {/* One active state — the animated mark sits immediately to
                        its left and never remounts (no blink); only the text
                        crossfades as the stage changes. */}
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
              <span className="claw-plan" aria-hidden="true">Free plan · <a className="claw-upgrade-link">Upgrade</a></span>
              <span className="claw-home-util" aria-hidden="true"><ChevronDownIcon size={16} /></span>
            </div>

            <div className="claw-home">
              <h1 className="claw-greeting">
                <ClaudeStar size={30} className="claw-greeting-star" /> {GREETING}
              </h1>

              {/* Large preloaded home composer. */}
              <div className="claw-composer claw-composer-home">
                <textarea
                  className="claw-composer-field claw-composer-field-home"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={HOME_PLACEHOLDER}
                  aria-label="Message Claude"
                />
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

              <div className="claw-suggestions" aria-hidden="true">
                {SUGGESTIONS.map((s) => (
                  <span key={s} className="claw-suggestion">{s}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
