/**
 * HX-2 — Slack scene contract-driven rendering tests.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 * Rendering: react-dom/server renderToStaticMarkup (no DOM, no jsdom).
 *
 * These assert the Slack scene renders the required content entirely from the
 * HX-1 Activation context, and that forbidden disclaimer language, invented
 * names/timestamps, and execution claims are absent.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { SlackScene } from '../client/src/sony/SlackScene.tsx';
import { SONY_ACTIVATION_CONTEXT } from '../shared/src/sonyActivation.ts';

function render(activationUrl: string | null): string {
  return renderToStaticMarkup(
    createElement(SlackScene, { context: SONY_ACTIVATION_CONTEXT, activationUrl })
  );
}

const html = render('https://example.invalid/activation/view');

test('renders the required primary message title', () => {
  assert.ok(html.includes('Sony IP360 — Spider-Man EMEA opportunity ready for review'));
});

test('renders workspace, channel, agent, artifact labels and wordmark', () => {
  assert.ok(html.includes('Sony IP360'), 'workspace');
  assert.ok(html.includes('sony-ip360-fy27'), 'channel');
  assert.ok(html.includes('Sony IP360 Advisor'), 'agent');
  assert.ok(html.includes('Cross-Sony Collaboration Request'), 'artifact');
  assert.ok(html.includes('SONY IP360'), 'wordmark');
});

test('renders qualified audience size and name', () => {
  assert.ok(html.includes('1.85M'));
  assert.ok(html.includes('EMEA Spider-Verse Player-Fans'));
});

test('renders the priority score 91.58', () => {
  assert.ok(html.includes('91.58'));
});

test('renders the three contributing signals qualitatively (no channel scores)', () => {
  assert.ok(/play activity|playstation/i.test(html));
  assert.ok(/film.*streaming|streaming/i.test(html));
  assert.ok(/soundtrack/i.test(html));
});

test('renders the three model scores with their AUTHORITATIVE meanings', () => {
  assert.ok(html.includes('Engagement Score'));
  assert.ok(html.includes('Cross-Affinity Score'));
  assert.ok(html.includes('Whitespace Score'));
  assert.ok(html.includes('82.3') && html.includes('84') && html.includes('53.9'));
});

// --- HX-2a regression: no unsupported channel-level score mapping ----------

/**
 * Extract short windows of text around each model-score number and around
 * each contributing-signal label so we can assert the two are never adjacent.
 */
function textWindowsAround(source: string, needle: string, radius = 60): string[] {
  const flat = source.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const windows: string[] = [];
  let i = flat.indexOf(needle);
  while (i !== -1) {
    windows.push(flat.slice(Math.max(0, i - radius), i + needle.length + radius).toLowerCase());
    i = flat.indexOf(needle, i + 1);
  }
  return windows;
}

test('Engagement Score (82.3) is never labeled as game / play activity', () => {
  for (const w of textWindowsAround(html, '82.3')) {
    assert.equal(/game|play activity/.test(w), false, `82.3 near channel: "${w}"`);
  }
});

test('Cross-Affinity Score (84) is never labeled as film/streaming affinity', () => {
  // Check the model value in its labeled context, not the bare "84".
  const flat = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  // The film/streaming signal line must not contain a numeric score.
  const filmIdx = flat.indexOf('film and streaming');
  if (filmIdx !== -1) {
    const around = flat.slice(filmIdx, filmIdx + 120);
    assert.equal(/\b\d{2,3}(\.\d)?\b/.test(around), false, `film/streaming line has a number: "${around}"`);
  }
});

test('Whitespace Score (53.9) is never labeled as soundtrack affinity', () => {
  const flat = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  const sdIdx = flat.indexOf('soundtrack-listening affinity');
  if (sdIdx !== -1) {
    const around = flat.slice(sdIdx, sdIdx + 120);
    assert.equal(around.includes('53.9'), false, `soundtrack line shows 53.9: "${around}"`);
  }
  for (const w of textWindowsAround(html, '53.9')) {
    assert.equal(/soundtrack/.test(w), false, `53.9 near soundtrack: "${w}"`);
  }
});

