import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { ActivationLink } from './ActivationLink';

interface Props {
  context: SonyActivationContext;
  activationUrl: string | null;
  /**
   * Progressive reveal count (1..8). When omitted, all sections render (static
   * default — preserves existing render tests). Reveal order (HX-6V-J):
   * 1 header (label/title/subtitle) · 2 recommendation · 3 grounded facts ·
   * 4 connected value · 5 decisions · 6 risks · 7 draft banner ·
   * 8 Salesforce action (last). Still renders exactly five section cards.
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
  // Undefined → show all (static default). Otherwise gate steps 1..8.
  const show = (n: number) => revealed === undefined || revealed >= n;
  // Reveal-entrance class only while progressively revealing (not on the static
  // default render). Each revealed block enters once and settles opaque.
  const reveal = revealed === undefined ? '' : ' sony-brief-reveal';

  return (
    <article className="sony-brief" aria-label={ARTIFACT_LABEL}>
      {/* 1 — Artifact label, title, subtitle */}
      {show(1) && (
      <header className={`sony-brief-head${reveal}`}>
        <div className="sony-brief-titles">
          <span className="sony-brief-artifact-tag">{ARTIFACT_LABEL}</span>
          <h1 className="sony-brief-title">{BRIEF_TITLE}</h1>
          <span className="sony-brief-supporting">{SUPPORTING_LABEL}</span>
        </div>
      </header>
      )}

      {/* 2 — Executive recommendation (PURPLE = Claude recommendation) */}
      {show(2) && (
      <section className={`sony-brief-section sony-brief-reco${reveal}`} aria-label="Executive recommendation">
        <h2 className="sony-brief-h2">Executive recommendation</h2>
        <p className="sony-brief-reco-text">{context.executiveRecommendation}</p>
        <p className="sony-brief-reco-conclusion">
          Advance to governed cross-OpCo review — not audience activation or customer communication.
        </p>
      </section>
      )}

      <div className="sony-brief-grid">
        {/* 3 — Grounded facts (BLUE = authoritative data) */}
        {show(3) && (
        <section className={`sony-brief-section sony-brief-facts${reveal}`} aria-label="Grounded facts">
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

        {/* 4 — Connected Sony value (NEUTRAL) */}
        {show(4) && (
        <section className={`sony-brief-section sony-brief-value${reveal}`} aria-label="Connected Sony value">
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

        {/* 5 — Decisions still pending (AMBER = human decisions) */}
        {show(5) && (
        <section className={`sony-brief-section sony-brief-decisions${reveal}`} aria-label="Decisions still pending">
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

        {/* 6 — Risks and guardrails (GREEN/NEUTRAL = governance) */}
        {show(6) && (
        <section className={`sony-brief-section sony-brief-guardrails${reveal}`} aria-label="Risks and guardrails">
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

      {/* 7 — Exact status banner */}
      {show(7) && (
        <div className={`sony-brief-banner${reveal}`} role="status">
          {governance.statusBanner}
        </div>
      )}
      {/* 8 — Salesforce action (revealed last) */}
      {show(8) && (
        <div className={`sony-brief-actions${reveal}`}>
          <ActivationLink url={activationUrl} label={ACTIVATION_ACTION_LABEL} />
        </div>
      )}
    </article>
  );
}
