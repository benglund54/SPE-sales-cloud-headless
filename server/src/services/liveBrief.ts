/**
 * Optional live executive-brief architecture — DISABLED by default.
 *
 * This module is only wired into a route when LIVE_EXEC_BRIEF === 'true'
 * (see routes/liveBrief.ts / index.ts). When the flag is false the route is
 * never registered, so there is nothing callable. No real Anthropic request is
 * made in HX-5.
 *
 * Everything here is defense-in-depth: a strict outbound allowlist, strict
 * response validation, and a guaranteed deterministic fallback. Internal
 * failure reasons are logged as sanitized codes only and are NEVER returned to
 * the browser.
 */
import { SONY_ACTIVATION_CONTEXT } from '../shared/sonyActivation.js';

/** Max accepted request body size in bytes (tiny — the request carries no data). */
export const MAX_BODY_BYTES = 2048;

/**
 * The ONLY fields sent outbound to a model. No Salesforce record IDs, no URLs,
 * no secrets, no config values, no provenance.internalValue, no scene-specific
 * copy beyond what is listed here. Built from the frozen context so it cannot
 * drift to include unapproved fields.
 */
export interface SanitizedBriefInput {
  ip: string;
  anchorProperty: string;
  opportunityTitle: string;
  region: string;
  audience: {
    name: string;
    size: string;
    qualifiedOpportunityRank: number;
    modeledRevenueRegionRank: number;
    opportunityScore: number;
  };
  modelScores: { label: string; value: number }[];
  releaseMoments: { title: string; status: string }[];
  opCoRoles: { name: string; participationStatus: string }[];
  lifecycle: { current: string; next: string; rightsReview: string };
  ipCouncilDecisions: string[];
  keyRisks: string[];
  statusBanner: string;
}

/**
 * Build the sanitized allowlisted payload. Explicitly copies only approved
 * primitive fields; never spreads the whole context.
 */
export function buildSanitizedInput(): SanitizedBriefInput {
  const c = SONY_ACTIVATION_CONTEXT;
  return {
    ip: c.ip,
    anchorProperty: c.anchorProperty,
    opportunityTitle: c.opportunityTitle,
    region: c.region,
    audience: {
      name: c.audience.name,
      size: c.audience.size,
      qualifiedOpportunityRank: c.audience.qualifiedOpportunityRank,
      modeledRevenueRegionRank: c.audience.modeledRevenueRegionRank,
      opportunityScore: c.audience.opportunityScore,
    },
    modelScores: c.modelScores.map((m) => ({ label: m.label, value: m.value })),
    releaseMoments: c.releaseMoments.map((r) => ({ title: r.title, status: r.status })),
    opCoRoles: c.opCoRoles.map((r) => ({ name: r.name, participationStatus: r.participationStatus })),
    lifecycle: {
      current: c.governance.currentLifecycleStage,
      next: c.governance.nextLifecycleStage,
      rightsReview: c.governance.rightsReview,
    },
    ipCouncilDecisions: [...c.decisions.ipCouncil],
    keyRisks: [...c.keyRisks],
    statusBanner: c.governance.statusBanner,
  };
}

/** Keys that must NEVER appear anywhere in the sanitized outbound payload. */
const FORBIDDEN_IN_PAYLOAD = [
  'id',
  'url',
  'activationurl',
  'salesforce',
  'token',
  'secret',
  'apikey',
  'internalvalue',
  'displaylabel',
  'provenance',
  'password',
];

/**
 * Assert the sanitized payload contains no forbidden key fragment (record IDs,
 * URLs, secrets, internal metadata). Returns offending key paths (empty = ok).
 */
export function findForbiddenPayloadKeys(value: unknown, path = ''): string[] {
  const offenders: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((v, i) => offenders.push(...findForbiddenPayloadKeys(v, `${path}[${i}]`)));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const lower = k.toLowerCase();
      // exact-ish fragment match, but allow "opportunityTitle"/"ip" legit fields
      if (
        FORBIDDEN_IN_PAYLOAD.some((frag) =>
          frag === 'id' ? /(^|[^a-z])id([^a-z]|$)/i.test(k) : lower.includes(frag)
        )
      ) {
        offenders.push(path ? `${path}.${k}` : k);
      }
      offenders.push(...findForbiddenPayloadKeys(v, path ? `${path}.${k}` : k));
    }
  }
  return offenders;
}

