/**
 * HX-1 foundational tests — shared Sony Activation contract.
 *
 * Runner: Node's built-in test runner via the tsx loader (zero new deps).
 *   node --import tsx --test tests/*.test.ts
 *
 * These tests validate the authoritative contract in shared/src/sonyActivation.ts.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SONY_ACTIVATION_CONTEXT,
  validateSonyActivationContext,
  findForbiddenKeys,
} from '../shared/src/sonyActivation.ts';

test('frozen context passes validation', () => {
  const { valid, errors } = validateSonyActivationContext(SONY_ACTIVATION_CONTEXT);
  assert.equal(valid, true, `unexpected errors: ${errors.join('; ')}`);
  assert.equal(errors.length, 0);
});

test('the context object is deeply frozen (cannot be mutated)', () => {
  assert.equal(Object.isFrozen(SONY_ACTIVATION_CONTEXT), true);
  assert.equal(Object.isFrozen(SONY_ACTIVATION_CONTEXT.audience), true);
  assert.equal(Object.isFrozen(SONY_ACTIVATION_CONTEXT.governance), true);
});

test('exact approved core identity', () => {
  assert.equal(SONY_ACTIVATION_CONTEXT.ip, 'Spider-Man');
  assert.equal(SONY_ACTIVATION_CONTEXT.anchorProperty, 'Spider-Man: Brand New Day');
  assert.equal(SONY_ACTIVATION_CONTEXT.opportunityTitle, 'EMEA Connected Fan Moment');
  assert.equal(
    SONY_ACTIVATION_CONTEXT.fullDisplayTitle,
    'Spider-Man: Brand New Day — EMEA Connected Fan Moment'
  );
  assert.equal(SONY_ACTIVATION_CONTEXT.region, 'EMEA');
});

test('exact approved audience name and size', () => {
  assert.equal(SONY_ACTIVATION_CONTEXT.audience.name, 'EMEA Spider-Verse Player-Fans');
  assert.equal(SONY_ACTIVATION_CONTEXT.audience.size, '1.85M');
});

test('exact approved numeric values', () => {
  const a = SONY_ACTIVATION_CONTEXT.audience;
  assert.equal(a.qualifiedOpportunityRank, 1);
  assert.equal(a.modeledRevenueRegionRank, 3);
  assert.equal(a.opportunityScore, 91.58);
  assert.equal(a.engagement, 82.3);
  assert.equal(a.crossAffinity, 84.0);
  assert.equal(a.whitespaceScore, 53.9);
});

test('operating-company roles: Sony Pictures lead, PlayStation + Sony Music pending', () => {
  const roles = SONY_ACTIVATION_CONTEXT.opCoRoles;
  assert.equal(roles.length, 3);
  const pictures = roles.find((r) => r.name === 'Sony Pictures');
  const playstation = roles.find((r) => r.name === 'PlayStation');
  const music = roles.find((r) => r.name === 'Sony Music');
  assert.equal(pictures?.participationStatus, 'Accountable');
  assert.equal(playstation?.participationStatus, 'Pending');
  assert.equal(music?.participationStatus, 'Pending');
});

test('exactly three shared (Slack) decisions', () => {
  assert.equal(SONY_ACTIVATION_CONTEXT.decisions.shared.length, 3);
});

test('exactly three PlayStation (Teams) decisions', () => {
  assert.equal(SONY_ACTIVATION_CONTEXT.decisions.playstation.length, 3);
});

test('exactly three IP Council (Claude) decisions', () => {
  assert.equal(SONY_ACTIVATION_CONTEXT.decisions.ipCouncil.length, 3);
});

test('exact Draft / Pending status banner', () => {
  assert.equal(
    SONY_ACTIVATION_CONTEXT.governance.statusBanner,
    'Draft — no audience activated and no customer communication sent.'
  );
});

test('approved governance states', () => {
  const g = SONY_ACTIVATION_CONTEXT.governance;
  assert.equal(g.overallStatus, 'Draft');
  assert.equal(g.approvalState, 'Pending Approval');
  assert.equal(g.currentLifecycleStage, 'OpCo Approval');
  assert.equal(g.nextLifecycleStage, 'Ready for Orchestration');
  assert.equal(g.rightsReview, 'Required — pending review');
  assert.equal(g.audienceQualification, 'Passed');
  assert.equal(g.consentAndPermittedUse, 'Passed');
  assert.equal(g.activationEligibility, 'Eligible');
  assert.equal(g.approvals.sonyPictures, 'Pending');
  assert.equal(g.approvals.playStation, 'Pending');
  assert.equal(g.approvals.sonyMusic, 'Pending');
});

test('Claude scene has the 13-section deterministic briefing order', () => {
  assert.equal(SONY_ACTIVATION_CONTEXT.scenes.claude.sectionOrder.length, 13);
});

test('no credential/token/password/session/email/PII-shaped keys exist', () => {
  const offenders = findForbiddenKeys(SONY_ACTIVATION_CONTEXT);
  assert.deepEqual(offenders, [], `forbidden keys found: ${offenders.join(', ')}`);
});

// --- Negative cases: missing / invalid required fields must fail ---------

test('missing required field fails validation', () => {
  const bad = structuredClone(SONY_ACTIVATION_CONTEXT) as any;
  delete bad.audience;
  const { valid, errors } = validateSonyActivationContext(bad);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('audience')));
});

test('wrong numeric value fails validation', () => {
  const bad = structuredClone(SONY_ACTIVATION_CONTEXT) as any;
  bad.audience.opportunityScore = 99.99;
  const { valid, errors } = validateSonyActivationContext(bad);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('opportunityScore')));
});

test('wrong rank fails validation (qualified must be 1, revenue must be 3)', () => {
  const bad = structuredClone(SONY_ACTIVATION_CONTEXT) as any;
  bad.audience.qualifiedOpportunityRank = 2;
  const { valid } = validateSonyActivationContext(bad);
  assert.equal(valid, false);
});

test('altered status banner fails validation', () => {
  const bad = structuredClone(SONY_ACTIVATION_CONTEXT) as any;
  bad.governance.statusBanner = 'nothing activated or sent';
  const { valid, errors } = validateSonyActivationContext(bad);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('statusBanner')));
});

test('fewer than three decisions fails validation', () => {
  const bad = structuredClone(SONY_ACTIVATION_CONTEXT) as any;
  bad.decisions.shared = ['only one'];
  const { valid } = validateSonyActivationContext(bad);
  assert.equal(valid, false);
});

test('non-object input fails validation safely', () => {
  assert.equal(validateSonyActivationContext(null).valid, false);
  assert.equal(validateSonyActivationContext(undefined).valid, false);
  assert.equal(validateSonyActivationContext('nope').valid, false);
});

test('findForbiddenKeys detects a planted secret-shaped key', () => {
  const planted = { audience: { access_token: 'x' } };
  const offenders = findForbiddenKeys(planted);
  assert.ok(offenders.length >= 1);
  assert.ok(offenders.some((o) => o.includes('access_token')));
});
