/**
 * HX-3 — Teams PlayStation decision scene, contract-driven render tests.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 * Rendering: react-dom/server renderToStaticMarkup (no DOM, no jsdom).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { TeamsScene } from '../client/src/sony/TeamsScene.tsx';
import { SlackScene } from '../client/src/sony/SlackScene.tsx';
import { SONY_ACTIVATION_CONTEXT } from '../shared/src/sonyActivation.ts';

const html = renderToStaticMarkup(
  createElement(TeamsScene, {
    context: SONY_ACTIVATION_CONTEXT,
    activationUrl: 'https://example.invalid/activation/view',
  })
);

test('renders required Teams labels', () => {
  assert.ok(html.includes('Sony IP360'), 'workspace/team');
  assert.ok(html.includes('PlayStation Participation'), 'conversation');
  assert.ok(html.includes('Copilot'), 'assistant');
  assert.ok(html.includes('Grounded in Sony IP360'), 'context label');
  assert.ok(html.includes('PlayStation Participation Decision'), 'artifact');
});

test('renders the concise exchange (user prompt + Copilot lead-in)', () => {
  assert.ok(html.includes('What does PlayStation need to decide?'));
  assert.ok(
    html.includes(
      'Sony Pictures is requesting PlayStation participation in the Spider-Man EMEA connected fan opportunity. Here’s the decision brief for PlayStation.'
    )
  );
});

test('decision card title is exact', () => {
  assert.ok(html.includes('Action required: Review PlayStation participation'));
});

test('renders the role-specific Why PlayStation points', () => {
  assert.ok(html.includes('Marvel’s Spider-Man titles provide the relevant catalog anchor.'));
  assert.ok(html.includes('The qualified EMEA cohort shows sustained Spider-Man game engagement.'));
  assert.ok(
    html.includes(
      'The same cohort also shows Spider-Verse film/streaming and soundtrack-listening affinity.'
    )
  );
});

test('renders required metrics with authoritative labels', () => {
  assert.ok(html.includes('1.85M'));
  assert.ok(html.includes('Qualified audience'));
  assert.ok(html.includes('Engagement Score') && html.includes('82.3'));
  assert.ok(html.includes('Opportunity / Priority Score') && html.includes('91.58'));
});

test('renders activation lead, participation, and stages', () => {
  assert.ok(html.includes('Activation lead') && html.includes('Sony Pictures'));
  assert.ok(html.includes('PlayStation participation') && html.includes('Pending'));
  assert.ok(html.includes('OpCo Approval'));
  assert.ok(html.includes('Ready for Orchestration'));
});

test('renders EXACTLY the three PlayStation decisions from the contract', () => {
  for (const d of SONY_ACTIVATION_CONTEXT.decisions.playstation) {
    assert.ok(html.includes(d), `missing PlayStation decision: ${d}`);
  }
});

test('the Teams decision section shows ONLY PlayStation decisions, not shared/IP-Council', () => {
  // Shared (Slack) and IP-Council (Claude) decisions must not appear here.
  const shared = SONY_ACTIVATION_CONTEXT.decisions.shared;
  const ipCouncil = SONY_ACTIVATION_CONTEXT.decisions.ipCouncil;
  for (const d of shared) {
    assert.equal(html.includes(d), false, `shared decision leaked into Teams: ${d}`);
  }
  for (const d of ipCouncil) {
    assert.equal(html.includes(d), false, `IP Council decision leaked into Teams: ${d}`);
  }
});

test('renders both governance blocks with supported statements', () => {
  assert.ok(html.includes('Permitted for this decision'));
  assert.ok(html.includes('Qualified aggregate audience insights'));
  assert.ok(html.includes('Approved cross-affinity and engagement signals'));
  assert.ok(html.includes('Planning within PlayStation’s own operating controls'));

  assert.ok(html.includes('Not shared or activated'));
  assert.ok(html.includes('No individual-level identifiers'));
  assert.ok(html.includes('No unrestricted cross-OpCo data access'));
  assert.ok(html.includes('No audience activation or customer communication'));
  assert.ok(html.includes('Rights-controlled execution remains pending review and approval'));
});

test('renders the exact status banner', () => {
  assert.ok(html.includes('Draft — no audience activated and no customer communication sent.'));
});

test('does NOT replay the full Slack collaboration artifact', () => {
  // Slack-only artifact markers must be absent from Teams. (The assistant name
  // "Sony IP360 Advisor" is shared across surfaces per spec and is NOT a replay
  // marker; the Slack artifact title, request title, and the long proposed-fan-
  // experience paragraph are the true replay markers.)
  assert.equal(html.includes('Cross-Sony Collaboration Request'), false);
  assert.equal(
    html.includes('Sony IP360 — Spider-Man EMEA opportunity ready for review'),
    false
  );
  assert.equal(html.includes('A coordinated EMEA Spider-Man fan moment in which'), false);
});

test('provides one functional Salesforce action (safe anchor) and no execution buttons', () => {
  assert.ok(html.includes('Review governed activation in Salesforce'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
  // No working execution controls.
  assert.equal(/>\s*(Approve|Reject|Participate|Send)\s*</i.test(html), false);
});

test('no synthetic/illustrative/demo/mock/fallback wording', () => {
  for (const forbidden of ['synthetic', 'illustrative', 'demo data', 'mock', 'crm fallback']) {
    assert.equal(html.toLowerCase().includes(forbidden), false, `forbidden: ${forbidden}`);
  }
});

test('no fake participants, timestamps, notifications, or unread counts', () => {
  assert.equal(/\b\d{1,2}:\d{2}\s?(am|pm)\b/i.test(html), false, 'timestamp');
  assert.equal(/\b\d+\s+(new|unread)\b/i.test(html), false, 'unread count');
  assert.equal(/notification/i.test(html), false, 'notification');
});

test('makes no completed-action claims and no native-integration claim', () => {
  const lower = html.toLowerCase();
  for (const claim of [
    'has been approved',
    'was approved',
    'has been activated',
    'sent to customers',
    'message posted',
    'native microsoft',
    'production integration',
  ]) {
    assert.equal(lower.includes(claim), false, `false claim present: ${claim}`);
  }
});

test('soundtrack contributing-signal wording correction is in effect', () => {
  const sig = SONY_ACTIVATION_CONTEXT.evidenceSignals.find((s) =>
    s.label.toLowerCase().includes('soundtrack')
  );
  assert.equal(sig?.detail, 'Soundtrack-listening affinity is present within the qualified cohort.');
  // The old whitespace-borrowing wording must be gone everywhere.
  assert.equal(
    /meaningful whitespace in spider-man soundtrack/i.test(sig?.detail ?? ''),
    false
  );
});

test('Teams contributing-signal references carry no per-channel numeric score', () => {
  // The Why-PlayStation line references signals qualitatively; ensure no number
  // is glued to a channel phrase.
  const flat = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  const idx = flat.indexOf('film/streaming and soundtrack-listening affinity');
  if (idx !== -1) {
    const around = flat.slice(idx, idx + 70);
    assert.equal(/\b\d{2,3}(\.\d)?\b/.test(around), false, `channel phrase near a number: "${around}"`);
  }
});

test('Slack and Teams consume the SAME authoritative context object', () => {
  // Render both from the identical frozen import; both must reflect its values.
  const slackHtml = renderToStaticMarkup(
    createElement(SlackScene, { context: SONY_ACTIVATION_CONTEXT, activationUrl: null })
  );
  assert.ok(slackHtml.includes(SONY_ACTIVATION_CONTEXT.audience.size));
  assert.ok(html.includes(SONY_ACTIVATION_CONTEXT.audience.size));
  assert.ok(slackHtml.includes(String(SONY_ACTIVATION_CONTEXT.audience.opportunityScore)));
  assert.ok(html.includes(String(SONY_ACTIVATION_CONTEXT.audience.opportunityScore)));
});
