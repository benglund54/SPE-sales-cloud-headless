/**
 * HX-7H-C — Teams collaboration request driven by the shared view model.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { TeamsScene } from '../client/src/sony/TeamsScene.tsx';
import { SlackScene } from '../client/src/sony/SlackScene.tsx';
import { buildCollaborationRequest } from '../client/src/sony/collaborationView.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const teams = (url: string | null = 'https://x.example/a') =>
  renderToStaticMarkup(createElement(TeamsScene, { context: ctx, activationUrl: url }));
const html = teams();
const vm = buildCollaborationRequest(ctx);

// ---- Shared view model derives from the canonical context -----------------
test('view model derives the approved intelligence from the canonical context', () => {
  assert.equal(vm.headline.tag, 'Cross-Sony Collaboration Request');
  assert.equal(vm.metrics.length, 4, 'exactly four metrics');
  assert.equal(vm.metrics.map((m) => m.label).join(','), 'audience,priority,engagement,cross-affinity');
  assert.equal(vm.metrics[0].value, ctx.audience.size);
  assert.equal(vm.ipMoments.length, 2);
  assert.deepEqual(vm.ipMoments.map((m) => m.propertyKey), ['PROP-BND', 'PROP-BTSV']);
  assert.deepEqual(vm.ipMoments.map((m) => m.status), ['CURRENT', 'FUTURE']);
  assert.equal(vm.opCoStatuses[0].state, 'Lead');
  assert.ok(vm.opCoStatuses.slice(1).every((o) => o.state === 'Pending'));
  assert.equal(vm.decisions.length, 3);
  assert.equal(vm.governanceBanner, ctx.governance.statusBanner);
  assert.equal(vm.actionLabel, 'Review activation in Salesforce');
});

test('view model is presentation-neutral (no Slack markdown / Teams tokens / SF url)', () => {
  const src = read('client/src/sony/collaborationView.ts');
  // No scene-specific styling class tokens, no SF url/record id, no image fields.
  assert.equal(/\btms-[a-z]|\bslk-[a-z]|imageUrl|assetKey|lightning\.force\.com|a03bm00001/.test(src), false,
    'no styling tokens or SF url/id in the shared view model');
  // No Slack-style markdown emphasis in the copy (JSDoc /** opener excluded).
  assert.equal(/\*\*\w/.test(src), false, 'no markdown bold in the view model');
});

// ---- Exactly four metrics; whitespace absent ------------------------------
test('exactly four approved metrics render; whitespace score is absent', () => {
  for (const m of ['1.85M', '91.58', '82.3', '84']) assert.ok(html.includes(m), `metric ${m}`);
  assert.equal((html.match(/class="tms-chip"/g) ?? []).length, 4, 'four metric chips');
  assert.equal(html.includes('53.9'), false, 'no whitespace value');
  assert.equal(/whitespace/i.test(html), false, 'no whitespace label');
});

// ---- IP moments: images + statuses + descriptions -------------------------
test('both approved IP moments and images render with matching descriptions', () => {
  assert.ok(html.includes('/assets/properties/PROP-BND.webp'), 'BND image');
  assert.ok(html.includes('/assets/properties/PROP-BTSV.webp'), 'BTSV image');
  assert.ok(html.includes('CURRENT') && html.includes('FUTURE'), 'status treatments');
  assert.ok(html.includes('Sony Pictures’ active release anchor for the EMEA opportunity.'));
  assert.ok(html.includes('Momentum provides the near-term trigger for PlayStation and Music participation.'));
  assert.ok(html.includes('Future Pictures moment extending the Spider-Man engagement window.'));
  assert.ok(html.includes('Provides a follow-on opportunity to sustain the connected fan experience.'));
  // No broken-image behavior: posters resolve (no fallback initials for these keys).
  assert.equal(/tms-ipmoment-fallback/.test(html), false, 'both posters resolve');
  // Artwork not duplicated elsewhere in the Teams card.
  assert.equal((html.match(/PROP-BND\.webp/g) ?? []).length, 1, 'BND art once');
  assert.equal((html.match(/PROP-BTSV\.webp/g) ?? []).length, 1, 'BTSV art once');
});

// ---- Operating content matches the shared intelligence --------------------
test('Why Now / OpCo / Connected Fan Idea / Decisions match the shared intelligence', () => {
  assert.ok(html.includes('Brand New Day momentum, PlayStation engagement, and Music affinity create a near-term EMEA window.'));
  assert.ok(html.includes('Sony Pictures') && html.includes('PlayStation') && html.includes('Sony Music'));
  assert.ok(/Lead/.test(html) && /Pending/.test(html), 'OpCo states');
  assert.ok(html.includes('Extend the Pictures-led moment through eligible PlayStation rewards and Sony Music soundtrack or artist experiences.'));
  for (const d of ['Confirm EMEA window', 'Confirm OpCo participation', 'Proceed after rights review']) {
    assert.ok(html.includes(d), `decision: ${d}`);
  }
});

test('lifecycle + governance banner remain visible', () => {
  assert.ok(html.includes('OpCo approval → orchestration'), 'compact lifecycle');
  assert.ok(html.includes('Rights review pending'));
  assert.ok(html.includes('Draft — no audience activated and no customer communication sent.'), 'exact banner');
});

// ---- CTA uses the governed injected destination ---------------------------
test('CTA reads "Review activation in Salesforce" and uses the injected activation URL', () => {
  assert.ok(html.includes('Review activation in Salesforce'), 'CTA label');
  // With a valid URL the governed ActivationLink emits a real anchor to it.
  assert.ok(/href="https:\/\/x\.example\/a"[^>]*rel="noopener noreferrer"/.test(html), 'anchor to the injected URL');
  // With no URL, the same label renders as an inert (non-anchor) control.
  const inert = teams(null);
  assert.ok(inert.includes('Review activation in Salesforce'));
  assert.ok(/aria-disabled="true"/.test(inert), 'inert when URL missing');
  // The scene never hard-codes a Salesforce URL/record id.
  const src = read('client/src/sony/TeamsScene.tsx');
  assert.equal(/a03bm00001|lightning\.force\.com|Activation__c/.test(src), false, 'no hard-coded SF url/id');
  // Secondary in-card Advisor affordance still advances the view.
  assert.ok(/tms-notify-advisor[\s\S]*setView\('advisor'\)/.test(src) || /setView\('advisor'\)[\s\S]*Open Sony IP360 Advisor/.test(src),
    'secondary Advisor affordance advances to the conversation');
});

// ---- Slack scene unchanged ------------------------------------------------
test('the Slack scene is not modified by this phase', () => {
  const slack = renderToStaticMarkup(createElement(SlackScene, { context: ctx, activationUrl: 'https://x.example/a' }));
  // Slack still renders its own collaboration content (unchanged component).
  assert.ok(slack.includes('Spider-Man EMEA opportunity ready for review') || slack.includes('Cross-Sony'));
  // The Teams view-model helper is not imported into the Slack scene.
  const slackSrc = read('client/src/sony/SlackScene.tsx');
  assert.equal(/collaborationView|buildCollaborationRequest/.test(slackSrc), false, 'Slack does not use the Teams view model');
});
