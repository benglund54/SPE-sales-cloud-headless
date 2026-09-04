import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ExecutiveBrief } from './ExecutiveBrief';
import { useBriefReveal } from './useBriefReveal';
import {
  ClaudeLogo, CoworkIcon, CodeIcon, PlusIcon, FolderIcon, ArtifactIcon, ClockIcon, GearIcon,
} from './icons';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const USER_PROMPT =
  'Prepare a one-minute executive brief for the Sony IP Council. Separate grounded facts, your recommendation, and the decisions still pending.';
const CLAUDE_LEAD_IN =
  'Here’s the decision brief. The opportunity is strong enough to advance to cross-OpCo review, but not to activation.';
const PREPARING_TEXT = 'Preparing executive brief from governed context…';
const TASK_TITLE = 'Sony IP360 IP Council brief';

/**
 * Reference-exact Claude Cowork desktop shell (semantic React + CSS). Warm
 * white app shell, narrow left sidebar with a Cowork/Code toggle and a
 * Projects/Tasks structure, spacious conversation, right-aligned user request,
 * orange "preparing" treatment, and a bottom composer with a model/status line.
 *
 * Deterministic — no live Claude call, no token streaming. "Preparing…" →
 * full brief reveal in under 2s (useBriefReveal; respects reduced motion). Not
 * labeled "Executive Coworker". No Live/Mock or implementation control.
 */
export function ClaudeScene({ context, activationUrl }: Props) {
  const phase = useBriefReveal();

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

        <div className="cla-thread">
          <div className="cla-turn cla-turn-user">
            <div className="cla-user-bubble">{USER_PROMPT}</div>
          </div>

          <div className="cla-turn cla-turn-assistant">
            {phase === 'preparing' ? (
              <div className="cla-preparing" role="status">
                <ClaudeLogo size={24} className="cla-preparing-mark" />
                <span className="cla-preparing-text">{PREPARING_TEXT}</span>
              </div>
            ) : (
              <>
                <div className="cla-assistant-row">
                  <ClaudeLogo size={22} />
                  <p className="cla-lead-in">{CLAUDE_LEAD_IN}</p>
                </div>
                <ExecutiveBrief context={context} activationUrl={activationUrl} />
              </>
            )}
          </div>
        </div>

        {/* Composer with model/status treatment */}
        <div className="cla-composer" aria-hidden="true">
          <div className="cla-composer-box">
            <span className="cla-composer-input">Write a message…</span>
            <div className="cla-composer-footer">
              <PlusIcon size={16} />
              <span className="cla-composer-model">Claude Sonnet 4.6 · Low</span>
            </div>
          </div>
          <p className="cla-disclaimer">Claude is AI and can make mistakes. Please double-check responses.</p>
        </div>
      </section>
    </div>
  );
}
