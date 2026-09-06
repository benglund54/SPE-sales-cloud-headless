/**
 * HX-6V-F — Teams native fidelity, composer state, timestamp, motion, reveal.
 *
 * Runner: node --import tsx --test tests/*.test.tsx  (+ .test.ts for helpers)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { TeamsScene } from '../client/src/sony/TeamsScene.tsx';
import { PlayStationDecisionCard } from '../client/src/sony/PlayStationDecisionCard.tsx';
import { formatTeamsTime } from '../client/src/sony/teamsTime.ts';
import { TEAMS_PROMPT, TEAMS_SECTION_COUNT } from '../client/src/sony/interactiveFixtures.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const teams = renderToStaticMarkup(
  createElement(TeamsScene, { context: ctx, activationUrl: 'https://x/a' })
);

// ---- Genuine supplied Teams assets ---------------------------------------
test('supplied Teams UI assets exist under the semantic path (no metadata)', () => {
  for (const f of [
    'teams', 'copilot', 'chat', 'video', 'activity', 'calendar', 'search',
    'compose', 'overflow', 'check-circle', 'image',
    // HX-6V-H supplied assets, stored under semantic names (not the upload names):
    'send', 'chat-rail',
  ]) {
    const p = resolve(repoRoot, `client/public/icons/teams/${f}.png`);
    assert.ok(existsSync(p), `missing icon: ${f}.png`);
    assert.ok(readFileSync(p).length > 100, `${f}.png too small`);
  }
  // No Apple metadata sneaked in.
  assert.equal(existsSync(resolve(repoRoot, 'client/public/icons/teams/__MACOSX')), false);
});

test('Teams rail: genuine Copilot + camera assets; correct SVGs where PNGs did not match', () => {
  // Genuine assets that visibly match:
  assert.ok(teams.includes('/icons/teams/copilot.png'), 'multicolor Copilot mark');
  assert.ok(teams.includes('/icons/teams/video.png'), 'camera (Meet)');
  assert.ok(teams.includes('/icons/teams/activity.png'), 'bell (Activity)');
  // Re-audit (HX-6V-G): the committed chat/teams/calendar PNGs did not depict
  // their function, so they are NOT used in the rail.
  assert.equal(teams.includes('/icons/teams/chat.png'), false, 'panel-glyph not used as Chat');
  assert.equal(teams.includes('/icons/teams/teams.png'), false, 'grid-glyph not used as Teams/brand');
  assert.equal(teams.includes('/icons/teams/calendar.png'), false, 'contact-card glyph not used as Calendar');
  // HX-6V-H: the rail Chat slot now uses the supplied purple speech-bubble.
  assert.ok(teams.includes('/icons/teams/chat-rail.png'), 'supplied purple Chat bubble in the rail');
});

// ---- Realistic chrome anchors --------------------------------------------
test('Teams chrome: presenter profile (Brian Englund) with presence, icon rail', () => {
  assert.ok(teams.includes('Brian Englund'), 'presenter profile label');
  assert.ok(teams.includes('tms-presence'), 'presence indicator');
  assert.ok(teams.includes('tms-rail-item'), 'icon rail buttons');
  // Old oversized icon+label rail treatment removed (no rail <span> labels).
  assert.equal(teams.includes('<span>Chat</span>'), false, 'no icon+label rail treatment');
});

// ---- Composer controls + accessible labels -------------------------------
test('composer contains the expected Teams tool controls with accessible labels', () => {
  // The interactive composer (with tools) is in the advisor view; render it by
  // reading the scene source (the static default render shows the planning
  // view). All controls carry accessible names.
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  for (const label of ['Emoji', 'Attach file', 'Attach image', 'Loop component', 'More actions', 'Send']) {
    assert.ok(src.includes(`aria-label="${label}"`), `missing control: ${label}`);
  }
  assert.ok(src.includes('tms-tool-divider'), 'divider before send');
});

test('composer preloads the exact PlayStation question (advisor-view textarea)', () => {
  assert.equal(TEAMS_PROMPT, 'What does PlayStation need to decide?');
  // Static render is the planning view; the advisor composer initializes from
  // the fixture. Assert the scene wires the preload + placeholder + clear.
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  assert.ok(src.includes('useState(TEAMS_PROMPT)'), 'preloaded value');
  assert.ok(src.includes("PLACEHOLDER = 'Type a message'"), 'placeholder constant');
  assert.ok(src.includes("setPrompt('')"), 'clears composer on submit');
  assert.ok(src.includes('placeholder={PLACEHOLDER}'), 'placeholder wired on textarea');
});

test('submit wrapper: captures time once, clears composer, guards duplicates', () => {
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  assert.ok(src.includes('if (convo.submitted || convo.busy) return;'), 'duplicate-send guard');
  assert.ok(src.includes('setSentAt(now())'), 'timestamp captured once at submit');
  assert.ok(src.includes("if (e.key === 'Enter' && !e.shiftKey)"), 'Enter submits / Shift+Enter newline');
});

// ---- Timestamp helper is deterministic -----------------------------------
test('formatTeamsTime is deterministic, 12-hour, Today-prefixed', () => {
  const t = formatTeamsTime(new Date('2026-09-05T07:44:00').getTime());
  assert.match(t, /^Today \d{1,2}:\d{2}\s?(AM|PM)$/);
  // Same input → same output (never drifts).
  assert.equal(t, formatTeamsTime(new Date('2026-09-05T07:44:00').getTime()));
});

// ---- Reasoning motion + reveal order -------------------------------------
test('reasoning uses the Advisor mark + a CALM single crossfade (no flashing loop)', () => {
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  assert.ok(css.includes('tms-crossfade'), 'single crossfade keyframe');
  // No repeating/infinite opacity loop, and never fades below ~75%.
  assert.equal(css.includes('tms-breathe'), false, 'old repeating breathe loop removed');
  assert.equal(/tms-progress-text\s*{[^}]*infinite/.test(css), false, 'no infinite loop on the phrase');
  assert.ok(/tms-crossfade[\s\S]*from\s*{\s*opacity:\s*0\.7[0-9]?/.test(css), 'min opacity ~0.75, never flashes to 0');
  assert.ok(css.includes('prefers-reduced-motion'), 'reduced-motion honored');
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  assert.ok(src.includes('tms-progress-mark'), 'advisor mark beside reasoning');
});

test('decision card reveals in order; banner + Salesforce action appear last', () => {
  assert.equal(TEAMS_SECTION_COUNT, 7);
  const r1 = renderToStaticMarkup(createElement(PlayStationDecisionCard, { context: ctx, activationUrl: null, revealed: 1 }));
  assert.ok(r1.includes('Marvel’s Spider-Man titles provide the relevant catalog anchor.'));
  assert.equal(r1.includes(ctx.decisions.playstation[0]), false, 'decisions not yet at step 1');
  assert.equal(r1.includes('Draft — no audience activated'), false, 'banner not yet at step 1');

  const r6 = renderToStaticMarkup(createElement(PlayStationDecisionCard, { context: ctx, activationUrl: null, revealed: 6 }));
  assert.ok(r6.includes('Not shared or activated'), 'restricted block by step 6');
  assert.equal(r6.includes('Draft — no audience activated'), false, 'banner still not shown at step 6');

  const r7 = renderToStaticMarkup(createElement(PlayStationDecisionCard, { context: ctx, activationUrl: 'https://x/a', revealed: 7 }));
  assert.ok(r7.includes('Draft — no audience activated and no customer communication sent.'), 'banner last');
  assert.ok(r7.includes('Review governed activation in Salesforce'), 'Salesforce action last');
});

// ---- HX-6V-G: single-line composer + outline send + profile + timing -----
test('composer is a single horizontal flex strip (no reserved second toolbar row)', () => {
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  // Outer box is a horizontal flex row with centered items, capped height.
  const box = css.match(/\.tms-composer-box\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/display:\s*flex/.test(box), 'flex row');
  assert.ok(/align-items:\s*center/.test(box), 'vertically centered');
  assert.equal(/flex-direction:\s*column/.test(box), false, 'not a stacked column');
  assert.ok(/min-height:\s*4[0-9]px/.test(box), 'compact single-line min-height ~44px');
  // Control group is pushed to the far right.
  const tools = css.match(/\.tms-composer-tools\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/margin-left:\s*auto/.test(tools), 'controls right-aligned');
  // Text region flexes.
  const field = css.match(/\.tms-composer-field\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/flex:\s*1/.test(field), 'text region flexes to fill');
});

test('composer control order and accessible labels', () => {
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  // Scope to the composer tool row (after the divider marker up to send).
  const order = ['Emoji', 'Attach file', 'Attach image', 'Loop component', 'More actions', 'Send'];
  let last = -1;
  for (const label of order) {
    const idx = src.indexOf(`aria-label="${label}"`);
    assert.ok(idx > last, `control out of order: ${label}`);
    last = idx;
  }
  assert.ok(src.includes('tms-tool-divider'), 'divider before send');
});

test('send button uses the supplied right-facing send PNG — never a solid purple fill', () => {
  // HX-6V-H: the send icon is now the supplied /icons/teams/send.png, rendered
  // via TeamsSendAsset. The old diagonal SendArrowIcon SVG is no longer wired
  // into the composer send slot, and there is no rotate transform on it.
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  const sendBtn = src.match(/tms-composer-sendbtn[\s\S]*?<\/button>/)?.[0] ?? '';
  assert.ok(sendBtn.includes('TeamsSendAsset'), 'send slot renders the supplied send asset');
  assert.equal(sendBtn.includes('SendArrowIcon'), false, 'old diagonal SVG not in the send slot');
  assert.equal(/rotate|transform/i.test(sendBtn), false, 'supplied icon is not rotated/redrawn');
  // Accessible name / tooltip / click preserved on the button.
  assert.ok(sendBtn.includes('aria-label="Send"') && sendBtn.includes('title="Send"'), 'labelled Send');
  assert.ok(sendBtn.includes('onClick={submit}') && sendBtn.includes('disabled={!canSend}'), 'click + disabled preserved');
  // The TeamsSendAsset maps to the semantic send.png (not the upload filename).
  const icons = readFileSync(resolve(repoRoot, 'client/src/sony/icons.tsx'), 'utf8');
  assert.ok(/TeamsSendAsset[\s\S]*?file="send\.png"/.test(icons), 'TeamsSendAsset → send.png');
  // Resting send button is gray (not a solid purple background/fill).
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  const btn = css.match(/\.tms-composer-sendbtn\s*{[^}]*}/)?.[0] ?? '';
  assert.equal(/background:\s*#5b5fc7/.test(btn), false, 'no solid purple resting background');
  assert.ok(/color:\s*#5b5b5b/.test(btn), 'gray when resting');
});

test('desktop profile shows Brian Englund name + presence at presentation width', () => {
  assert.ok(teams.includes('tms-profile-name'), 'profile name element present');
  assert.ok(teams.includes('Brian Englund'), 'presenter name');
  assert.ok(teams.includes('tms-presence'), 'presence indicator');
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  // Name collapses only below the presentation breakpoint.
  assert.ok(/@media \(max-width: 1180px\)[\s\S]*tms-profile-name\s*{\s*display:\s*none/.test(css), 'name collapses only when narrow');
});

test('updated timing: reasoning ~4.7s, reveal ~640ms/step (total ~10–11.5s)', () => {
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  assert.ok(src.includes('1550'), 'reasoning stageMs ~1550 (3 states ≈ 4.7s)');
  assert.ok(src.includes('640'), 'reveal revealMs ~640');
});

// ---- Opening notification still complete ---------------------------------
test('v14 opening notification content preserved within the refined chrome', () => {
  assert.ok(teams.includes('Cross-Sony Collaboration Request'));
  assert.ok(teams.includes('Spider-Man EMEA opportunity ready for review'));
  assert.ok(teams.includes('Source: Governed Sony IP360 CRM signals'));
  for (const m of ['1.85M', '91.58', '82.3', '84', '53.9']) assert.ok(teams.includes(m));
  assert.ok(teams.includes('Draft — no audience activated and no customer communication sent.'));
  assert.ok(teams.includes('Open Sony IP360 Advisor'));
});

// ---- HX-6V-H: Favorites Advisor avatar, one-line profile, supplied icons ---
test('Favorites-list Advisor avatar is enlarged and scoped to that row only', () => {
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  // The Favorites row avatar carries the scoping class and a larger artwork.
  assert.ok(/tms-chat-avatar tms-chat-avatar-advisor[\s\S]*?<AdvisorIcon size={2[6-8]} \/>/.test(src),
    'Favorites Advisor artwork enlarged (~27px in a 32px circle ≈ 84%)');
  // The OTHER Advisor marks (conversation header, turn avatar, reasoning) keep
  // their smaller sizes — the enlargement is NOT applied globally.
  assert.ok(src.includes('tms-conv-avatar" aria-hidden="true"><AdvisorIcon size={22}'), 'header avatar unchanged');
  assert.ok(src.includes('tms-turn-avatar" aria-hidden="true"><AdvisorIcon size={20}'), 'turn avatar unchanged');
  assert.ok(src.includes('tms-progress-mark" aria-hidden="true"><AdvisorIcon size={16}'), 'reasoning mark unchanged');
  // The scoping class is defined only for the Favorites avatar, with contain fit.
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  const rule = css.match(/\.tms-chat-avatar-advisor img\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/object-fit:\s*contain/.test(rule), 'artwork keeps aspect ratio (contain)');
});

test('top-bar profile is a single nonwrapping one-line group (Brian Englund)', () => {
  assert.ok(teams.includes('Brian Englund'), 'presenter name');
  assert.ok(teams.includes('tms-presence'), 'presence indicator');
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  const right = css.match(/\.tms-topbar-right\s*{[^}]*}/g)?.join('\n') ?? '';
  assert.ok(/white-space:\s*nowrap/.test(right), 'right group never wraps');
  assert.ok(/flex-shrink:\s*0/.test(right), 'right group does not shrink');
  const name = css.match(/\.tms-profile-name\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/white-space:\s*nowrap/.test(name), 'name never wraps');
  assert.ok(/flex-shrink:\s*0/.test(name), 'name never shrinks');
  const prof = css.match(/\.tms-profile\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/align-items:\s*center/.test(prof), 'vertically centered');
  assert.ok(/white-space:\s*nowrap/.test(prof), 'profile group never wraps');
  // The top-bar right grid column sizes to the group (auto) so the centered
  // search bar is never displaced.
  const bar = css.match(/\.tms-topbar\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/grid-template-columns:\s*120px 1fr auto/.test(bar), 'right column auto-sizes to the profile group');
  // The name still collapses only at genuinely narrow widths.
  assert.ok(/@media \(max-width: 1180px\)[\s\S]*tms-profile-name\s*{\s*display:\s*none/.test(css), 'name collapses only when narrow');
});

test('supplied upload filenames never appear in committed sources or assets', () => {
  // The uploads (\"Send Icon.png\", \"Chat Icon.png\") must be stored under
  // semantic names only; the original upload names must not leak anywhere.
  for (const rel of [
    'client/src/sony/TeamsScene.tsx',
    'client/src/sony/icons.tsx',
    'client/src/sony/sony.css',
  ]) {
    const src = readFileSync(resolve(repoRoot, rel), 'utf8');
    // Match the literal upload filenames (with extension) and the macOS/upload
    // \"imgi_\" prefix — not the ordinary English words \"send icon\".
    assert.equal(/Send Icon\.png|Chat Icon\.png|imgi_/i.test(src), false, `upload filename leaked in ${rel}`);
  }
  // And no such files were copied into the public asset dir.
  for (const bad of ['Send Icon.png', 'Chat Icon.png']) {
    assert.equal(existsSync(resolve(repoRoot, `client/public/icons/teams/${bad}`)), false, `${bad} present`);
  }
});

// ---- HX-6V-I: Teams Chat rail calibration --------------------------------
test('selected Chat rail icon is enlarged (~30–32px), same supplied asset', () => {
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  // Still the supplied semantic asset, now rendered larger to match real Teams.
  const chatBtn = src.match(/tms-rail-item-chat-selected[\s\S]*?<\/button>/)?.[0] ?? '';
  assert.ok(chatBtn.includes('TeamsChatRailAsset'), 'still uses the supplied chat-rail asset');
  const size = Number(chatBtn.match(/TeamsChatRailAsset size={(\d+)}/)?.[1] ?? '0');
  assert.ok(size >= 30 && size <= 32, `chat icon enlarged to ~30–32px (got ${size})`);
  // Accessibility + label preserved.
  assert.ok(chatBtn.includes('aria-label="Chat"') && chatBtn.includes('title="Chat"'), 'labelled Chat');
  // Asset still maps to the semantic path (not the upload name).
  const icons = readFileSync(resolve(repoRoot, 'client/src/sony/icons.tsx'), 'utf8');
  assert.ok(/TeamsChatRailAsset[\s\S]*?file="chat-rail\.png"/.test(icons), 'TeamsChatRailAsset → chat-rail.png');
});

test('selected Chat cell is a full-width solid-white cell — no lavender tile, no indicator', () => {
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  const rule = css.match(/\.tms-rail-item-chat-selected\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:\s*#fff/i.test(rule), 'solid white background');
  assert.ok(/align-self:\s*stretch/.test(rule), 'stretches to full rail width');
  assert.ok(/width:\s*100%/.test(rule), 'full width');
  assert.ok(/border-radius:\s*0/.test(rule), 'no rounded tile');
  // No border or shadow (and therefore no inner white square).
  assert.ok(/border:\s*none/.test(rule), 'no border');
  assert.ok(/box-shadow:\s*none/.test(rule), 'no shadow');
  // The active indicator bar is suppressed for the selected Chat state.
  const before = css.match(/\.tms-rail-item-chat-selected::before\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/content:\s*none/.test(before), 'active indicator bar removed for Chat');
  // Chat no longer carries the generic lavender active treatment.
  const scene = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  const chatBtn = scene.match(/aria-label="Chat"[\s\S]*?<\/button>/)?.[0] ?? '';
  assert.equal(/tms-rail-item-active/.test(scene.match(/tms-rail-item[^"]*"\s+aria-label="Chat"/)?.[0] ?? ''), false,
    'Chat button no longer uses the generic lavender active class');
});

test('other rail items keep the existing light-gray (non-white, non-stretched) treatment', () => {
  const scene = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  // Only the Chat button carries the white full-cell selection; the other rail
  // items remain plain .tms-rail-item.
  const selectedCount = (scene.match(/tms-rail-item-chat-selected/g) ?? []).length;
  assert.equal(selectedCount, 1, 'exactly one selected (Chat) rail cell');
  for (const label of ['Meet', 'Teams', 'Copilot', 'Calendar', 'Activity']) {
    const btn = scene.match(new RegExp(`className="tms-rail-item"[^>]*aria-label="${label}"`))?.[0] ?? '';
    assert.ok(btn.length > 0, `${label} is a plain rail item`);
    assert.equal(/chat-selected/.test(btn), false, `${label} is not white-selected`);
  }
  // The generic active rule still exists (unused by Chat now) with the lavender
  // wash — untouched for any future/other use.
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  assert.ok(/\.tms-rail-item-active\s*{\s*background:\s*rgba\(91,95,199,0\.12\)/.test(css), 'generic active treatment untouched');
});
