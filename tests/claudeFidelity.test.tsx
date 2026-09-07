/**
 * HX-6V-M — Claude web UI fidelity: colors, start-screen layout, composer,
 * plan/upgrade removal, thinking one-line, response cadence, contained scroll.
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
import { CLAUDE_PROMPT } from '../client/src/sony/interactiveFixtures.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const home = renderToStaticMarkup(createElement(ClaudeScene, { context: ctx, activationUrl: null }));
const src = read('client/src/sony/ClaudeScene.tsx');
const css = read('client/src/sony/sony.css');

// ---- Exact background tokens (scoped to .claw) ---------------------------
test('exact Claude sidebar + main background tokens', () => {
  const sidebar = css.match(/\.claw-sidebar\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:\s*#FBFBF9/i.test(sidebar), 'sidebar #FBFBF9');
  const root = css.match(/\.claw\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:\s*#FCFCFB/i.test(root), 'main .claw #FCFCFB');
  const main = css.match(/\.claw-main\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:\s*#FCFCFB/i.test(main), 'main pane #FCFCFB');
  // Colors are scoped to .claw — global .sony / body colors are not touched here.
  assert.equal(/body\s*{[^}]*#FBFBF9/i.test(css), false, 'no global background override');
});

// ---- Wordmark blends (styled text, no white box) -------------------------
test('wordmark is styled serif text (no raster white box)', () => {
  assert.ok(/claw-brand-text">Claude</.test(home), 'brand rendered as text');
  assert.equal(home.includes('/logos/claude-wordmark.png'), false, 'no raster wordmark');
  const brand = css.match(/\.claw-brand-text\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/var\(--claw-serif\)/.test(brand), 'serif treatment');
});

// ---- Time-neutral greeting -----------------------------------------------
test('greeting is the exact time-neutral "Brian Englund returns!" (no clock logic)', () => {
  assert.ok(home.includes('Brian Englund returns!'), 'exact greeting');
  assert.equal(home.includes('Good morning'), false, 'no time-of-day greeting');
  assert.equal(/new Date\(|getHours\(|Date\.now/.test(src), false, 'no time-of-day calculation in the scene');
});

// ---- No Free plan / Upgrade anywhere in the Claude scene -----------------
test('no "Free plan" or "Upgrade" renders in home OR conversation states', () => {
  // Home static render.
  assert.equal(/free plan/i.test(home), false, 'no Free plan on home');
  assert.equal(/upgrade/i.test(home), false, 'no Upgrade on home');
  // The whole scene source carries neither string nor the plan/pill classes,
  // so the conversation state cannot render them either.
  assert.equal(/free plan/i.test(src), false, 'no Free plan in scene source');
  assert.equal(/upgrade/i.test(src), false, 'no Upgrade in scene source');
  assert.equal(/claw-plan|claw-upgrade/i.test(src), false, 'no plan/upgrade elements');
  assert.equal(/claw-plan|claw-upgrade/i.test(css), false, 'no plan/upgrade CSS');
});

// ---- Start composer: two regions, prompt never in the control row --------
test('home composer has a dedicated multiline text region above a separate control row', () => {
  // A distinct text row wraps the multiline field; the tool row is separate.
  assert.ok(/claw-composer-textrow[\s\S]*claw-composer-field-home[\s\S]*claw-home-tools/.test(src),
    'text region precedes the control row');
  // The home field is multiline (rows >= 2) and has a real min-height.
  const rows = Number(src.match(/claw-composer-field-home[\s\S]*?rows={(\d+)}/)?.[1] ?? '0');
  assert.ok(rows >= 2, `home field is multiline (rows=${rows})`);
  const fieldCss = css.match(/\.claw-composer-field-home\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/min-height:\s*(?:4[0-9]|5[0-9])px/.test(fieldCss), 'text region has a real (two-line) min-height');
  // The exact preloaded prompt is present and wired via state; wraps in the field.
  assert.ok(home.includes(CLAUDE_PROMPT), 'exact preloaded prompt');
  assert.ok(src.includes('useState(CLAUDE_PROMPT)'), 'preloaded via state');
  // The prompt is NOT inside the tool row (controls) — the field is in textrow.
  assert.equal(/claw-home-tools[\s\S]*claw-composer-field-home/.test(src), false, 'prompt not in the control row');
});

test('home tool row order: plus, Chat(selected)/Cowork, Sonnet 5, Medium, mic, caret, send', () => {
  const tools = src.match(/claw-home-tools[\s\S]*?claw-send[\s\S]*?<\/button>/)?.[0] ?? '';
  const order = ['claw-composer-plus', 'claw-mode-seg claw-mode-seg-active">Chat', 'Cowork', 'Sonnet 5', 'Medium', 'MicIcon', 'ChevronDownIcon', 'claw-send'];
  let last = -1;
  for (const token of order) {
    const idx = tools.indexOf(token);
    assert.ok(idx > last, `tool out of order or missing: ${token}`);
    last = idx;
  }
  // Send active when the preloaded prompt is present (home render, prompt set).
  assert.ok(/canSend = prompt\.trim\(\)\.length > 0/.test(src), 'send active with a prompt present');
});

// ---- Suggestion chips: icon + label --------------------------------------
test('suggestion chips render an icon + label per Buttons.png', () => {
  for (const label of ['Code', 'Write', 'Strategize', 'Learn', 'Life stuff']) {
    assert.ok(home.includes(`>${label}</span>`), `chip label: ${label}`);
  }
  // Each chip is a button with an accessible label and an inline svg icon.
  assert.ok(/claw-suggestion" tabIndex={-1} aria-label=/.test(src), 'chips labelled + inert');
  assert.ok(/claw-suggestion svg/.test(css), 'chip icon styling');
});

// ---- Neutral profile avatar ----------------------------------------------
test('bottom profile avatar is neutral light-gray (not purple)', () => {
  const avatar = css.match(/\.claw-avatar\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:\s*#E4E2DA/i.test(avatar), 'light-gray avatar');
  assert.equal(/#6a63d6/i.test(avatar), false, 'no purple avatar');
});

// ---- Upper-right outline Claude control (inert, labelled) ----------------
test('upper-right control is the small outline Claude control with an accessible label', () => {
  assert.ok(/claw-home-util[^>]*aria-label="Claude menu"[\s\S]*ClaudeFaceIcon/.test(src)
    || /ClaudeFaceIcon[\s\S]*claw-home-util/.test(src), 'ClaudeFaceIcon in the labelled home-util control');
  assert.ok(/aria-label="Claude menu"/.test(src), 'accessible label');
});

// ---- Conversation header: title + Share; no plan/close -------------------
test('conversation header shows title + Share, no plan pill or close icon', () => {
  assert.ok(src.includes('claw-convo-header') && src.includes('claw-share'), 'header + Share');
  assert.equal(/claw-convo-header[\s\S]*claw-plan|claw-convo-header[\s\S]*CloseIcon/.test(src), false,
    'no plan pill / close icon in the header');
});

// ---- Protected Salesforce URL behavior preserved -------------------------
test('protected Salesforce URL behavior unchanged (governed ActivationLink, no hard-coded URL)', () => {
  // The scene passes activationUrl through to ExecutiveBrief; it does not print
  // or hard-code any Salesforce URL / record id.
  assert.ok(/activationUrl={activationUrl}/.test(src), 'activationUrl passed through');
  assert.equal(/a03bm00001|lightning\.force\.com|Activation__c/.test(src), false, 'no hard-coded SF URL/id');
});