test('no contributing-signal label sits adjacent to a numeric score', () => {
  const flat = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  for (const label of ['play activity', 'film and streaming affinity', 'soundtrack-listening affinity']) {
    const idx = flat.indexOf(label);
    if (idx === -1) continue;
    const around = flat.slice(idx, idx + label.length + 20);
    assert.equal(/\b\d{2,3}(\.\d)?\b/.test(around), false, `channel "${label}" adjacent to a number`);
  }
});

test('renders OpCo roles: Pictures lead; PlayStation + Sony Music pending', () => {
  assert.ok(html.includes('Sony Pictures'));
  assert.ok(html.includes('Accountable lead'));
  assert.ok(html.includes('PlayStation'));
  assert.ok(html.includes('Sony Music'));
  // Pending appears for both proposed participants.
  const pendingCount = (html.match(/Pending/g) || []).length;
  assert.ok(pendingCount >= 2, `expected >=2 "Pending", saw ${pendingCount}`);
});

test('renders lifecycle current + next state', () => {
  assert.ok(html.includes('OpCo Approval'));
  assert.ok(html.includes('Ready for Orchestration'));
});

test('renders rights review as required and pending', () => {
  assert.ok(html.includes('Required — pending review'));
});

test('renders the three shared decisions', () => {
  for (const d of SONY_ACTIVATION_CONTEXT.decisions.shared) {
    assert.ok(html.includes(d), `missing decision: ${d}`);
  }
});

test('renders the exact status banner', () => {
  assert.ok(html.includes('Draft — no audience activated and no customer communication sent.'));
});

test('describes Brand New Day as an active release moment', () => {
  assert.ok(html.includes('Spider-Man: Brand New Day'));
  assert.ok(html.includes('Active release moment'));
});

test('references Beyond the Spider-Verse only as In Development, with no invented date', () => {
  assert.ok(html.includes('Beyond the Spider-Verse'));
  assert.ok(html.includes('In Development'));
  // No 4-digit year anywhere near a release moment / no "upcoming".
  assert.equal(/beyond the spider-verse[^<]*\b(19|20)\d{2}\b/i.test(html), false);
});

test('shows polished provenance and NOT forbidden disclaimer language', () => {
  assert.ok(html.includes('Source: Governed CRM signals'));
  for (const forbidden of ['CRM Fallback', 'synthetic', 'illustrative', 'mock', 'demo data']) {
    assert.equal(
      html.toLowerCase().includes(forbidden.toLowerCase()),
      false,
      `forbidden language present: ${forbidden}`
    );
  }
});

test('contains no invented human names, timestamps, unread counts, or reactions', () => {
  // No clock-style timestamps.
  assert.equal(/\b\d{1,2}:\d{2}\s?(am|pm)\b/i.test(html), false, 'timestamp-like string found');
  // No "X new messages" / unread counts.
  assert.equal(/\b\d+\s+(new|unread)\b/i.test(html), false, 'unread-count-like string found');
  // No reaction emoji-count patterns.
  assert.equal(/reaction|👍|❤️/i.test(html), false, 'reaction found');
});

test('makes no execution / already-happened claims', () => {
  const lower = html.toLowerCase();
  // These phrases would falsely assert an action already occurred.
  const badClaims = [
    'has been activated',
    'was activated',
    'has been approved',
    'was approved',
    'sent to customers',
    'message posted',
    'has been published',
    'was published',
  ];
  for (const claim of badClaims) {
    assert.equal(lower.includes(claim), false, `false execution claim present: ${claim}`);
  }
});

test('renders one functional activation action label', () => {
  assert.ok(html.includes('Review governed activation in Salesforce'));
});
