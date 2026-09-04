/**
 * SYNCED COPY — DO NOT EDIT DIRECTLY.
 *
 * The authoritative source of this contract is `shared/src/sonyActivation.ts`.
 * The server keeps a local copy because the server's `tsc` emit (rootDir:
 * ./src, outDir: ./dist) cannot reference files outside its rootDir (TS6059),
 * matching the repo's existing pattern of duplicating shared types across
 * packages. A Vitest test asserts this file stays byte-identical to the
 * authoritative source below the banner.
 */

/**
 * Sony Headless 360 — authoritative shared Activation contract.
 *
 * This module is the single source of truth for the sanitized Sony IP360
 * Activation context consumed by all three headless scenes (Slack, Teams,
 * Claude). It contains:
 *   - The TypeScript interfaces describing the context
 *   - One frozen, deterministic Sony Activation context object
 *   - A runtime validator used by the server (before serving), the client
 *     (before rendering), and the tests
 *
 * Hard rules (enforced by tests):
 *   - No secrets, credentials, tokens, sessions, private user info, or PII.
 *   - No hardcoded Salesforce hostname or record IDs.
 *   - The Salesforce Activation URL is NOT part of the frozen data object; it
 *     is injected separately by the server from configuration.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export type OpCoName = 'Sony Pictures' | 'PlayStation' | 'Sony Music';

export interface OpCoRole {
  /** Operating company. */
  name: OpCoName;
  /** Human-readable role, e.g. "Accountable lead" | "Participation requested". */
  role: string;
  /** Structured participation state used for governance rendering. */
  participationStatus: 'Accountable' | 'Pending';
}

export interface DecisionSet {
  /** Three cross-Sony decisions surfaced in the Slack scene. */
  shared: [string, string, string];
  /** Three PlayStation-specific decisions surfaced in the Teams scene. */
  playstation: [string, string, string];
  /** Three IP Council decisions surfaced in the Claude scene. */
  ipCouncil: [string, string, string];
}

export interface Audience {
  name: string;
  size: string;
  qualifiedOpportunityRank: number;
  modeledRevenueRegionRank: number;
  opportunityScore: number;
  engagement: number;
  crossAffinity: number;
  whitespaceScore: number;
}

/**
 * One qualitative contributing signal (e.g. PlayStation Spider-Man play
 * activity, Spider-Verse film/streaming affinity, soundtrack-listening
 * affinity). These are grounded descriptions only — they deliberately carry
 * NO channel-level numeric score, because no separately supported per-channel
 * number exists. The authoritative model numbers live in `modelScores`.
 */
export interface EvidenceSignal {
  /** Human-readable contributing-signal category. */
  label: string;
  /** Short qualitative descriptor for executive readability. */
  detail: string;
}

/**
 * An authoritative audience-model score with its correct meaning. These are
 * the only numbers with supported semantics (Engagement, Cross-Affinity,
 * Whitespace) and must never be relabeled as an individual channel.
 */
export interface ModelScore {
  /** Authoritative metric name, e.g. "Engagement Score". */
  label: string;
  /** Numeric value from the governed audience model. */
  value: number;
}

/**
 * Release posture for a Spider-Man property referenced by the opportunity.
 * `status` deliberately avoids invented dates; "In Development" is the only
 * permitted forward-looking descriptor.
 */
export interface ReleaseMoment {
  title: string;
  status: 'Active release moment' | 'In Development';
}

export interface Approvals {
  sonyPictures: 'Pending';
  playStation: 'Pending';
  sonyMusic: 'Pending';
}

export interface Governance {
  overallStatus: 'Draft';
  approvalState: 'Pending Approval';
  currentLifecycleStage: 'OpCo Approval';
  nextLifecycleStage: 'Ready for Orchestration';
  rightsReview: string;
  audienceQualification: 'Passed';
  consentAndPermittedUse: 'Passed';
  activationEligibility: 'Eligible';
  approvals: Approvals;
  permittedContext: string[];
  restrictedCategories: string[];
  /** Exact audience-facing banner. */
  statusBanner: string;
}

export interface SlackSceneCopy {
  title: string;
  whyNow: string;
  experienceSummary: string;
  actions: string[];
}

