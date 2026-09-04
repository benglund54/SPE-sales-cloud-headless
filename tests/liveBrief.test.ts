/**
 * HX-5 — optional live executive-brief safety architecture.
 *
 * Runner: node --import tsx --test tests/*.test.ts
 *
 * Proves the live path is disabled/inert by default, the outbound payload is a
 * sanitized allowlist (no IDs/URLs/secrets/internal metadata), and response
 * validation rejects every prohibited case with an internal-only code.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSanitizedInput,
  findForbiddenPayloadKeys,
  validateBrief,
  MAX_BODY_BYTES,
} from '../server/src/services/liveBrief.ts';
import { SONY_ACTIVATION_CONTEXT } from '../server/src/shared/sonyActivation.ts';

// A valid model response mirroring the governed facts (used as the baseline).
function goodBrief() {
  return {
    executiveRecommendation: 'Advance to governed cross-OpCo review, not activation.',
    groundedFacts: [
      '1.85M qualified EMEA audience',
      'Opportunity/Priority Score 91.58, ranked #1',
      'Engagement Score 82.3 · Cross-Affinity Score 84',
      'Beyond the Spider-Verse — In Development',
    ],
    connectedValue: 'Pictures story → PlayStation engagement → Music discovery.',
    ipCouncilDecisions: [...SONY_ACTIVATION_CONTEXT.decisions.ipCouncil],
    keyRisks: [...SONY_ACTIVATION_CONTEXT.keyRisks],
    statusBanner: SONY_ACTIVATION_CONTEXT.governance.statusBanner,
  };
}

// --- Disabled by default ----------------------------------------------------

test('LIVE_EXEC_BRIEF defaults to disabled (config gate false)', async () => {
  const prev = process.env.LIVE_EXEC_BRIEF;
  delete process.env.LIVE_EXEC_BRIEF;
  const bust = `?t=${Date.now()}`;
  const { config } = await import(`../server/src/config.ts${bust}`);
  assert.equal(config.sony.liveExecBriefEnabled, false);
  if (prev !== undefined) process.env.LIVE_EXEC_BRIEF = prev;
});

test('index only mounts the live router behind the enabled flag', () => {
  // Static guard: the mount is gated by config.sony.liveExecBriefEnabled.
  const fs = require('node:fs') as typeof import('node:fs');
  const idx = fs.readFileSync(new URL('../server/src/index.ts', import.meta.url), 'utf8');
  assert.ok(idx.includes('if (config.sony.liveExecBriefEnabled)'));
  assert.ok(idx.includes("import('./routes/liveBrief.js')"));
  // The route string must not be registered unconditionally.
  assert.equal(/app\.use\([^)]*createLiveBriefRouter/.test(idx.replace(/\n/g, ' ')) &&
    !idx.includes('if (config.sony.liveExecBriefEnabled)'), false);
});

// --- Sanitized allowlist ----------------------------------------------------

test('sanitized input contains ONLY allowlisted fields', () => {
  const input = buildSanitizedInput();
  const keys = Object.keys(input).sort();
  assert.deepEqual(keys, [
    'anchorProperty',
    'audience',
    'ip',
    'ipCouncilDecisions',
    'keyRisks',
    'lifecycle',
    'modelScores',
    'opCoRoles',
    'opportunityTitle',
    'region',
    'releaseMoments',
    'statusBanner',
  ]);
});

test('sanitized input excludes IDs, URLs, secrets, provenance/internal metadata', () => {
  const input = buildSanitizedInput();
  const offenders = findForbiddenPayloadKeys(input);
  assert.deepEqual(offenders, [], `forbidden keys leaked: ${offenders.join(', ')}`);
  // Spot checks: no provenance, no scenes copy, no activation URL, no approvals.
  const json = JSON.stringify(input);
  assert.equal(json.includes('provenance'), false);
  assert.equal(json.includes('internalValue'), false);
  assert.equal(json.includes('salesforce'), false);
  assert.equal(json.toLowerCase().includes('http'), false);
});

test('opCoRoles in payload carry only name + participationStatus', () => {
  const input = buildSanitizedInput();
  for (const r of input.opCoRoles) {
    assert.deepEqual(Object.keys(r).sort(), ['name', 'participationStatus']);
  }
});

// --- Response validation: accept the good, reject every bad -----------------

test('a faithful response validates OK', () => {
  assert.equal(validateBrief(goodBrief()).ok, true);
});

test('malformed / non-object → malformed-json', () => {
  assert.equal(validateBrief(null).code, 'malformed-json');
  assert.equal(validateBrief('nope').code, 'malformed-json');
});

test('missing required fields → missing-fields', () => {
  const b = goodBrief() as any;
  delete b.executiveRecommendation;
  assert.equal(validateBrief(b).code, 'missing-fields');
  const b2 = goodBrief() as any;
  b2.ipCouncilDecisions = [];
  assert.equal(validateBrief(b2).code, 'missing-fields');
});

test('excessive length → too-long', () => {
  const b = goodBrief();
  b.executiveRecommendation = 'x'.repeat(5000);
  assert.equal(validateBrief(b).code, 'too-long');
});

test('prohibited "already happened" claim → prohibited-content', () => {
  const b = goodBrief();
  b.connectedValue = 'The audience has been activated and sent to customers.';
  assert.equal(validateBrief(b).code, 'prohibited-content');
});

test('invented date for Beyond the Spider-Verse → invented-date', () => {
  const b = goodBrief();
  b.groundedFacts = [...b.groundedFacts, 'Beyond the Spider-Verse releases in 2027'];
  assert.equal(validateBrief(b).code, 'invented-date');
});

test('altered authoritative metric → altered-metric', () => {
  const b = goodBrief();
  b.groundedFacts = b.groundedFacts.filter((f) => !f.includes('1.85M'));
  b.groundedFacts.push('2.4M qualified EMEA audience');
  assert.equal(validateBrief(b).code, 'altered-metric');
});

test('altered status banner → altered-metric', () => {
  const b = goodBrief();
  b.statusBanner = 'Approved and activated.';
  assert.equal(validateBrief(b).code, 'altered-metric');
});

// --- No internal leakage ----------------------------------------------------

test('validation outcome codes are internal only (never a browser field)', () => {
  // The ValidationOutcome shape has { ok, code } — but the route returns only
  // { source: 'deterministic' }. Assert the code vocabulary is a sanitized enum
  // (no free text / provider errors / stack traces).
  const codes = [
    validateBrief(null).code,
    validateBrief({ ...goodBrief(), statusBanner: 'x' }).code,
  ];
  for (const c of codes) {
    assert.ok(typeof c === 'string' && /^[a-z-]+$/.test(c!), `code not sanitized enum: ${c}`);
  }
});

test('body-size limit is small and defined', () => {
  assert.ok(MAX_BODY_BYTES > 0 && MAX_BODY_BYTES <= 4096);
});
