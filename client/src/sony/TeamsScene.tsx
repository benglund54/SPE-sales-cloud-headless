import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { PlayStationDecisionCard } from './PlayStationDecisionCard';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const TEAM = 'Sony IP360';
const CONVERSATION = 'PlayStation Participation';
const ASSISTANT = 'Copilot';
const CONTEXT_LABEL = 'Grounded in Sony IP360';

const USER_PROMPT = 'What does PlayStation need to decide?';
const COPILOT_LEAD_IN =
  'Sony Pictures is requesting PlayStation participation in the Spider-Man EMEA connected fan opportunity. Here’s the decision brief for PlayStation.';

/**
 * Teams-styled surface. Deterministic — no Microsoft/Copilot/Salesforce call.
 * The chrome is cosmetic; it contains NO fake participants, names, timestamps,
 * notifications, or unread counts, and does not claim to be a native
 * production Microsoft integration. Advances the story with a role-specific
 * PlayStation decision brief rather than replaying the Slack artifact.
 */
export function TeamsScene({ context, activationUrl }: Props) {
  return (
    <div className="sony-teams" data-theme="teams">
      <aside className="sony-teams-rail" aria-hidden="true">
        <div className="sony-teams-rail-wordmark">SONY IP360</div>
        <div className="sony-teams-rail-icon sony-teams-rail-active">PS</div>
      </aside>

      <div className="sony-teams-main">
        <header className="sony-teams-header">
          <div className="sony-teams-header-left">
            <span className="sony-teams-team">{TEAM}</span>
            <span className="sony-teams-conversation">{CONVERSATION}</span>
          </div>
          <span className="sony-teams-wordmark">SONY IP360</span>
        </header>

        <main className="sony-teams-messages">
          {/* Concise deterministic exchange */}
          <div className="sony-teams-turn sony-teams-turn-user">
            <span className="sony-teams-turn-role">You</span>
            <p className="sony-teams-turn-text">{USER_PROMPT}</p>
          </div>

          <div className="sony-teams-turn sony-teams-turn-assistant">
            <div className="sony-teams-assistant-meta">
              <span className="sony-teams-turn-role">{ASSISTANT}</span>
              <span className="sony-teams-context-label">{CONTEXT_LABEL}</span>
            </div>
            <p className="sony-teams-turn-text">{COPILOT_LEAD_IN}</p>
            <PlayStationDecisionCard context={context} activationUrl={activationUrl} />
          </div>
        </main>

        {/* Inert composer — realism only, not interactive */}
        <div className="sony-teams-composer" aria-hidden="true">
          <div className="sony-teams-composer-box">
            <span className="sony-teams-composer-placeholder">Message {ASSISTANT}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
