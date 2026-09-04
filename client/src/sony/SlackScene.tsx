import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { CollaborationRequest } from './CollaborationRequest';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const WORKSPACE = 'Sony IP360';
const CHANNEL = 'sony-ip360-fy27';

/**
 * Slack-styled surface for the Sony Day opening scene. The chrome is cosmetic
 * (workspace rail, channel header, and a visually inert composer for realism).
 * It deliberately contains NO fake human messages, names, timestamps, unread
 * counts, reactions, or executed approvals, and does not imply this app posted
 * a native Slack message.
 */
export function SlackScene({ context, activationUrl }: Props) {
  return (
    <div className="sony-slack" data-theme="slack">
      {/* Workspace rail */}
      <aside className="sony-slack-rail" aria-hidden="true">
        <div className="sony-slack-rail-wordmark">SONY IP360</div>
        <div className="sony-slack-rail-icon sony-slack-rail-active">#</div>
      </aside>

      {/* Channel column */}
      <div className="sony-slack-main">
        <header className="sony-slack-header">
          <div className="sony-slack-header-left">
            <span className="sony-slack-workspace">{WORKSPACE}</span>
            <span className="sony-slack-channel">#{CHANNEL}</span>
          </div>
          <span className="sony-slack-wordmark">SONY IP360</span>
        </header>

        <main className="sony-slack-messages">
          <CollaborationRequest context={context} activationUrl={activationUrl} />
        </main>

        {/* Inert composer — realism only, not interactive */}
        <div className="sony-slack-composer" aria-hidden="true">
          <div className="sony-slack-composer-box">
            <span className="sony-slack-composer-placeholder">
              Message #{CHANNEL}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
