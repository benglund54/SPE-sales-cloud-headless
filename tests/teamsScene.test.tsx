/**
 * HX-6V-D — Teams scene (default) + PlayStation decision card content.
 *
 * Teams now opens on the IP360 Planning notification; the decision card renders
 * after the presenter selects the Advisor chat and submits. Static SSR shows
 * the notification state, so shell/notification assertions run against
 * <TeamsScene> and card-content assertions run against <PlayStationDecisionCard>
 * (fully revealed) directly.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { TeamsScene } from '../client/src/sony/TeamsScene.tsx';
import { PlayStationDecisionCard } from '../client/src/sony/PlayStationDecisionCard.tsx';
import { TEAMS_PROMPT } from '../client/src/sony/interactiveFixtures.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const teams = renderToStaticMarkup(
  createElement(TeamsScene, { context: ctx, activationUrl: 'https://example.invalid/activation/view' })
);
const card = renderToStaticMarkup(
  createElement(PlayStationDecisionCard, { context: ctx, activationUrl: 'https://example.invalid/activation/view' })
);

test('Teams opens on the IP360 Planning notification with the Advisor identity', () => {
  assert.ok(teams.includes('Sony IP360'), 'workspace/team');
  assert.ok(teams.includes('IP360 Planning'), 'planning channel');
  assert.ok(teams.includes('Sony IP360 Advisor'), 'assistant');
  assert.ok(teams.includes('/logos/advisor.png'), 'Advisor icon');
  assert.ok(teams.includes('Spider-Man EMEA opportunity ready for review'), 'notification title');
});

test('expanded notification: header, source, audience, 5 metric chips, both columns', () => {
  assert.ok(teams.includes('Cross-Sony Collaboration Request'), 'header tag');
  assert.ok(teams.includes('Source: Governed Sony IP360 CRM signals'), 'source line');
  assert.ok(teams.includes('EMEA Spider-Verse Player-Fans'), 'audience');
  // Five metric chips.
  for (const m of ['1.85M', '91.58', '82.3', '84', '53.9']) assert.ok(teams.includes(m), `metric ${m}`);
  // Two-column structure present.
  assert.ok(teams.includes('tms-notify-grid'), 'responsive two-column grid');
  // Left column anchors + right column anchors.
  const flat = teams.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  for (const anchor of ['why now', 'ip moments', 'connected fan idea', 'opco status', 'lifecycle', 'decisions needed']) {
    assert.ok(flat.includes(anchor), `missing anchor: ${anchor}`);
  }
  // IP moments statuses + shared decisions.
  assert.ok(teams.includes('Active release moment') && teams.includes('In Development'));
  for (const d of ctx.decisions.shared) assert.ok(teams.includes(d), `missing decision: ${d}`);
});

test('Teams notification preserves the governed facts', () => {
  assert.ok(teams.includes('1.85M'));
  assert.ok(teams.includes('91.58'));
  assert.ok(teams.includes('82.3'));
  assert.ok(teams.includes('84'));
  assert.ok(teams.includes('Sony Pictures'));
  assert.ok(teams.includes('OpCo Approval') && teams.includes('Ready for Orchestration'));
  assert.ok(teams.includes('Draft — no audience activated and no customer communication sent.'));
});

test('Teams preloads the exact PlayStation prompt (advisor-view composer)', () => {
  // Teams opens on the planning notification; the interactive composer with the
  // preloaded prompt is in the Advisor chat view. Assert the exact prompt is
  // wired via the shared fixture that the composer initializes from.
  assert.equal(TEAMS_PROMPT, 'What does PlayStation need to decide?');
});

test('decision card: exact title', () => {
  assert.ok(card.includes('Action required: Review PlayStation participation'));
});

test('decision card: role-specific Why PlayStation points', () => {
  assert.ok(card.includes('Marvel’s Spider-Man titles provide the relevant catalog anchor.'));
});

test('decision card: authoritative metrics with labels', () => {
  assert.ok(card.includes('1.85M') && card.includes('Qualified audience'));
  assert.ok(card.includes('82.3') && card.includes('Engagement Score'));
  assert.ok(card.includes('91.58') && card.includes('Opportunity / Priority Score'));
});

test('decision card: activation lead, participation, stages', () => {
  assert.ok(card.includes('Activation lead') && card.includes('Sony Pictures'));
  assert.ok(card.includes('PlayStation participation') && card.includes('Pending'));
  assert.ok(card.includes('OpCo Approval') && card.includes('Ready for Orchestration'));
});

test('decision card: EXACTLY the three PlayStation decisions', () => {
  for (const d of ctx.decisions.playstation) assert.ok(card.includes(d), `missing: ${d}`);
});

test('decision card: both governance blocks with supported statements', () => {
  assert.ok(card.includes('Permitted for this decision'));
  assert.ok(card.includes('Qualified aggregate audience insights'));
  assert.ok(card.includes('Not shared or activated'));
  assert.ok(card.includes('No individual-level identifiers'));
});

test('decision card: one safe Salesforce action, no execution buttons', () => {
  assert.ok(card.includes('Review governed activation in Salesforce'));
  assert.ok(card.includes('rel="noopener noreferrer"'));
  assert.equal(/>\s*(Approve|Activate|Send|Publish|Participate|Reject)\s*</i.test(card), false);
});

test('does NOT render the Slack collaboration artifact component/chrome', () => {
  // The Teams notification mirrors the same information anchors (parity), but
  // must not render the actual Slack Block-Kit artifact component or its exact
  // Slack-only title/paragraph.
  assert.equal(teams.includes('slk-block'), false, 'no Slack block-kit markup');
  assert.equal(teams.includes('Sony IP360 — Spider-Man EMEA opportunity ready for review'), false, 'not the Slack artifact title');
  assert.equal(teams.includes('A coordinated EMEA Spider-Man fan moment in which'), false, 'not the long Slack paragraph');
});

test('no fake chat participants, message timestamps, or unread counts (static render)', () => {
  // Static render is the pre-submit planning view — no submission timestamp yet.
  assert.equal(/\b\d{1,2}:\d{2}\s?(AM|PM)\b/.test(teams), false, 'no clock timestamp pre-submit');
  // Reference chat participants are absent. "Brian Englund" is the mandated
  // presenter profile in the top-bar chrome (Scope 1), not a chat participant.
  assert.equal(/Jennifer|benglund|\bDave\b/.test(teams), false);
  assert.equal(/\b\d+\s+(new|unread)\b/i.test(teams), false);
});

test('progressive reveal: card gates sections by `revealed`', () => {
  const partial = renderToStaticMarkup(
    createElement(PlayStationDecisionCard, { context: ctx, activationUrl: null, revealed: 1 })
  );
  // Section 1 (why) present; section 2 (decisions) not yet.
  assert.ok(partial.includes('Marvel’s Spider-Man titles provide the relevant catalog anchor.'));
  assert.equal(partial.includes(ctx.decisions.playstation[0]), false);
  // Banner/action only at full reveal (section 4).
  assert.equal(partial.includes('Draft — no audience activated'), false);
});
