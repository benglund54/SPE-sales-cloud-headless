import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ExecutiveBrief } from './ExecutiveBrief';
import { useBriefReveal } from './useBriefReveal';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const WORKSPACE = 'Sony IP360';
const USER_PROMPT =
  'Prepare a one-minute executive brief for the Sony IP Council. Separate grounded facts, your recommendation, and the decisions still pending.';
const CLAUDE_LEAD_IN =
  'Here’s the decision brief. The opportunity is strong enough to advance to cross-OpCo review, but not to activation.';
const PREPARING_TEXT = 'Preparing executive brief from governed context…';

/**
 * Claude-styled surface for the executive decision brief. Deterministic — no
 * live Claude API call, no token streaming. On entry it shows a brief
 * "preparing" state, then reveals the complete brief at once (see
 * useBriefReveal; respects prefers-reduced-motion). Not labeled "Executive
 * Coworker" to avoid confusion with the Agentforce Coworker product.
 */
export function ClaudeScene({ context, activationUrl }: Props) {
  const phase = useBriefReveal();

  return (
    <div className="sony-claude" data-theme="claude">
      <aside className="sony-claude-rail" aria-hidden="true">
        <div className="sony-claude-rail-wordmark">SONY IP360</div>
      </aside>

      <div className="sony-claude-main">
        <header className="sony-claude-header">
          <span className="sony-claude-workspace">{WORKSPACE}</span>
          <span className="sony-claude-wordmark">Claude</span>
        </header>

        <main className="sony-claude-messages">
          <div className="sony-claude-turn sony-claude-turn-user">
            <span className="sony-claude-turn-role">You</span>
            <p className="sony-claude-turn-text">{USER_PROMPT}</p>
          </div>

          <div className="sony-claude-turn sony-claude-turn-assistant">
            <span className="sony-claude-turn-role">Claude</span>
            {phase === 'preparing' ? (
              <p className="sony-claude-preparing" role="status">
                <span className="sony-claude-preparing-dot" aria-hidden="true" />
                {PREPARING_TEXT}
              </p>
            ) : (
              <>
                <p className="sony-claude-turn-text">{CLAUDE_LEAD_IN}</p>
                <ExecutiveBrief context={context} activationUrl={activationUrl} />
              </>
            )}
          </div>
        </main>

        {/* Inert composer — realism only, not interactive */}
        <div className="sony-claude-composer" aria-hidden="true">
          <div className="sony-claude-composer-box">
            <span className="sony-claude-composer-placeholder">Reply to Claude…</span>
          </div>
        </div>
      </div>
    </div>
  );
}
