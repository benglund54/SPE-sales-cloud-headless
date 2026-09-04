import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ActivationLink } from './ActivationLink';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
}

const ARTIFACT_LABEL = 'Cross-Sony Collaboration Request';
const ACTIVATION_ACTION_LABEL = 'Review governed activation in Salesforce';

/**
 * Sony IP360 Advisor's Slack app message, formatted Block-Kit style: a headline,
 * a source line, a compact inline metric row, dividers, and two-column field
 * groups — NOT five large dashboard tiles. Renders entirely from the Activation
 * context; every approved value is preserved. No invented people/timestamps/
 * counts/reactions.
 */
export function CollaborationRequest({ context, activationUrl }: Props) {
  const { audience, governance, opCoRoles, modelScores, evidenceSignals, releaseMoments, scenes, provenance } =
    context;
  const lead = opCoRoles.find((r) => r.participationStatus === 'Accountable');
  const participants = opCoRoles.filter((r) => r.participationStatus === 'Pending');

  return (
    <article className="slk-block" aria-label={ARTIFACT_LABEL}>
      <span className="slk-block-tag">{ARTIFACT_LABEL}</span>
      <h1 className="slk-block-title">{scenes.slack.title}</h1>
      <div className="slk-block-source">Source: {provenance.displayLabel}</div>

      {/* Compact inline metric row (Block-Kit fields, not dashboard tiles) */}
      <div className="slk-block-metrics">
        <span className="slk-metric"><b>{audience.size}</b> Qualified {context.region} audience</span>
        <span className="slk-metric"><b>{audience.opportunityScore}</b> Opportunity / Priority · #{audience.qualifiedOpportunityRank}</span>
        {modelScores.map((m) => (
          <span key={m.label} className="slk-metric"><b>{m.value}</b> {m.label}</span>
        ))}
      </div>
      <div className="slk-block-audience">{audience.name}</div>

      <hr className="slk-block-divider" />

      <div className="slk-block-cols">
        <div className="slk-block-col">
          <div className="slk-block-field">
            <span className="slk-block-h">Why now</span>
            <p>{scenes.slack.whyNow}</p>
            <div className="slk-block-releases">
              {releaseMoments.map((m) => (
                <span key={m.title} className="slk-block-release">
                  {m.title}
                  <span className={`slk-chip ${m.status === 'Active release moment' ? 'slk-chip-active' : 'slk-chip-dev'}`}>{m.status}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="slk-block-field">
            <span className="slk-block-h">Proposed connected fan experience</span>
            <p>{context.proposedFanExperience}</p>
          </div>

          <div className="slk-block-field">
            <span className="slk-block-h">Contributing signals</span>
            <ul className="slk-block-signals">
              {evidenceSignals.map((sig) => (
                <li key={sig.label}><b>{sig.label}</b> — {sig.detail}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="slk-block-col">
          <div className="slk-block-field">
            <span className="slk-block-h">Operating companies</span>
            <ul className="slk-block-opcos">
              {lead && (
                <li><span className="slk-opco-name">{lead.name}</span><span className="slk-opco-tag slk-opco-lead">{lead.role}</span></li>
              )}
              {participants.map((p) => (
                <li key={p.name}><span className="slk-opco-name">{p.name}</span><span className="slk-opco-tag slk-opco-pending">{p.role} · {p.participationStatus}</span></li>
              ))}
            </ul>
          </div>

          <div className="slk-block-field slk-block-lifecycle">
            <span className="slk-block-h">Lifecycle</span>
            <div className="slk-lc">
              <span><em>Current</em> {governance.currentLifecycleStage}</span>
              <span aria-hidden="true">→</span>
              <span><em>Next</em> {governance.nextLifecycleStage}</span>
            </div>
            <div className="slk-lc-rights">Rights review: {governance.rightsReview}</div>
          </div>

          <div className="slk-block-field">
            <span className="slk-block-h">Decisions requested</span>
            <ol className="slk-block-decisions">
              {context.decisions.shared.map((d) => <li key={d}>{d}</li>)}
            </ol>
          </div>
        </div>
      </div>

      <div className="slk-block-banner" role="status">{governance.statusBanner}</div>

      <div className="slk-block-actions">
        <ActivationLink url={activationUrl} label={ACTIVATION_ACTION_LABEL} />
      </div>
    </article>
  );
}
