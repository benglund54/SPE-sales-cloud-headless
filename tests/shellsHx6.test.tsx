/**
 * HX-6 — reference-exact shell structure + no reference-only detail leakage.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { SlackScene } from '../client/src/sony/SlackScene.tsx';
import { TeamsScene } from '../client/src/sony/TeamsScene.tsx';
import { ExecutiveBrief } from '../client/src/sony/ExecutiveBrief.tsx';
import { SONY_ACTIVATION_CONTEXT } from '../shared/src/sonyActivation.ts';

const ctx = SONY_ACTIVATION_CONTEXT;
const slack = renderToStaticMarkup(createElement(SlackScene, { context: ctx, activationUrl: 'https://x.example/a' }));
const teams = renderToStaticMarkup(createElement(TeamsScene, { context: ctx, activationUrl: 'https://x.example/a' }));
// Claude scene starts "preparing" in SSR; assert the brief content via the brief directly.
const brief = renderToStaticMarkup(createElement(ExecutiveBrief, { context: ctx, activationUrl: 'https://x.example/a' }));

test('Slack shell: rail + workspace sidebar + light channel + selected channel', () => {
  assert.ok(slack.includes('slk-rail'));
  assert.ok(slack.includes('slk-sidebar'));
  assert.ok(slack.includes('slk-main'));
  assert.ok(slack.includes('slk-channel-active'));
  assert.ok(slack.includes('slk-composer'));
});

test('Teams shell: pale app body + rail + chat sidebar + white conversation + composer', () => {
  assert.ok(teams.includes('tms-rail'));
  assert.ok(teams.includes('tms-sidebar'));
  assert.ok(teams.includes('tms-main'));
  assert.ok(teams.includes('tms-conv-header'));
  assert.ok(teams.includes('tms-composer'));
  // Opens on the IP360 Planning notification (decision card appears after
  // the presenter selects the Advisor and submits — see teamsScene.test.tsx).
  assert.ok(teams.includes('IP360 Planning'));
  assert.ok(teams.includes('Spider-Man EMEA opportunity ready for review'));
});

test('Teams notification preserves metrics + status banner', () => {
  assert.ok(teams.includes('1.85M'));
  assert.ok(teams.includes('82.3'));
  assert.ok(teams.includes('91.58'));
  assert.ok(teams.includes('Draft — no audience activated and no customer communication sent.'));
});

test('Claude brief: warm shell content preserves 5 sections, metrics, banner, conclusion', () => {
  assert.equal((brief.match(/class="sony-brief-section/g) || []).length, 5);
  assert.ok(brief.includes('1.85M') && brief.includes('91.58') && brief.includes('82.3') && brief.includes('84'));
  assert.ok(brief.includes('Draft — no audience activated and no customer communication sent.'));
  assert.ok(brief.includes('Advance to governed cross-OpCo review — not audience activation or customer communication.'));
  for (const r of ctx.keyRisks) assert.ok(brief.includes(r));
});

test('no reference-only personal details or fake activity in any shell', () => {
  const all = (slack + teams + brief);
  // Reference chat participants / handles must never appear as conversation
  // content. NOTE: "Brian Englund" is the spec-mandated presenter PROFILE in
  // the Teams top-bar chrome (Scope 1) — allowed there, forbidden as a chat
  // participant. Assert it is absent from Slack and Claude entirely.
  for (const name of ['Jennifer', 'Dave', 'benglund']) {
    assert.equal(all.includes(name), false, `reference name leaked: ${name}`);
  }
  assert.equal(slack.includes('Brian Englund'), false, 'presenter name must not leak into Slack');
  assert.equal(brief.includes('Brian Englund'), false, 'presenter name must not leak into Claude');
  // Reference test-message text.
  assert.equal(all.includes('Hey this is a test message'), false);
  assert.equal(all.includes('cool here is another one'), false);
  // No fabricated clock timestamps in the STATIC (pre-submit) renders; the
  // Teams submission timestamp only appears after the user sends.
  assert.equal(/\b\d{1,2}:\d{2}\s?(AM|PM)\b/.test(all), false, 'timestamp leaked pre-submit');
  assert.equal(/\b\d+\s+(new|unread|members?)\b/i.test(all), false, 'count leaked');
  assert.equal(/reaction|👍|❤️/i.test(all), false, 'reaction leaked');
});

test('no prohibited disclaimer / provenance language in any shell', () => {
  const all = (slack + teams + brief).toLowerCase();
  for (const bad of [
    'illustrative', 'synthetic', 'demo data', 'mock', 'crm fallback',
    'not salesforce data 360', 'not live financials',
  ]) {
    assert.equal(all.includes(bad), false, `prohibited language: ${bad}`);
  }
  // Approved provenance retained.
  assert.ok(slack.includes('Governed CRM signals'));
});

test('no execution / already-happened claims in any shell', () => {
  const all = (slack + teams + brief).toLowerCase();
  for (const claim of ['has been approved', 'has been activated', 'sent to customers', 'has been published']) {
    assert.equal(all.includes(claim), false, `false claim: ${claim}`);
  }
});