export interface TeamsSceneCopy {
  title: string;
  opportunity: string;
  whyPlaystation: string;
  proposedContribution: string;
  statusLine: string;
  actions: string[];
}

export interface ClaudeSceneCopy {
  experienceName: string;
  presenterPrompt: string;
  /** The 13-section deterministic briefing order. */
  sectionOrder: string[];
}

export interface SceneCopy {
  slack: SlackSceneCopy;
  teams: TeamsSceneCopy;
  claude: ClaudeSceneCopy;
}

export interface Provenance {
  sourcedFactKeys: string[];
  recommendationKeys: string[];
  pendingDecisionKeys: string[];
  /**
   * Truthful internal provenance value, preserved for accuracy. The UI shows
   * `displayLabel` (polished, executive-safe); `internalValue` is retained for
   * internal record-keeping and MUST NOT be rendered to the audience.
   */
  internalValue: string;
  /** Polished, audience-facing provenance label. */
  displayLabel: string;
}

export interface SonyActivationContext {
  // Core identity
  ip: 'Spider-Man';
  anchorProperty: 'Spider-Man: Brand New Day';
  opportunityTitle: 'EMEA Connected Fan Moment';
  fullDisplayTitle: string;
  region: 'EMEA';

  // Audience & signals
  audience: Audience;

  // Authoritative audience-model scores (correctly labeled meanings)
  modelScores: ModelScore[];

  // Qualitative contributing signals (NO per-channel numeric scores)
  evidenceSignals: EvidenceSignal[];

  // Release posture for referenced Spider-Man properties
  releaseMoments: ReleaseMoment[];

  // Approved narrative wording
  whitespaceRationale: string;
  proposedFanExperience: string;
  fanValue: string;
  businessHypothesis: string;

  // Operating companies
  opCoRoles: OpCoRole[];

  // Decisions
  decisions: DecisionSet;

  // Status & governance
  governance: Governance;

  // Claude executive-brief content
  executiveRecommendation: string;
  keyRisks: string[];

  // Per-scene presentation copy
  scenes: SceneCopy;

  // Source / recommendation / pending visual treatment
  provenance: Provenance;
}

/**
 * Shape returned by GET /api/activation-context. The Activation URL lives here
 * (not in the frozen context) and is sourced only from server configuration.
 */
export interface ActivationContextResponse {
  context: SonyActivationContext;
  activationUrl: string | null;
}

// ---------------------------------------------------------------------------
// Frozen deterministic Sony Activation context (approved content, verbatim)
// ---------------------------------------------------------------------------

