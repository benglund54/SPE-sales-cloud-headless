import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ActivationLink } from './ActivationLink';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const ARTIFACT_LABEL = 'PlayStation Participation Decision';
const CARD_TITLE = 'Action required: Review PlayStation participation';
const ACTIVATION_ACTION_LABEL = 'Review governed activation in Salesforce';

// Role-specific "Why PlayStation" points (this phase's approved copy).
const WHY_PLAYSTATION = [
  'Marvel’s Spider-Man titles provide the relevant catalog anchor.',
  'The qualified EMEA cohort shows sustained Spider-Man game engagement.',
  'The same cohort also shows Spider-Verse film/streaming and soundtrack-listening affinity.',
];

// Governance statements supported by the shared contract's permitted/restricted
// framing — no invented technical controls, no claim of completed approvals.
const PERMITTED = [
  'Qualified aggregate audience insights',
  'Approved cross-affinity and engagement signals',
  'Planning within PlayStation’s own operating controls',
];
const NOT_SHARED = [
  'No individual-level identifiers',
  'No unrestricted cross-OpCo data access',
  'No audience activation or customer communication',
  'Rights-controlled execution remains pending review and approval',
];

/**
 * Role-specific decision brief for a PlayStation leader. Renders ONLY what
 * PlayStation needs from the shared Activation context — it does not replay the
 * Slack cross-Sony collaboration artifact. Human decision support only: no
 * working Approve/Reject/Participate/Send controls.
 */
export function PlayStationDecisionCard({ context, activationUrl }: Props) {
  const { audience, governance, modelScores } = context;
  const engagement = modelScores.find((m) => m.label === 'Engagement Score');
  const lead = context.opCoRoles.find((r) => r.participationStatus === 'Accountable');

  return (
    <article className="sony-ps" aria-label={ARTIFACT_LABEL}>
      <header className="sony-ps-head">
        <span className="sony-ps-artifact-tag">{ARTIFACT_LABEL}</span>
        <span className="sony-ps-required">Action required</span>
      </header>

      <h1 className="sony-ps-title">{CARD_TITLE}</h1>

      <div className="sony-ps-grid">
        {/* LEFT: why + metrics */}
        <div className="sony-ps-col">
          <section className="sony-ps-section">
            <h2 className="sony-ps-h2">Why PlayStation</h2>
            <ul className="sony-ps-why">
              {WHY_PLAYSTATION.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </section>

          <section className="sony-ps-metrics" aria-label="Opportunity metrics">
            <div className="sony-ps-metric">
              <span className="sony-ps-metric-value">{audience.size}</span>
              <span className="sony-ps-metric-label">Qualified audience</span>
            </div>
            <div className="sony-ps-metric">
              <span className="sony-ps-metric-value">{engagement?.value}</span>
              <span className="sony-ps-metric-label">Engagement Score</span>
            </div>
            <div className="sony-ps-metric">
              <span className="sony-ps-metric-value">{audience.opportunityScore}</span>
              <span className="sony-ps-metric-label">Opportunity / Priority Score</span>
            </div>
          </section>

          <section className="sony-ps-section sony-ps-status">
            <div className="sony-ps-status-row">
              <span className="sony-ps-status-key">Activation lead</span>
              <span className="sony-ps-status-val">{lead?.name}</span>
            </div>
            <div className="sony-ps-status-row">
              <span className="sony-ps-status-key">PlayStation participation</span>
              <span className="sony-ps-status-val sony-ps-pending">
                {governance.approvals.playStation}
              </span>
            </div>
            <div className="sony-ps-status-row">
              <span className="sony-ps-status-key">Current stage</span>
              <span className="sony-ps-status-val">{governance.currentLifecycleStage}</span>
            </div>
            <div className="sony-ps-status-row">
              <span className="sony-ps-status-key">Next stage</span>
              <span className="sony-ps-status-val">{governance.nextLifecycleStage}</span>
            </div>
          </section>
        </div>

        {/* RIGHT: decisions + governance */}
        <div className="sony-ps-col">
          <section className="sony-ps-section">
            <h2 className="sony-ps-h2">PlayStation decisions</h2>
            <ol className="sony-ps-decisions">
              {context.decisions.playstation.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
          </section>

          <section className="sony-ps-governance">
            <div className="sony-ps-gov-block sony-ps-gov-permitted">
              <h3 className="sony-ps-gov-title">Permitted for this decision</h3>
              <ul>
                {PERMITTED.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="sony-ps-gov-block sony-ps-gov-restricted">
              <h3 className="sony-ps-gov-title">Not shared or activated</h3>
              <ul>
                {NOT_SHARED.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <div className="sony-ps-banner" role="status">
        {governance.statusBanner}
      </div>

      <div className="sony-ps-actions">
        <ActivationLink url={activationUrl} label={ACTIVATION_ACTION_LABEL} />
      </div>
    </article>
  );
}
