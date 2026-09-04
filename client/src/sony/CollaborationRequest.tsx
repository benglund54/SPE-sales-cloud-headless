import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ActivationLink } from './ActivationLink';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const AGENT_NAME = 'Sony IP360 Advisor';
const ARTIFACT_LABEL = 'Cross-Sony Collaboration Request';
const ACTIVATION_ACTION_LABEL = 'Review governed activation in Salesforce';

/**
 * The one structured collaboration artifact that arrives in the Slack channel.
 * Renders ENTIRELY from the HX-1 Activation context — no invented business
 * data, names, timestamps, counts, reactions, or executed approvals.
 */
export function CollaborationRequest({ context, activationUrl }: Props) {
  const { audience, governance, opCoRoles, evidenceSignals, releaseMoments, scenes, provenance } =
    context;
  const lead = opCoRoles.find((r) => r.participationStatus === 'Accountable');
  const participants = opCoRoles.filter((r) => r.participationStatus === 'Pending');

  return (
    <article className="sony-collab" aria-label={ARTIFACT_LABEL}>
      {/* Agent header — an app posting a structured artifact, not a person */}
      <header className="sony-collab-head">
        <div className="sony-collab-agent">
          <span className="sony-collab-agent-badge" aria-hidden="true">IP360</span>
          <div className="sony-collab-agent-meta">
            <span className="sony-collab-agent-name">{AGENT_NAME}</span>
            <span className="sony-collab-agent-app">APP</span>
          </div>
        </div>
        <span className="sony-collab-artifact-tag">{ARTIFACT_LABEL}</span>
      </header>

      <h1 className="sony-collab-title">{scenes.slack.title}</h1>

      {/* Provenance — polished, audience-safe label only */}
      <div className="sony-collab-source">Source: {provenance.displayLabel}</div>

      {/* Why now */}
      <section className="sony-collab-section">
        <h2 className="sony-collab-h2">Why now</h2>
        <p>{scenes.slack.whyNow}</p>
        <ul className="sony-collab-release-list">
          {releaseMoments.map((m) => (
            <li key={m.title} className="sony-collab-release">
              <span className="sony-collab-release-title">{m.title}</span>
              <span
                className={`sony-collab-chip ${
                  m.status === 'Active release moment'
                    ? 'sony-chip-active'
                    : 'sony-chip-dev'
                }`}
              >
                {m.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Proposed connected fan experience */}
      <section className="sony-collab-section">
        <h2 className="sony-collab-h2">Proposed connected fan experience</h2>
        <p className="sony-collab-summary">{scenes.slack.experienceSummary}</p>
        <p>{context.proposedFanExperience}</p>
      </section>

      {/* Qualified audience + priority score */}
      <section className="sony-collab-section sony-collab-metrics">
        <div className="sony-metric">
          <span className="sony-metric-value">{audience.size}</span>
          <span className="sony-metric-label">Qualified {context.region} audience</span>
          <span className="sony-metric-sub">{audience.name}</span>
        </div>
        <div className="sony-metric">
          <span className="sony-metric-value">{audience.opportunityScore}</span>
          <span className="sony-metric-label">Priority score</span>
          <span className="sony-metric-sub">
            #{audience.qualifiedOpportunityRank} qualified opportunity
          </span>
        </div>
      </section>

      {/* Evidence */}
      <section className="sony-collab-section">
        <h2 className="sony-collab-h2">Relevant evidence</h2>
        <ul className="sony-collab-evidence">
          {evidenceSignals.map((sig) => (
            <li key={sig.label} className="sony-evidence-row">
              <div className="sony-evidence-head">
                <span className="sony-evidence-label">{sig.label}</span>
                <span className="sony-evidence-score">{sig.score}</span>
              </div>
              <div className="sony-evidence-bar" aria-hidden="true">
                <span
                  className="sony-evidence-bar-fill"
                  style={{ width: `${Math.max(0, Math.min(100, sig.score))}%` }}
                />
              </div>
              <p className="sony-evidence-detail">{sig.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Operating-company roles */}
      <section className="sony-collab-section">
        <h2 className="sony-collab-h2">Operating companies</h2>
        <ul className="sony-collab-opcos">
          {lead && (
            <li className="sony-opco">
              <span className="sony-opco-name">{lead.name}</span>
              <span className="sony-opco-role sony-opco-lead">{lead.role}</span>
            </li>
          )}
          {participants.map((p) => (
            <li key={p.name} className="sony-opco">
              <span className="sony-opco-name">{p.name}</span>
              <span className="sony-opco-role sony-opco-pending">
                {p.role} · {p.participationStatus}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lifecycle + rights review */}
      <section className="sony-collab-section sony-collab-lifecycle">
        <div className="sony-lifecycle-row">
          <span className="sony-lifecycle-key">Current lifecycle</span>
          <span className="sony-lifecycle-val">{governance.currentLifecycleStage}</span>
        </div>
        <div className="sony-lifecycle-arrow" aria-hidden="true">→</div>
        <div className="sony-lifecycle-row">
          <span className="sony-lifecycle-key">Next state</span>
          <span className="sony-lifecycle-val">{governance.nextLifecycleStage}</span>
        </div>
        <div className="sony-lifecycle-row">
          <span className="sony-lifecycle-key">Rights review</span>
          <span className="sony-lifecycle-val sony-lifecycle-warn">{governance.rightsReview}</span>
        </div>
      </section>

      {/* Three shared decisions */}
      <section className="sony-collab-section">
        <h2 className="sony-collab-h2">Decisions requested</h2>
        <ol className="sony-collab-decisions">
          {context.decisions.shared.map((decision) => (
            <li key={decision}>{decision}</li>
          ))}
        </ol>
      </section>

      {/* Exact status banner */}
      <div className="sony-collab-banner" role="status">
        {governance.statusBanner}
      </div>

      {/* Single functional action */}
      <div className="sony-collab-actions">
        <ActivationLink url={activationUrl} label={ACTIVATION_ACTION_LABEL} />
      </div>
    </article>
  );
}