const rawContext: SonyActivationContext = {
  ip: 'Spider-Man',
  anchorProperty: 'Spider-Man: Brand New Day',
  opportunityTitle: 'EMEA Connected Fan Moment',
  fullDisplayTitle: 'Spider-Man: Brand New Day — EMEA Connected Fan Moment',
  region: 'EMEA',

  audience: {
    name: 'EMEA Spider-Verse Player-Fans',
    size: '1.85M',
    qualifiedOpportunityRank: 1,
    modeledRevenueRegionRank: 3,
    opportunityScore: 91.58,
    engagement: 82.3,
    crossAffinity: 84.0,
    whitespaceScore: 53.9,
  },

  // Authoritative model scores — the ONLY numbers with supported semantics.
  // Sourced from the audience model above; never relabeled as a channel.
  modelScores: [
    { label: 'Engagement Score', value: 82.3 },
    { label: 'Cross-Affinity Score', value: 84.0 },
    { label: 'Whitespace Score', value: 53.9 },
  ],

  // Grounded contributing signals — qualitative only, NO per-channel numbers.
  evidenceSignals: [
    {
      label: 'PlayStation Spider-Man play activity',
      detail: 'Sustained EMEA player engagement across the Spider-Man game portfolio.',
    },
    {
      label: 'Spider-Verse film and streaming affinity',
      detail: 'Strong overlap between EMEA players and Spider-Man film and streaming viewing.',
    },
    {
      label: 'Soundtrack-listening affinity',
      detail: 'Soundtrack-listening affinity is present within the qualified cohort.',
    },
  ],

  releaseMoments: [
    { title: 'Spider-Man: Brand New Day', status: 'Active release moment' },
    { title: 'Beyond the Spider-Verse', status: 'In Development' },
  ],

  whitespaceRationale:
    'EMEA is only the number-three region in modeled Spider-Man revenue, but it ranks first among qualified opportunities because eligible audience size, engagement, cross-affinity, whitespace, and timing are currently aligned.',

  proposedFanExperience:
    'A coordinated EMEA Spider-Man fan moment in which Sony Pictures leads with relevant Brand New Day content and the primary fan invitation, PlayStation may extend the experience with an eligible digital reward, challenge, or discovery moment through a PlayStation-controlled channel, and Sony Music may deepen the experience with an eligible soundtrack, playlist, or artist moment through a Sony Music-controlled channel.',

  fanValue:
    'A more connected Spider-Man experience across the Sony relationships the fan already chooses to have.',

  businessHypothesis:
    'Increase engagement and cross-property discovery within the qualified EMEA cohort while creating measurable value for each participating Sony business.',

  opCoRoles: [
    { name: 'Sony Pictures', role: 'Accountable lead', participationStatus: 'Accountable' },
    { name: 'PlayStation', role: 'Participation requested', participationStatus: 'Pending' },
    { name: 'Sony Music', role: 'Participation requested', participationStatus: 'Pending' },
  ],

  decisions: {
    shared: [
      'Confirm the proposed EMEA operating window.',
      'Confirm PlayStation and Sony Music participation.',
      'Authorize detailed planning after rights review.',
    ],
    playstation: [
      'Confirm whether PlayStation will participate.',
      'Identify the accountable PlayStation owner.',
      'Confirm the eligible experience and planning window.',
    ],
    ipCouncil: [
      'Approve the EMEA opportunity as the first detailed IP360 planning candidate.',
      'Confirm PlayStation and Sony Music participation and accountable owners.',
      'Authorize detailed experience and measurement planning after rights review.',
    ],
  },

  governance: {
    overallStatus: 'Draft',
    approvalState: 'Pending Approval',
    currentLifecycleStage: 'OpCo Approval',
    nextLifecycleStage: 'Ready for Orchestration',
    rightsReview: 'Required — pending review',
    audienceQualification: 'Passed',
    consentAndPermittedUse: 'Passed',
    activationEligibility: 'Eligible',
    approvals: {
      sonyPictures: 'Pending',
      playStation: 'Pending',
      sonyMusic: 'Pending',
    },
    permittedContext: [
      'PlayStation engagement and portfolio signals',
      'Approved aggregate EMEA audience insight',
      'Shared opportunity and approval status',
      'High-level Pictures and Music planning context approved for shared use',
    ],
    restrictedCategories: [
      'Detailed Sony Pictures agreement terms',
      'Individual Sony Music customer or audience data',
      'Unannounced or unapproved product details',
    ],
    statusBanner: 'Draft — no audience activated and no customer communication sent.',
  },

  executiveRecommendation:
    'Advance the opportunity into detailed planning only after rights review and explicit participation decisions from Sony Pictures, PlayStation, and Sony Music. Do not begin orchestration until all required approvals are complete.',

  keyRisks: [
    'The operating window may close before the participating businesses align.',
    'Rights or promotional-use constraints may narrow the proposed experience.',
    'Each operating company must validate its eligible audience, channel, contribution, and measurement plan.',
    'No business outcome should be presented as committed until approval and measurement design are complete.',
  ],

  scenes: {
    slack: {
      title: 'Sony IP360 — Spider-Man EMEA opportunity ready for review',
      whyNow:
        'Brand New Day momentum, elevated PlayStation engagement, and strong Sony Music affinity create a near-term EMEA planning window.',
      experienceSummary: 'Pictures story → PlayStation engagement → Music discovery',
      actions: ['Review evidence', 'Open governed Activation'],
    },
    teams: {
      title: 'Action required: Review PlayStation participation',
      opportunity: 'Spider-Man: Brand New Day — EMEA Connected Fan Moment',
      whyPlaystation:
        'Elevated EMEA Spider-Man player engagement overlaps with the Brand New Day planning window and a qualified aggregate cross-Sony audience.',
      proposedContribution:
        'An eligible digital reward, challenge, or discovery experience delivered through a PlayStation-controlled channel.',
      statusLine: 'PlayStation participation: Pending',
      actions: ['Open governed Activation'],
    },
    claude: {
      experienceName: 'Sony IP360 Executive Coworker',
      presenterPrompt:
        'Using this Sony IP360 opportunity and activation plan, prepare my briefing for tomorrow’s Sony IP Council. Summarize the opportunity, why it matters now, the proposed fan experience, each operating company’s role, unresolved rights and approvals, key risks, and the three decisions leadership needs to make. Respect my permissions, distinguish sourced facts from recommendations, and do not execute anything.',
      sectionOrder: [
        'Executive recommendation',
        'Why this matters now',
        'Qualified audience',
        'Number-one qualified opportunity versus number-three modeled-revenue finding',
        'Proposed fan experience',
        'Sony Pictures role',
        'PlayStation role',
        'Sony Music role',
        'Ownership, rights, and approvals',
        'Key risks',
        'Three IP Council decisions',
        'Salesforce evidence link',
        'Current safeguards',
      ],
    },
  },

  provenance: {
    sourcedFactKeys: [
      'audience.name',
      'audience.size',
      'audience.qualifiedOpportunityRank',
      'audience.modeledRevenueRegionRank',
      'audience.opportunityScore',
      'audience.engagement',
      'audience.crossAffinity',
      'audience.whitespaceScore',
      'governance.overallStatus',
      'governance.approvalState',
      'governance.currentLifecycleStage',
      'governance.rightsReview',
    ],
    recommendationKeys: ['executiveRecommendation', 'proposedFanExperience', 'businessHypothesis'],
    pendingDecisionKeys: ['decisions.shared', 'decisions.playstation', 'decisions.ipCouncil'],
    internalValue: 'Governed CRM signals (deterministic Sony Day baseline)',
    displayLabel: 'Governed CRM signals',
  },
};