export interface BriefSections {
  executiveRecommendation: string;
  groundedFacts: string[];
  connectedValue: string;
  ipCouncilDecisions: string[];
  keyRisks: string[];
  statusBanner: string;
}

/** Sanitized outcome codes for server logging only. Never sent to the browser. */
export type FallbackCode =
  | 'disabled'
  | 'model-unavailable'
  | 'timeout'
  | 'http-error'
  | 'auth-error'
  | 'malformed-json'
  | 'missing-fields'
  | 'too-long'
  | 'prohibited-content'
  | 'invented-date'
  | 'altered-metric';

export interface ValidationOutcome {
  ok: boolean;
  code?: FallbackCode;
}

const MAX_SECTION_LEN = 1200;

/**
 * Strictly validate a model response against the governed facts. Any failure
 * returns a sanitized FallbackCode; the caller then serves the deterministic
 * brief. Rules:
 *   - Must contain all required sections and non-empty decisions/risks.
 *   - No section may exceed MAX_SECTION_LEN.
 *   - No prohibited "already happened" claims.
 *   - No invented year for Beyond the Spider-Verse (In Development, no date).
 *   - Authoritative metrics (1.85M, 91.58, 82.3, 84, ranks) may not be altered.
 *   - The exact status banner must be preserved.
 */
export function validateBrief(candidate: unknown): ValidationOutcome {
  if (!candidate || typeof candidate !== 'object') return { ok: false, code: 'malformed-json' };
  const b = candidate as Record<string, any>;

  const requiredStrings = ['executiveRecommendation', 'connectedValue', 'statusBanner'];
  for (const key of requiredStrings) {
    if (typeof b[key] !== 'string' || b[key].length === 0) return { ok: false, code: 'missing-fields' };
  }
  const requiredArrays = ['groundedFacts', 'ipCouncilDecisions', 'keyRisks'];
  for (const key of requiredArrays) {
    if (!Array.isArray(b[key]) || b[key].length === 0) return { ok: false, code: 'missing-fields' };
  }

  const allText = [
    b.executiveRecommendation,
    b.connectedValue,
    b.statusBanner,
    ...b.groundedFacts,
    ...b.ipCouncilDecisions,
    ...b.keyRisks,
  ].join('\n');

  if (allText.length > MAX_SECTION_LEN * 6) return { ok: false, code: 'too-long' };
  for (const key of requiredStrings) {
    if (b[key].length > MAX_SECTION_LEN) return { ok: false, code: 'too-long' };
  }

  const lower = allText.toLowerCase();
  // Affirmative "already happened" claims only. NOTE: the approved status
  // banner legitimately contains the NEGATED phrase "no audience activated",
  // so we must not flag the bare word "activated" — only affirmative claims.
  const prohibited = [
    'has been activated',
    'was activated',
    'now activated',
    'has been approved',
    'was approved',
    'sent to customers',
    'has been published',
    'was published',
  ];
  for (const p of prohibited) {
    if (lower.includes(p)) return { ok: false, code: 'prohibited-content' };
  }

  // No invented date for Beyond the Spider-Verse.
  const bsvIdx = lower.indexOf('beyond the spider-verse');
  if (bsvIdx !== -1) {
    const around = allText.slice(bsvIdx, bsvIdx + 120);
    if (/\b(19|20)\d{2}\b/.test(around)) return { ok: false, code: 'invented-date' };
  }

  // Authoritative metrics must be present and unaltered.
  const facts = b.groundedFacts.join(' ');
  const required = ['1.85M', '91.58', '82.3', '84'];
  for (const metric of required) {
    if (!allText.includes(metric) && !facts.includes(metric)) {
      return { ok: false, code: 'altered-metric' };
    }
  }
  // Exact status banner preserved.
  if (b.statusBanner !== SONY_ACTIVATION_CONTEXT.governance.statusBanner) {
    return { ok: false, code: 'altered-metric' };
  }

  return { ok: true };
}
