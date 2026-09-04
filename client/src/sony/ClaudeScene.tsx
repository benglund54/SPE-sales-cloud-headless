import { useState } from 'react';
import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ExecutiveBrief } from './ExecutiveBrief';
import { useConversation } from './useConversation';
import { useFollowScroll } from './useFollowScroll';
import { CLAUDE_PROMPT, CLAUDE_STAGES, CLAUDE_SECTION_COUNT } from './interactiveFixtures';
import {
  ClaudeLogo, CoworkIcon, CodeIcon, PlusIcon, FolderIcon, ArtifactIcon, ClockIcon, GearIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  reducedMotion?: boolean;
}

const CLAUDE_LEAD_IN =
  'Here’s the decision brief. The opportunity is strong enough to advance to cross-OpCo review, but not to activation.';
const TASK_TITLE = 'Sony IP360 IP Council brief';

/**
 * Reference-exact Claude Cowork shell with an INTERACTIVE, deterministic
 * generation (HX-6V-D). Opens clean with the prompt preloaded; on submit it
 * shows Working…/Thinking… + progress summaries, then a "Writing…" state while
 * the executive brief reveals section-by-section. No live Claude call, no token
 * streaming, no web research — all content is the governed fixture.
 */
export function ClaudeScene({ context, activationUrl, reducedMotion = false }: Props) {
  const [prompt, setPrompt] = useState(CLAUDE_PROMPT);
  const convo = useConversation({
    progressStages: CLAUDE_STAGES,
    sectionCount: CLAUDE_SECTION_COUNT,
    reducedMotion,
  });
  const scrollRef = useFollowScroll<HTMLDivElement>(
    `${convo.phase}:${convo.currentStage ?? ''}:${convo.revealed}`
  );

  return (
    <div className="cla" data-theme="claude">
      {/* Left sidebar */}
      <aside className="cla-sidebar" aria-label="Claude">
        <div className="cla-mode" role="group" aria-label="Mode">
          <span className="cla-mode-seg cla-mode-seg-active"><CoworkIcon size={15} /> Cowork</span>
          <span className="cla-mode-seg"><CodeIcon size={15} /> Code</span>
        </div>
        <nav className="cla-nav">
          <div className="cla-nav-item"><PlusIcon size={16} /> New</div>
          <div className="cla-nav-item"><FolderIcon size={16} /> Projects</div>
          <div className="cla-nav-item"><ArtifactIcon size={16} /> Artifacts</div>
          <div className="cla-nav-item"><ClockIcon size={16} /> Scheduled</div>
          <div className="cla-nav-item"><GearIcon size={16} /> Customize</div>
        </nav>
        <div className="cla-tasks">
          <span className="cla-tasks-label">Tasks</span>
          <div className="cla-task cla-task-active" aria-current="true">
            <span className="cla-task-dot" aria-hidden="true" />{TASK_TITLE}
          </div>
          <div className="cla-task">
            <span className="cla-task-dot cla-task-dot-idle" aria-hidden="true" />EMEA audience notes
          </div>
        </div>
        <div className="cla-account" aria-hidden="true">
          <ClaudeLogo size={16} /><span>Sony IP360 · Gateway</span>
        </div>
      </aside>

      {/* Conversation */}
      <section className="cla-main" aria-label="Conversation">
        <header className="cla-header" aria-hidden="true">
          <span className="cla-header-title">{TASK_TITLE}</span>
          <span className="cla-header-caret">▾</span>
        </header>

        <div className="cla-thread" ref={scrollRef}>
          {convo.submitted && (
            <div className="cla-turn cla-turn-user">
              <div className="cla-user-bubble">{CLAUDE_PROMPT}</div>
            </div>
          )}

          {convo.submitted && (
            <div className="cla-turn cla-turn-assistant">
              {convo.phase === 'thinking' ? (
                <div className="cla-preparing" role="status">
                  <ClaudeLogo size={24} className="cla-preparing-mark" />
                  <span className="cla-preparing-text">{convo.currentStage}</span>
                </div>
              ) : (
                <>
                  <div className="cla-assistant-row">
                    <ClaudeLogo size={22} />
                    <p className="cla-lead-in">{CLAUDE_LEAD_IN}</p>
                  </div>
                  <ExecutiveBrief
                    context={context}
                    activationUrl={activationUrl}
                    revealed={convo.phase === 'done' ? CLAUDE_SECTION_COUNT : convo.revealed}
                  />
                  {convo.phase === 'revealing' && (
                    <div className="cla-writing" role="status" aria-live="polite">
                      <span className="cla-writing-dot" aria-hidden="true" />Writing…
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Interactive composer with model/status treatment */}
        <div className="cla-composer">
          <div className="cla-composer-box">
            <textarea
              className="cla-composer-field"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={convo.handleComposerKeyDown}
              disabled={convo.busy || convo.phase === 'done'}
              rows={2}
              aria-label="Write a message to Claude"
            />
            <div className="cla-composer-footer">
              <PlusIcon size={16} />
              <span className="cla-composer-model">Claude Sonnet 4.6 · Low</span>
              <button
                className="cla-composer-send"
                onClick={convo.submit}
                disabled={convo.busy || convo.phase === 'done' || convo.submitted}
                aria-label="Send"
              >↑</button>
            </div>
          </div>
          <p className="cla-disclaimer">Claude is AI and can make mistakes. Please double-check responses.</p>
        </div>
      </section>
    </div>
  );
}
