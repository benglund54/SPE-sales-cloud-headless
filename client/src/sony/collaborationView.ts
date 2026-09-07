import type { SonyActivationContext } from 'shared/src/sonyActivation';

/**
 * HX-7H-C — presentation-neutral collaboration-request view model.
 *
 * Derived from the canonical SONY_ACTIVATION_CONTEXT so Teams (and any future
 * Slack) surface renders the SAME approved intelligence without hardcoding a
 * separate set of metric values/facts in scene JSX. This is a CLIENT view model
 * only — it is not part of the shared/server contract, and it carries no
 * Slack-markdown or Teams-styling tokens. The surface renderer decides
 * presentation; the values here stay reusable.
 */
export interface CollabMetric { value: string; label: string }
export interface CollabIpMoment {
  propertyKey: string;
  title: string;
  status: 'CURRENT' | 'FUTURE';
  lines: [string, string];
}
export interface CollabOpCo { name: string; state: 'Lead' | 'Pending' }
export interface CollaborationRequest {
  headline: { tag: string; title: string };
  metrics: CollabMetric[];
  ipMoments: CollabIpMoment[];
  whyNow: string;
  opCoStatuses: CollabOpCo[];
  connectedFanIdea: string;
  decisions: string[];
  lifecycle: string;
  rights: string;
  governanceBanner: string;
  actionLabel: string;
}

export function buildCollaborationRequest(context: SonyActivationContext): CollaborationRequest {
  const { audience, modelScores, opCoRoles, governance } = context;
  const engagement = modelScores.find((m) => m.label === 'Engagement Score');
  const crossAffinity = modelScores.find((m) => m.label === 'Cross-Affinity Score');
  const lead = opCoRoles.find((r) => r.participationStatus === 'Accountable');
  const pending = opCoRoles.filter((r) => r.participationStatus === 'Pending');

  return {
    headline: {
      tag: 'Cross-Sony Collaboration Request',
      title: 'Spider-Man EMEA opportunity ready for review',
    },
    // Exactly four primary metrics (no whitespace score).
    metrics: [
      { value: audience.size, label: 'audience' },
      { value: `${audience.opportunityScore} / #${audience.qualifiedOpportunityRank}`, label: 'priority' },
      { value: String(engagement?.value ?? ''), label: 'engagement' },
      { value: String(crossAffinity?.value ?? ''), label: 'cross-affinity' },
    ],
    // Two IP moments with packaged poster art + two approved description lines.
    ipMoments: [
      {
        propertyKey: 'PROP-BND',
        title: 'Spider-Man: Brand New Day',
        status: 'CURRENT',
        lines: [
          'Sony Pictures’ active release anchor for the EMEA opportunity.',
          'Momentum provides the near-term trigger for PlayStation and Music participation.',
        ],
      },
      {
        propertyKey: 'PROP-BTSV',
        title: 'Spider-Man: Beyond the Spider-Verse',
        status: 'FUTURE',
        lines: [
          'Future Pictures moment extending the Spider-Man engagement window.',
          'Provides a follow-on opportunity to sustain the connected fan experience.',
        ],
      },
    ],
    whyNow: 'Brand New Day momentum, PlayStation engagement, and Music affinity create a near-term EMEA window.',
    opCoStatuses: [
      { name: lead?.name ?? 'Sony Pictures', state: 'Lead' },
      ...pending.map((p) => ({ name: p.name, state: 'Pending' as const })),
    ],
    connectedFanIdea:
      'Extend the Pictures-led moment through eligible PlayStation rewards and Sony Music soundtrack or artist experiences.',
    decisions: [
      'Confirm EMEA window',
      'Confirm OpCo participation',
      'Proceed after rights review',
    ],
    lifecycle: 'OpCo approval → orchestration',
    rights: 'Rights review pending',
    governanceBanner: governance.statusBanner,
    actionLabel: 'Review activation in Salesforce',
  };
}
