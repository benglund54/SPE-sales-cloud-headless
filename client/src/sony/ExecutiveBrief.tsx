import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ActivationLink } from './ActivationLink';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  /**
   * Progressive reveal count (1..5). When omitted, all sections render (static
   * default — preserves existing render tests). 1 reco · 2 facts · 3 value ·
   * 4 decisions · 5 guardrails (+ banner/action).
   */
  revealed?: number;
}

const ARTIFACT_LABEL = 'Executive Decision Brief';
const BRIEF_TITLE = 'Spider-Man EMEA Connected Fan Moment';
const SUPPORTING_LABEL = 'Prepared from governed Sony IP360 context';
const ACTIVATION_ACTION_LABEL = 'Review governed activation in Salesforce';

/**
 * Deterministic executive decision brief. Synthesizes the contract's full
 * section content into FIVE compact, color-coded sections that fit one 16:9
 * viewport — grounded facts (blue), recommendation (purple), pending human
 * decisions (amber), guardrails (green). No live Claude call; renders entirely
 * from the shared Activation context.
 */
export function ExecutiveBrief({ context, activationUrl, revealed }: Props) {
  const { audience, governance, modelScores, releaseMoments, opCoRoles } = context;
  const engagement = modelScores.find((m) => m.label === 'Engagement Score');
  const crossAffinity = modelScores.find((m) => m.label === 'Cross-Affinity Score');
  const bnd = releaseMoments.find((r) => r.title === 'Spider-Man: Brand New Day');
  const bsv = releaseMoments.find((r) => r.title === 'Beyond the Spider-Verse');
  const lead = opCoRoles.find((r) => r.participationStatus === 'Accountable');
  const participants = opCoRoles.filter((r) => r.participationStatus === 'Pending');
  // Undefined → show all (static default). Otherwise gate sections 1..5.
  const show = (n: number) => revealed === undefined || revealed >= n;

  return (
    <article className="sony-brief" aria-label={ARTIFACT_LABEL}>
      <header className="sony-brief-head">
        <div className="sony-brief-titles">
          <span className="sony-brief-artifact-tag">{ARTIFACT_LABEL}</span>
          <h1 className="sony-brief-title">{BRIEF_TITLE}</h1>
          <span className="sony-brief-supporting">{SUPPORTING_LABEL}</span>
        </div>
      </header>

      {/* 1 — Executive recommendation (PURPLE = Claude recommendation) */}
      {show(1) && (
      <section className="sony-brief-section sony-brief-reco" aria-label="Executive recommendation">
        <h2 className="sony-brief-h2">Executive recommendation</h2>
        <p className="sony-brief-reco-text">{context.executiveRecommendation}</p>
        <p className="sony-brief-reco-conclusion">
          Advance to governed cross-OpCo review — not audience activation or customer communication.
        </p>
      </section>
      )}

      <div className="sony-brief-grid">
        {/* 2 — Grounded facts (BLUE = authoritative data) */}
        {show(2) && (
        <section className="sony-brief-section sony-brief-facts" aria-label="Grounded facts">
          <h2 className="sony-brief-h2">Grounded facts</h2>
          <ul className="sony-brief-facts-list">
            <li><b>Spider-Man: Brand New Day</b> — {bnd?.status.toLowerCase()}, Sony Pictures</li>
            <li><b>Beyond the Spider-Verse</b> — {bsv?.status}</li>
            <li>Marvel’s Spider-Man portfolio — PlayStation catalog anchor</li>
            <li><b>{audience.size}</b> qualified aggregate {context.region} audience</li>
            <li>Opportunity / Priority Score <b>{audience.opportunityScore}</b> · Ranked #{audience.qualifiedOpportunityRank} qualified</li>
            <li>{context.region} ranked #{audience.modeledRevenueRegionRank} by modeled revenue</li>
            <li>{engagement?.label} <b>{engagement?.value}</b> · {crossAffinity?.label} <b>{crossAffinity?.value}</b></li>
          </ul>
          <div className="sony-brief-source">Source: {context.provenance.displayLabel}</div>
        </section>
        )}

        {/* 3 — Connected Sony value (NEUTRAL) */}
        {show(3) && (
        <section className="sony-brief-section sony-brief-value" aria-label="Connected Sony value">
          <h2 className="sony-brief-h2">Connected Sony value</h2>
          <p className="sony-brief-chain">{context.scenes.slack.experienceSummary}</p>
          <ul className="sony-brief-roles">
            {lead && (
              <li>
                <span className="sony-role-name">{lead.name}</span>
                <span className="sony-role-tag sony-role-lead">Accountable lead</span>
              </li>
            )}
            {participants.map((p) => (
              <li key={p.name}>
                <span className="sony-role-name">{p.name}</span>
                <span className="sony-role-tag sony-role-pending">Participation pending</span>
              </li>
            ))}
          </ul>
          <p className="sony-brief-value-note">{context.fanValue}</p>
        </section>
        )}

        {/* 4 — Decisions still pending (AMBER = human decisions) */}
        {show(4) && (
        <section className="sony-brief-section sony-brief-decisions" aria-label="Decisions still pending">
          <h2 className="sony-brief-h2">Decisions still pending</h2>
          <p className="sony-brief-decisions-note">Awaiting the Sony IP Council — not accepted, not executed here.</p>
          <ol className="sony-brief-decisions-list">
            {context.decisions.ipCouncil.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
          <div className="sony-brief-stages">
            <span>Current stage: <b>{governance.currentLifecycleStage}</b></span>
            <span>Next stage: <b>{governance.nextLifecycleStage}</b></span>
            <span className="sony-brief-rights">Rights review: {governance.rightsReview}</span>
          </div>
        </section>
        )}

        {/* 5 — Risks and guardrails (GREEN/NEUTRAL = governance) */}
        {show(5) && (
        <section className="sony-brief-section sony-brief-guardrails" aria-label="Risks and guardrails">
          <h2 className="sony-brief-h2">Risks &amp; guardrails</h2>
          <ul className="sony-brief-risks">
            {context.keyRisks.map((r) => (
              <li key={r} className="sony-brief-risk-chip">{r}</li>
            ))}
          </ul>
          <ul className="sony-brief-guards">
            <li>Aggregate signals only — no individual-level identifiers</li>
            <li>Each operating company retains control</li>
            <li>An internal Slack collaboration request has been posted for review</li>
          </ul>
        </section>
        )}
      </div>

      {show(5) && (
        <>
          {/* Exact status banner */}
          <div className="sony-brief-banner" role="status">
            {governance.statusBanner}
          </div>
          <div className="sony-brief-actions">
            <ActivationLink url={activationUrl} label={ACTIVATION_ACTION_LABEL} />
          </div>
        </>
      )}
    </article>
  );
}
