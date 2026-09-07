/**
 * HX-6V-L — Claude web-chat scene (replaces the Cowork shell).
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 * Rendering: react-dom/server renderToStaticMarkup (no DOM). The static render
 * is the HOME state (convo not yet submitted); conversation-state + interaction
 * behavior are asserted against the scene source, matching existing test style.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
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

// ---- Old Cowork shell fully removed --------------------------------------
test('no Cowork application shell or segmented Cowork/Code header remains', () => {
  // The old Cowork app shell classes are gone from scene + CSS.
  for (const dead of ['cla-mode-seg', 'cla-tasks', 'cla-task-active', 'Sony IP360 · Gateway', 'cla-sidebar', 'cla-account']) {
    assert.equal(src.includes(dead), false, `Cowork shell remnant in scene: ${dead}`);
    assert.equal(css.includes(dead), false, `Cowork shell remnant in CSS: ${dead}`);
  }
  // The "Cowork" label survives ONLY as the composer mode segment (allowed),
  // never as the old Cowork/Code segmented APP switch.
  assert.equal(/cla-mode-seg-active"><[^>]*>\s*Cowork/.test(src), false, 'no Cowork app segment');
});

test('normal web-sidebar Code item is present (no Upgrade pill after HX-6V-M)', () => {
  assert.ok(home.includes('>Code<') || /Code<\/span>/.test(home), 'Code sidebar item');
  assert.equal(home.includes('claw-upgrade-pill'), false, 'no Upgrade pill on Code');
  // And the normal web nav items.
  for (const item of ['New', 'Projects', 'Artifacts', 'Customize', 'Design']) {
    assert.ok(home.includes(item), `sidebar item: ${item}`);
  }
});

// ---- Assets: styled-text wordmark + supplied starburst -------------------
test('styled-text wordmark (no white box) + supplied static starburst', () => {
  // HX-6V-M: brand is styled serif text (raster PNG had an opaque background),
  // greeting still uses the supplied starburst asset.
  assert.ok(/claw-brand-text">Claude</.test(home), 'wordmark as styled serif text');
  assert.equal(home.includes('/logos/claude-wordmark.png'), false, 'no raster wordmark in the brand');
  const p = resolve(repoRoot, 'client/public/logos/claude-star.png');
  assert.ok(existsSync(p) && readFileSync(p).length > 200, 'starburst asset present');
  assert.ok(home.includes('/logos/claude-star.png'), 'starburst used in greeting');
  // No upload/screenshot/imgi_/mov names leak in the scene or asset dir.
  assert.equal(/imgi_|Screenshot|Screen Recording|\.mov|upper left/i.test(src), false, 'no upload names in scene');
});

// ---- Home state -----------------------------------------------------------
test('home: deterministic greeting, static star, large preloaded composer, pills', () => {
  assert.ok(home.includes('Brian Englund returns!'), 'exact time-neutral greeting');
  assert.ok(home.includes('claw-greeting-star'), 'static starburst in greeting');
  // The greeting mark is NOT the animated GIF and carries no animation.
  assert.equal(/claw-greeting[\s\S]*claude-thinking\.gif/.test(home), false, 'greeting mark is static, not the GIF');
  // Large home composer preloaded with the exact prompt.
  assert.ok(home.includes('claw-composer-home'), 'large home composer');
  assert.ok(home.includes(CLAUDE_PROMPT), 'exact preloaded prompt');
  assert.ok(src.includes('useState(CLAUDE_PROMPT)'), 'preloaded via state');
  // Chat selected / Cowork unselected mode segments.
  assert.ok(/claw-mode-seg claw-mode-seg-active">Chat/.test(home), 'Chat selected');
  assert.ok(/claw-mode-seg">Cowork/.test(home), 'Cowork unselected');
  // Model/effort + suggestion pills.
  assert.ok(home.includes('Sonnet 5') && home.includes('Medium'), 'model + effort');
  for (const s of ['Code', 'Write', 'Strategize', 'Learn', 'Life stuff']) {
    assert.ok(home.includes(s), `suggestion pill: ${s}`);
  }
});

test('home composer send is active with the preloaded prompt; Enter submits, Shift+Enter newline', () => {
  // canSend true when prompt present; Enter submits / Shift+Enter newline.
  assert.ok(/canSend = prompt\.trim\(\)\.length > 0/.test(src), 'send enabled when prompt present');
  assert.ok(src.includes("if (e.key === 'Enter' && !e.shiftKey)"), 'Enter submits / Shift+Enter newline');
});

// ---- Home → conversation transition --------------------------------------
test('transition: submit clears composer, guards duplicates, no reload; sidebar gains the chat', () => {
  assert.ok(src.includes('if (convo.submitted || convo.busy) return;'), 'duplicate-send guard');
  assert.ok(src.includes("setPrompt('')"), 'clears composer on submit');
  // Single derived view — no route change / reload between states.
  assert.ok(src.includes('const inConversation = convo.submitted'), 'view derived from submission');
  assert.equal(/location\.(href|reload)|window\.open/.test(src), false, 'no reload/navigation on submit');
  // The IP Council chat row is always present; it gains the selected treatment
  // only once a conversation is active (inConversation-gated class).
  assert.ok(/claw-chat\$\{inConversation \? ' claw-chat-active' : ''\}/.test(src), 'chat selected only in conversation');
  assert.ok(src.includes('{CONVERSATION_TITLE}'), 'IP Council chat row rendered');
});

// ---- Conversation state ---------------------------------------------------
test('conversation: header title + Share, exact user-prompt bubble', () => {
  // Rendered against source (conversation branch is gated on submission).
  assert.ok(src.includes("CONVERSATION_TITLE = 'Sony IP Council executive brief'"), 'exact conversation title');
  assert.ok(src.includes('claw-convo-header') && src.includes('claw-share') && src.includes('Share'), 'header + Share');
  assert.ok(/claw-user-bubble">{CLAUDE_PROMPT}/.test(src), 'exact prompt in the gray user bubble');
  assert.ok(css.includes('.claw-user-bubble'), 'user bubble styled right-aligned gray');
});

test('conversation composer: Write a message… placeholder, muted send while empty', () => {
  assert.ok(src.includes("CONVO_PLACEHOLDER = 'Write a message…'"), 'placeholder text');
  assert.ok(src.includes('claw-composer-convo'), 'conversation composer shell');
  // No coral active send in the conversation composer (matches the reference —
  // the send affordance is the home composer's; conversation shows mic+status).
  assert.ok(/claw-composer-convo[\s\S]*claw-composer-mic/.test(src), 'mic + status on the conversation composer');
});

// ---- Thinking: genuine animated GIF, no rotation --------------------------
test('thinking uses the animated GIF directly with no CSS rotation/spin', () => {
  assert.ok(src.includes('ClaudeThinkingMark'), 'thinking mark used');
  assert.equal(/@keyframes\s+cla-spin/.test(css), false, 'no spin keyframe');
  assert.equal(/\.cla-thinking-mark[^{]*{[^}]*(rotate|infinite)/i.test(css), false, 'mark never rotates/loops');
  const mark = css.match(/\.cla-thinking-mark\s*{[^}]*}/)?.[0] ?? '';
  assert.equal(/animation/.test(mark), false, 'no CSS animation layered on the GIF');
  assert.equal(/rotate/i.test(src), false, 'no rotation in the scene');
});

// ---- 9-step reveal order + writing frontier -------------------------------
test('response reveals in reading order; writing frontier present then removed', () => {
  // Lead-in first, then the brief gated by revealed-1 (steps 2..9).
  assert.ok(/claw-lead-in sony-brief-reveal">{CLAUDE_LEAD_IN}/.test(src), 'lead-in is reveal step 1');
  assert.ok(/revealed={convo\.phase === 'done' \? undefined : Math\.max\(0, convo\.revealed - 1\)}/.test(src),
    'brief gated by revealed-1; settled brief when done');
  // Writing frontier present while revealing, gone when done.
  assert.ok(/phase === 'revealing'[\s\S]*cla-writing[\s\S]*ClaudeThinkingMark[\s\S]*Writing…/.test(src),
    'writing frontier beneath newest content while revealing');
});

// ---- Native answer, not a dashboard card ----------------------------------
test('brief renders as a native answer (outer card neutralized) in the Claude column', () => {
  assert.ok(/\.claw \.sony-brief\s*{[^}]*border:\s*none/.test(css), 'outer card border removed');
  assert.ok(/\.claw \.sony-brief\s*{[^}]*background:\s*none/.test(css), 'outer card background removed');
});

// ---- Exact Sony facts + governance preserved (native brief) ---------------
test('final Sony IP360 facts + governance language preserved', () => {
  // Render the brief fully via the scene is phase-gated; assert via a direct
  // full ExecutiveBrief (used by claudeScene tests). Here confirm the scene
  // wires the governed brief + lead-in and the exact banner via that component.
  assert.ok(src.includes('ExecutiveBrief'), 'governed brief component used');
  assert.ok(src.includes('advance to cross-OpCo review, but not to activation'), 'opening recommendation');
  // The exact banner + Salesforce action live in ExecutiveBrief (asserted in
  // claudeScene.test.tsx); confirm the scene does not override the content.
  assert.equal(/Draft — no audience activated/.test(src), false, 'banner text not hardcoded in the scene');
});

// ---- No live-model / tool / search claims; no forbidden wording -----------
test('no live-model / search / tool / synthetic / demo claims in the Claude scene', () => {
  const low = home.toLowerCase();
  for (const bad of ['live claude', 'searching', 'search the web', 'calling', 'demo data', 'mock', 'synthetic', 'illustrative', 'crm fallback']) {
    assert.equal(low.includes(bad), false, `forbidden in Claude scene: ${bad}`);
  }
});
