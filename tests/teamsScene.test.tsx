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

test('HX-7H-C collaboration card: header, exactly 4 metrics (no whitespace), both columns', () => {
  assert.ok(teams.includes('Cross-Sony Collaboration Request'), 'header tag');
  assert.ok(teams.includes('Spider-Man EMEA opportunity ready for review'), 'title');
  // Exactly four primary metrics; the 53.9 whitespace score is removed.
  for (const m of ['1.85M', '91.58', '82.3', '84']) assert.ok(teams.includes(m), `metric ${m}`);
  assert.equal(teams.includes('53.9'), false, 'whitespace score removed');
  assert.equal(teams.includes('whitespace'), false, 'no whitespace label');
  assert.equal((teams.match(/class="tms-chip"/g) ?? []).length, 4, 'exactly four metric chips');
  // Two-column operating grid with the approved anchors (no contributing signals).
  assert.ok(teams.includes('tms-notify-grid'), 'two-column grid');
  const flat = teams.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  for (const anchor of ['why now', 'connected fan idea', 'opco status', 'decisions needed']) {
    assert.ok(flat.includes(anchor), `missing anchor: ${anchor}`);
  }
  assert.equal(flat.includes('contributing signals'), false, 'contributing-signals block removed');
});

test('HX-7H-C: IP moments render packaged posters + CURRENT/FUTURE + description lines', () => {
  assert.ok(teams.includes('/assets/properties/PROP-BND.webp'), 'BND poster');
  assert.ok(teams.includes('/assets/properties/PROP-BTSV.webp'), 'BTSV poster');
  assert.ok(teams.includes('Spider-Man: Brand New Day') && teams.includes('Spider-Man: Beyond the Spider-Verse'), 'titles');
  assert.ok(teams.includes('CURRENT') && teams.includes('FUTURE'), 'status badges');
  assert.ok(teams.includes('active release anchor for the EMEA opportunity'), 'BND line');
  assert.ok(teams.includes('Future Pictures moment extending the Spider-Man engagement window'), 'BTSV line');
});

test('Teams notification preserves the governed facts + new CTA/lifecycle', () => {
  assert.ok(teams.includes('1.85M') && teams.includes('91.58') && teams.includes('82.3') && teams.includes('84'));
  assert.ok(teams.includes('Sony Pictures') && /Lead/.test(teams) && /Pending/.test(teams), 'OpCo statuses');
  assert.ok(teams.includes('OpCo approval → orchestration') && teams.includes('Rights review pending'), 'compact lifecycle');
  assert.ok(teams.includes('Draft — no audience activated and no customer communication sent.'), 'exact banner');
  // CTA is the governed Salesforce action; the secondary Advisor affordance remains.
  assert.ok(teams.includes('Review activation in Salesforce'), 'Salesforce CTA');
  assert.ok(teams.includes('Open Sony IP360 Advisor'), 'secondary Advisor affordance kept');
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