/**
 * Deep-freeze a plain data object so the authoritative context cannot be
 * mutated at runtime by any consumer.
 */
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const value of Object.values(obj as Record<string, unknown>)) {
      deepFreeze(value);
    }
  }
  return obj;
}

/** The frozen, authoritative Sony Activation context. */
export const SONY_ACTIVATION_CONTEXT: SonyActivationContext = deepFreeze(rawContext);

// ---------------------------------------------------------------------------
// Runtime validator
// ---------------------------------------------------------------------------

/** Result of validating a candidate Sony Activation context. */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0;
}

function isTupleOfThreeStrings(v: unknown): v is [string, string, string] {
  return Array.isArray(v) && v.length === 3 && v.every(isNonEmptyString);
}

/**
 * Validate a candidate object against the Sony Activation contract. Returns a
 * structured result rather than throwing, so callers can decide how to react
 * (the server returns a safe error; tests assert on `errors`).
 */
export function validateSonyActivationContext(input: unknown): ValidationResult {
  const errors: string[] = [];
  const push = (msg: string) => errors.push(msg);

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['context is not an object'] };
  }
  const c = input as Record<string, any>;

  // Core identity
  if (c.ip !== 'Spider-Man') push('ip must be "Spider-Man"');
  if (c.anchorProperty !== 'Spider-Man: Brand New Day') push('anchorProperty mismatch');
  if (c.opportunityTitle !== 'EMEA Connected Fan Moment') push('opportunityTitle mismatch');
  if (!isNonEmptyString(c.fullDisplayTitle)) push('fullDisplayTitle missing');
  if (c.region !== 'EMEA') push('region must be "EMEA"');

  // Audience & signals
  const a = c.audience;
  if (!a || typeof a !== 'object') {
    push('audience missing');
  } else {
    if (!isNonEmptyString(a.name)) push('audience.name missing');
    if (!isNonEmptyString(a.size)) push('audience.size missing');
    if (a.qualifiedOpportunityRank !== 1) push('audience.qualifiedOpportunityRank must be 1');
    if (a.modeledRevenueRegionRank !== 3) push('audience.modeledRevenueRegionRank must be 3');
    if (a.opportunityScore !== 91.58) push('audience.opportunityScore must be 91.58');
    if (a.engagement !== 82.3) push('audience.engagement must be 82.3');
    if (a.crossAffinity !== 84.0) push('audience.crossAffinity must be 84.0');
    if (a.whitespaceScore !== 53.9) push('audience.whitespaceScore must be 53.9');
  }

  // Authoritative model scores — exactly the three supported meanings/values.
  const expectedScores: Record<string, number> = {
    'Engagement Score': 82.3,
    'Cross-Affinity Score': 84.0,
    'Whitespace Score': 53.9,
  };
  if (!Array.isArray(c.modelScores) || c.modelScores.length !== 3) {
    push('modelScores must have exactly 3 entries');
  } else {
    for (const [label, value] of Object.entries(expectedScores)) {
      const found = c.modelScores.find((m: any) => m?.label === label);
      if (!found) push(`modelScores missing "${label}"`);
      else if (found.value !== value) push(`modelScores "${label}" must be ${value}`);
    }
  }

  // Contributing signals — exactly three QUALITATIVE lines (label + detail).
  // They must NOT carry a per-channel numeric score (HX-2a correction).
  if (!Array.isArray(c.evidenceSignals) || c.evidenceSignals.length !== 3) {
    push('evidenceSignals must have exactly 3 entries');
  } else {
    if (!c.evidenceSignals.every((s: any) => isNonEmptyString(s?.label) && isNonEmptyString(s?.detail))) {
      push('each evidenceSignal needs label and detail');
    }
    if (c.evidenceSignals.some((s: any) => typeof s?.score === 'number' || 'score' in (s ?? {}))) {
      push('evidenceSignal must NOT carry a per-channel numeric score');
    }
  }

  // Release moments — Brand New Day active; only "In Development" is a valid
  // forward-looking status (no invented dates).
  if (!Array.isArray(c.releaseMoments) || c.releaseMoments.length === 0) {
    push('releaseMoments missing');
  } else {
    const bnd = c.releaseMoments.find((r: any) => r?.title === 'Spider-Man: Brand New Day');
    if (!bnd || bnd.status !== 'Active release moment') {
      push('Brand New Day must be an "Active release moment"');
    }
    const allowed = new Set(['Active release moment', 'In Development']);
    if (!c.releaseMoments.every((r: any) => allowed.has(r?.status))) {
      push('releaseMoments status must be "Active release moment" or "In Development"');
    }
  }

  // Approved wording present
  if (!isNonEmptyString(c.whitespaceRationale)) push('whitespaceRationale missing');
  if (!isNonEmptyString(c.proposedFanExperience)) push('proposedFanExperience missing');
  if (!isNonEmptyString(c.fanValue)) push('fanValue missing');
  if (!isNonEmptyString(c.businessHypothesis)) push('businessHypothesis missing');

  // Operating companies
  if (!Array.isArray(c.opCoRoles) || c.opCoRoles.length !== 3) {
    push('opCoRoles must have exactly 3 entries');
  } else {
    const lead = c.opCoRoles.find((r: any) => r?.name === 'Sony Pictures');
    if (!lead || lead.participationStatus !== 'Accountable') {
      push('Sony Pictures must be the Accountable lead');
    }
    for (const opco of ['PlayStation', 'Sony Music']) {
      const r = c.opCoRoles.find((x: any) => x?.name === opco);
      if (!r || r.participationStatus !== 'Pending') {
        push(`${opco} must be a Pending proposed participant`);
      }
    }
  }

  // Decisions — exactly three each
  const d = c.decisions;
  if (!d || typeof d !== 'object') {
    push('decisions missing');
  } else {
    if (!isTupleOfThreeStrings(d.shared)) push('decisions.shared must have exactly 3 items');
    if (!isTupleOfThreeStrings(d.playstation)) push('decisions.playstation must have exactly 3 items');
    if (!isTupleOfThreeStrings(d.ipCouncil)) push('decisions.ipCouncil must have exactly 3 items');
  }

  // Governance
  const g = c.governance;
  if (!g || typeof g !== 'object') {
    push('governance missing');
  } else {
    if (g.overallStatus !== 'Draft') push('governance.overallStatus must be "Draft"');
    if (g.approvalState !== 'Pending Approval') push('governance.approvalState must be "Pending Approval"');
    if (g.currentLifecycleStage !== 'OpCo Approval') push('governance.currentLifecycleStage must be "OpCo Approval"');
    if (g.nextLifecycleStage !== 'Ready for Orchestration') push('governance.nextLifecycleStage must be "Ready for Orchestration"');
    if (!isNonEmptyString(g.rightsReview)) push('governance.rightsReview missing');
    if (g.audienceQualification !== 'Passed') push('governance.audienceQualification must be "Passed"');
    if (g.consentAndPermittedUse !== 'Passed') push('governance.consentAndPermittedUse must be "Passed"');
    if (g.activationEligibility !== 'Eligible') push('governance.activationEligibility must be "Eligible"');
    if (!g.approvals || g.approvals.sonyPictures !== 'Pending' || g.approvals.playStation !== 'Pending' || g.approvals.sonyMusic !== 'Pending') {
      push('governance.approvals must all be "Pending"');
    }
    if (!Array.isArray(g.permittedContext) || g.permittedContext.length === 0) push('governance.permittedContext missing');
    if (!Array.isArray(g.restrictedCategories) || g.restrictedCategories.length === 0) push('governance.restrictedCategories missing');
    if (g.statusBanner !== 'Draft — no audience activated and no customer communication sent.') {
      push('governance.statusBanner must be the exact approved banner');
    }
  }

  // Claude brief content
  if (!isNonEmptyString(c.executiveRecommendation)) push('executiveRecommendation missing');
  if (!Array.isArray(c.keyRisks) || c.keyRisks.length === 0) push('keyRisks missing');

  // Scene copy
  const s = c.scenes;
  if (!s || typeof s !== 'object') {
    push('scenes missing');
  } else {
    if (!s.slack || !isNonEmptyString(s.slack.title)) push('scenes.slack.title missing');
    if (!s.teams || !isNonEmptyString(s.teams.title)) push('scenes.teams.title missing');
    if (!s.claude || !isNonEmptyString(s.claude.experienceName)) push('scenes.claude.experienceName missing');
    if (!s.claude || !isNonEmptyString(s.claude.presenterPrompt)) push('scenes.claude.presenterPrompt missing');
    if (!s.claude || !Array.isArray(s.claude.sectionOrder) || s.claude.sectionOrder.length !== 13) {
      push('scenes.claude.sectionOrder must have exactly 13 sections');
    }
  }

  // Provenance — polished display label present; internal value preserved
  const p = c.provenance;
  if (!p || typeof p !== 'object') {
    push('provenance missing');
  } else {
    if (!isNonEmptyString(p.displayLabel)) push('provenance.displayLabel missing');
    if (!isNonEmptyString(p.internalValue)) push('provenance.internalValue missing');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * A denylist of key-name fragments that must never appear anywhere in the
 * sanitized context payload. Used by the endpoint (defense in depth) and by
 * tests to prove no credential/session/PII field leaks into the browser.
 */
export const FORBIDDEN_KEY_FRAGMENTS: string[] = [
  'password',
  'secret',
  'token',
  'session',
  'credential',
  'apikey',
  'api_key',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'securitytoken',
  'security_token',
  'clientsecret',
  'client_secret',
  'privatekey',
  'private_key',
  'authorization',
  'cookie',
  'ssn',
  'email',
  'phone',
];

/**
 * Recursively assert that no object key in `value` matches a forbidden
 * fragment. Returns the list of offending key paths (empty = clean).
 */
export function findForbiddenKeys(value: unknown, path = ''): string[] {
  const offenders: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((item, i) => offenders.push(...findForbiddenKeys(item, `${path}[${i}]`)));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const lower = key.toLowerCase();
      if (FORBIDDEN_KEY_FRAGMENTS.some((frag) => lower.includes(frag))) {
        offenders.push(path ? `${path}.${key}` : key);
      }
      offenders.push(...findForbiddenKeys(child, path ? `${path}.${key}` : key));
    }
  }
  return offenders;
}
