/**
 * HX-6V-O — final Claude web-UI polish: composer sizing root-cause fix, raised
 * cluster, response reading column, content-driven cards, Risks list, selection
 * states, conversation-composer column alignment.
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

import { ClaudeScene } from '../client/src/sony/ClaudeScene.tsx';
import { ExecutiveBrief } from '../client/src/sony/ExecutiveBrief.tsx';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const home = renderToStaticMarkup(createElement(ClaudeScene, { context: ctx, activationUrl: null }));
const src = read('client/src/sony/ClaudeScene.tsx');
const css = read('client/src/sony/sony.css');
const brief = (revealed?: number) =>
  renderToStaticMarkup(createElement(ExecutiveBrief, { context: ctx, activationUrl: 'https://x.example/a', revealed }));

// ---- Composer sizing root-cause fix --------------------------------------
test('home composer width is pinned (flex:none + min-width:0 + width + max-width)', () => {
  const box = css.match(/\.claw-composer-home \.claw-composer-box\s*{[^}]*}/)?.[0] ?? '';
  // HX-6V-P: non-growing flex config pins the CSS box to ~640–660px (not 844px).
  assert.ok(/flex:\s*0 0 auto/.test(box), 'flex:0 0 auto — not a growable flex item');
  assert.ok(/min-width:\s*0/.test(box), 'min-width:0 — no min-content blowout');
  assert.ok(/width:\s*min\(6[45][0-9]px,\s*calc\(100% - 48px\)\)/.test(box), 'declared width ~640–660px');
  assert.ok(/max-width:\s*6[45][0-9]px/.test(box), 'hard max-width ~640–660px');
  // Not the old 844px CSS declaration (comments mentioning 844 are fine).
  assert.equal(/(?:max-)?width:\s*(?:min\()?844px/.test(box), false, 'not the old 844px CSS width');
  // Two-line region, not three over-reserved rows.
  const rows = Number(src.match(/claw-composer-field-home[\s\S]*?rows={(\d+)}/)?.[1] ?? '0');
  assert.equal(rows, 2, 'two-line home textarea');
  assert.ok(/min-height:\s*1(?:1[6-9]|2[0-4])px/.test(box), 'box min-height ~116–124px');
});

test('starting cluster is raised with explicit greeting/composer/chip gaps', () => {
  const homeCss = css.match(/\.claw-home\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/padding:\s*0 24px \d{2,3}px/.test(homeCss), 'bottom padding raises the centered cluster');
  const greet = css.match(/\.claw-greeting\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/margin:\s*0 0 4[0-8]px/.test(greet), 'greeting→composer gap ~40–48px');
  const comp = css.match(/\.claw-composer-home\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/margin-bottom:\s*3[2-8]px/.test(comp), 'composer→chips gap ~32–38px');
});

// ---- Response reading column ---------------------------------------------
test('response turns + conversation composer share one ~940px reading column', () => {
  const turn = css.match(/\.claw-turn\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/max-width:\s*9[24]0px/.test(turn), 'reading column ~920–960px');
  assert.ok(/min-width:\s*0/.test(turn), 'turn min-width:0 for wrapping');
  const convo = css.match(/\.claw-composer-convo \.claw-composer-box\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/max-width:\s*8[0-9]{2}px/.test(convo), 'convo composer bounded to ~the column width');
  // Scroll padding keeps followed content clear of the pinned composer.
  assert.ok(/scroll-padding-bottom/.test(css), 'scroll padding for the pinned composer');
});

// ---- Content-driven cards + Risks list -----------------------------------
test('brief uses a named-area grid: facts full-width, value|decisions pair, risks full-width', () => {
  // HX-7H-D: grid-template-areas place the cards; facts and risks span both
  // columns; value + decisions share the middle row. Sections stay in show(n)
  // gate order so the 9-step reveal is unchanged.
  const grid = css.match(/\.sony-brief-grid\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/grid-template-areas:\s*'facts facts' 'value decisions' 'risks risks'/.test(grid),
    'facts + risks full-width; value|decisions paired');
  assert.ok(/align-items:\s*start/.test(grid), 'content-driven (no stretch)');
  const scene = readFileSync(resolve(repoRoot, 'client/src/sony/ExecutiveBrief.tsx'), 'utf8');
  for (const area of ['sony-area-facts', 'sony-area-value', 'sony-area-decisions', 'sony-area-risks']) {
    assert.ok(scene.includes(area), `area class present: ${area}`);
  }
  // No fixed card heights.
  const cards = css.match(/\.claw \.sony-brief-facts,[^{]*{[^}]*}/)?.[0] ?? '';
  assert.ok(/height:\s*auto/.test(cards), 'cards content-driven');
});

test('full-width Risks uses a compact 2×2 internal grid; all four statements + three confirmations kept', () => {
  // HX-7H-D: full-width Risks card → four statements in a 2-column internal grid
  // (uses the width to stay short), confirmations wrap beneath.
  const risks = css.match(/(?<!\.claw )\.sony-brief-risks\s*{[^}]*}/)?.[0]
    ?? css.match(/\.sony-brief-risks\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/display:\s*grid/.test(risks) && /grid-template-columns:\s*1fr 1fr/.test(risks), '2×2 internal grid');
  const guards = css.match(/(?<!\.claw )\.sony-brief-guards\s*{[^}]*}/)?.[0]
    ?? css.match(/\.sony-brief-guards\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/flex-wrap:\s*wrap/.test(guards), 'confirmations wrap in a balanced row');
  // All four approved risk statements still render.
  const full = brief(undefined);
  for (const r of ctx.keyRisks) assert.ok(full.includes(r), `risk preserved: ${r}`);
  // The three green governance confirmations remain.
  assert.ok(full.includes('Aggregate signals only — no individual-level identifiers'));
  assert.ok(full.includes('Each operating company retains control'));
  assert.ok(full.includes('An internal Slack collaboration request has been posted for review'));
});

// ---- Selection states -----------------------------------------------------
test('New is selected only on the initial screen; IP Council chat selected in conversation', () => {
  // New gains claw-nav-selected only when NOT in conversation.
  assert.ok(/claw-nav-new\$\{inConversation \? '' : ' claw-nav-selected'\}/.test(src), 'New selected home-only');
  // Home render: New selected, chat row present but not active.
  assert.ok(/claw-nav-item claw-nav-new claw-nav-selected/.test(home), 'New selected on home');
  assert.equal(/claw-chat claw-chat-active/.test(home), false, 'chat not selected on home');
  // Chat row is the first chat item and gains the active class in conversation.
  assert.ok(/claw-chat\$\{inConversation \? ' claw-chat-active' : ''\}/.test(src), 'chat active in conversation');
  const sel = css.match(/\.claw-nav-selected\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:/.test(sel), 'selected row has a soft background');
});

// ---- Typography + sidebar width ------------------------------------------
test('refined serif stack for display text; restrained section labels; wider sidebar', () => {
  assert.ok(/--claw-serif:\s*'Iowan Old Style'/.test(css), 'refined serif stack (no external font)');
  const labels = css.match(/\.claw \.sony-brief-h2\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/font-weight:\s*600/.test(labels), 'section labels not weight-inflated (700)');
  const sidebar = css.match(/\.claw-sidebar\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/width:\s*2[78][0-9]px/.test(sidebar), 'sidebar widened (~280px)');
  // Colors preserved.
  assert.ok(/background:\s*#FBFBF9/i.test(sidebar), 'sidebar still #FBFBF9');
});

// ---- Preservation ---------------------------------------------------------
test('banner + Salesforce action preserved and last; no Free plan / Upgrade', () => {
  const full = brief(undefined);
  assert.ok(full.includes('Draft — no audience activated and no customer communication sent.'), 'exact banner');
  assert.ok(full.includes('Review governed activation in Salesforce'), 'Salesforce action');
  // Five section cards intact.
  assert.equal((full.match(/class="sony-brief-section/g) ?? []).length, 5, 'five section cards');
  // No plan/upgrade language anywhere in the Claude scene.
  assert.equal(/free plan|upgrade/i.test(home) || /free plan|upgrade/i.test(src), false, 'no Free plan / Upgrade');
  // No hard-coded Salesforce URL / record id.
  assert.equal(/a03bm00001|lightning\.force\.com|Activation__c/.test(src), false, 'no hard-coded SF URL/id');
});

// ---- HX-6V-P: home composer scale correction (only) -----------------------
test('HX-6V-P: home composer CSS scaled down ~24–25% (≈650×120), results column untouched', () => {
  const box = css.match(/\.claw-composer-home \.claw-composer-box\s*{[^}]*}/)?.[0] ?? '';
  const w = Number(box.match(/max-width:\s*(\d+)px/)?.[1] ?? '0');
  const h = Number(box.match(/min-height:\s*(\d+)px/)?.[1] ?? '0');
  assert.ok(w >= 640 && w <= 660, `CSS max-width in the 640–660 band (got ${w})`);
  assert.ok(h >= 116 && h <= 124, `CSS min-height in the 116–124 band (got ${h})`);
  // Roughly a 24–25% reduction from the prior 844×148.
  assert.ok(1 - w / 844 >= 0.20 && 1 - w / 844 <= 0.28, 'width reduced ~24%');
  assert.ok(1 - h / 148 >= 0.16 && 1 - h / 148 <= 0.30, 'height reduced ~19–24%');
  // The lower control row cannot enlarge the box past the target.
  assert.ok(/flex:\s*0 0 auto/.test(box) && /min-width:\s*0/.test(box), 'non-growing flex config');
  // The v26 results reading column is UNCHANGED at ~940px.
  const turn = css.match(/\.claw-turn\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/max-width:\s*940px/.test(turn), 'response column still 940px (results layout untouched)');
});

// ---- HX-7H-D: vertical-rhythm polish + concise Decisions copy --------------
test('major brief groups use one compact ~13px gap (grid + banner + action)', () => {
  const grid = css.match(/\.sony-brief-grid\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/gap:\s*13px/.test(grid), 'grid gap ~13px');
  // Grid items carry no per-section margin (grid gap owns the rhythm).
  const sec = css.match(/\.claw \.sony-brief-section\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/margin-bottom:\s*0/.test(sec), 'no per-section margin on grid items');
  const banner = css.match(/\.claw \.sony-brief-banner\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/margin-top:\s*13px/.test(banner), 'banner sits ~13px below Risks');
  const actions = css.match(/\.claw \.sony-brief-actions\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/margin-top:\s*13px/.test(actions), 'Salesforce action ~13px below the banner');
});

test('Decisions copy is the concise HX-7H-D wording; stages + rights preserved', () => {
  const full = brief(undefined);
  assert.ok(full.includes('Awaiting Sony IP Council approval: not accepted or executed.'), 'concise intro');
  assert.ok(full.includes('Approve EMEA as the first IP360 planning candidate.'));
  assert.ok(full.includes('Confirm PlayStation and Sony Music participation and owners.'));
  assert.ok(full.includes('Authorize experience and measurement planning after rights review.'));
  // Governance preserved.
  assert.ok(full.includes('OpCo Approval') && full.includes('Ready for Orchestration'));
  assert.ok(/Rights review:\s*Required — pending review/.test(full));
});

test('middle-card balance + compact risks (content-driven, no fixed heights)', () => {
  const roles = css.match(/\.claw \.sony-brief-roles\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/gap:\s*7px/.test(roles), 'modest gap between OpCo rows');
  // No arbitrary min-heights forcing balance.
  assert.equal(/min-height:\s*[1-9]/.test(css.match(/\.claw \.sony-brief-value[^{]*{[^}]*}/)?.[0] ?? ''), false, 'no forced value min-height');
  // All four risks + three confirmations still render.
  const full = brief(undefined);
  for (const r of ctx.keyRisks) assert.ok(full.includes(r), `risk kept: ${r}`);
  assert.ok(full.includes('An internal Slack collaboration request has been posted for review'));
});
