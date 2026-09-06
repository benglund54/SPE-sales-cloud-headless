/**
 * HX-6V-J — Claude thinking animation + progressive response fidelity.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 * Rendering: react-dom/server renderToStaticMarkup (no DOM, no jsdom).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { ExecutiveBrief } from '../client/src/sony/ExecutiveBrief.tsx';
import { CLAUDE_STAGES, CLAUDE_SECTION_COUNT } from '../client/src/sony/interactiveFixtures.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const brief = (revealed?: number, url: string | null = 'https://x.example/a') =>
  renderToStaticMarkup(createElement(ExecutiveBrief, { context: ctx, activationUrl: url, revealed }));

// ---- Supplied animated asset + no rotation --------------------------------
test('the supplied Claude thinking mark is a genuine animated GIF at a semantic path', () => {
  const p = resolve(repoRoot, 'client/public/logos/claude-thinking.gif');
  assert.ok(existsSync(p), 'claude-thinking.gif present');
  const buf = readFileSync(p);
  // GIF89a magic bytes.
  assert.equal(buf.subarray(0, 6).toString('latin1'), 'GIF89a', 'GIF89a header');
  // Genuinely animated: a NETSCAPE loop extension + many Graphic Control blocks.
  assert.ok(buf.includes(Buffer.from('NETSCAPE2.0', 'latin1')), 'loops (NETSCAPE ext)');
  const gce = buf.toString('latin1').split('!ù').length - 1;
  assert.ok(gce > 50, `many animation frames (saw ~${gce} GCE blocks)`);
});

test('the activity mark uses the semantic asset; reduced motion swaps to the static PNG', () => {
  const icons = read('client/src/sony/icons.tsx');
  assert.ok(/ClaudeThinkingMark/.test(icons), 'ClaudeThinkingMark exists');
  assert.ok(/claude-thinking\.gif/.test(icons), 'animated GIF wired');
  assert.ok(/isStatic\s*\?\s*'\/logos\/claude\.png'/.test(icons), 'reduced-motion → static claude.png');
  const scene = read('client/src/sony/ClaudeScene.tsx');
  assert.ok(/ClaudeThinkingMark[^>]*static={reducedMotion}/.test(scene), 'scene passes reducedMotion to the mark');
});

test('NO Claude thinking/writing element rotates or spins infinitely', () => {
  const css = read('client/src/sony/sony.css');
  // The old spinning treatment is gone entirely.
  assert.equal(/@keyframes\s+cla-spin/.test(css), false, 'cla-spin keyframe removed');
  assert.equal(/cla-preparing-mark/.test(css), false, 'old spinning mark class removed');
  // No rotate transform and no infinite animation anywhere in the Claude marks.
  assert.equal(/\.cla-[a-z-]*mark[^{]*{[^}]*(rotate|infinite)/i.test(css), false, 'marks never rotate/loop');
  // The animated GIF must not carry a CSS animation on top.
  const mark = css.match(/\.cla-thinking-mark\s*{[^}]*}/)?.[0] ?? '';
  assert.equal(/animation/.test(mark), false, 'no CSS animation layered on the GIF mark');
  const scene = read('client/src/sony/ClaudeScene.tsx');
  assert.equal(/rotate/i.test(scene), false, 'no rotation in the scene');
});

// ---- Reasoning progression: one active, completed settled above -----------
test('reasoning shows one active state with the mark, completed states settled above, in order', () => {
  const scene = read('client/src/sony/ClaudeScene.tsx');
  // Completed states rendered from CLAUDE_STAGES[0..stageIndex-1] muted.
  assert.ok(/CLAUDE_STAGES\.slice\(0,\s*convo\.stageIndex\)/.test(scene), 'completed states above');
  assert.ok(/cla-reason-done/.test(scene), 'muted settled style for completed');
  assert.ok(/cla-reason-active/.test(scene), 'one active state');
  // Active mark sits immediately to the LEFT of the active text.
  assert.ok(/cla-reason-active[\s\S]*ClaudeThinkingMark[\s\S]*cla-reason-text/.test(scene),
    'mark precedes the active text');
  // Calm crossfade on the TEXT only (keyed on the stage), never the mark.
  assert.ok(/cla-reason-crossfade/.test(scene), 'text crossfades');
  const css = read('client/src/sony/sony.css');
  assert.ok(/cla-crossfade[\s\S]*from\s*{\s*opacity:\s*0\.7/.test(css), 'crossfade never fades to 0');
  assert.equal(/cla-crossfade[^}]*infinite/.test(css), false, 'crossfade is not an infinite loop');
  // The governed reasoning copy is unchanged.
  assert.equal(CLAUDE_STAGES[0], 'Working on it…');
  assert.equal(CLAUDE_STAGES[1], 'Thinking…');
});

test('reasoning progress copy never claims a live model, search, or external tool', () => {
  const joined = CLAUDE_STAGES.join(' ').toLowerCase();
  for (const bad of ['searching', 'search the web', 'querying', 'calling', 'api', 'tool', 'fetching', 'live claude']) {
    assert.equal(joined.includes(bad), false, `reasoning copy implies external activity: ${bad}`);
  }
});

// ---- Response reveals in the specified 9-step reading order ---------------
test('CLAUDE_SECTION_COUNT drives nine reveal increments', () => {
  assert.equal(CLAUDE_SECTION_COUNT, 9);
});

test('the brief reveals in reading order; banner + Salesforce action appear last', () => {
  // ExecutiveBrief gates eight steps (scene reveals the lead-in first, then
  // passes revealed-1). Step 1 = header only.
  const s1 = brief(1);
  assert.ok(s1.includes('Executive Decision Brief') && s1.includes('Spider-Man EMEA Connected Fan Moment'), 'header first');
  assert.equal(s1.includes('Executive recommendation'), false, 'reco not yet at step 1');
  // Step 2 adds the recommendation.
  assert.ok(brief(2).includes('Executive recommendation'), 'reco at step 2');
  // Grounded facts (3), connected value (4), decisions (5), risks (6).
  assert.ok(brief(3).includes('Grounded facts'), 'facts at step 3');
  assert.ok(brief(4).includes('Connected Sony value'), 'value at step 4');
  assert.ok(brief(5).includes('Decisions still pending'), 'decisions at step 5');
  assert.ok(brief(6).includes('Risks &amp; guardrails'), 'risks at step 6');
  // Banner appears at step 7 — and NOT before.
  assert.equal(brief(6).includes('Draft — no audience activated'), false, 'banner not before step 7');
  assert.ok(brief(7).includes('Draft — no audience activated and no customer communication sent.'), 'banner at step 7');
  // Salesforce action is LAST (step 8) — not present at step 7.
  assert.equal(brief(7).includes('Review governed activation in Salesforce'), false, 'action not before step 8');
  assert.ok(brief(8).includes('Review governed activation in Salesforce'), 'Salesforce action last');
});

test('brief still renders EXACTLY five section cards, and the static default shows all', () => {
  const full = brief(undefined);
  assert.equal((full.match(/class="sony-brief-section/g) || []).length, 5, 'exactly five section cards');
  // Static default (no reveal wrapper class) + full content.
  assert.equal(/sony-brief-reveal/.test(full), false, 'static default carries no reveal-entrance class');
  assert.ok(full.includes('Review governed activation in Salesforce') && full.includes('Draft — no audience activated'));
});

// ---- Writing frontier present while building, gone when done --------------
test('Writing indicator follows the frontier while revealing and disappears when done', () => {
  const scene = read('client/src/sony/ClaudeScene.tsx');
  // Present only while revealing, rendered AFTER the brief (frontier), with the
  // orange mark; removed at done.
  assert.ok(/phase === 'revealing'[\s\S]*cla-writing[\s\S]*ClaudeThinkingMark[\s\S]*Writing…/.test(scene),
    'writing indicator beneath newest content while revealing');
  // On done, the brief renders statically (revealed undefined) and no writing row.
  assert.ok(/phase === 'done' \? undefined/.test(scene), 'done renders the settled brief');
});

// ---- Completed content is opaque + reveal settles permanently -------------
test('progressive-reveal entrance settles permanently opaque (both), subtle upward slide', () => {
  const css = read('client/src/sony/sony.css');
  // Match the full keyframe including the nested from/to brace blocks.
  const kf = css.match(/@keyframes cla-reveal\s*{[\s\S]*?}\s*}/)?.[0] ?? '';
  assert.ok(/from\s*{\s*opacity:\s*0;\s*transform:\s*translateY\(5px\)/.test(kf), 'enters +5px up, faded');
  assert.ok(/to\s*{\s*opacity:\s*1;\s*transform:\s*none/.test(kf), 'settles at full opacity, no transform');
  assert.ok(/\.sony-brief-reveal\s*{\s*animation:\s*cla-reveal\s*3[0-9]{2}ms[^}]*both/.test(css),
    'reveal ~340ms and fills-forwards (both) so content stays opaque');
});

// ---- Reduced motion completes without animated transforms -----------------
test('reduced motion disables crossfade + reveal transforms and keeps a static mark', () => {
  const css = read('client/src/sony/sony.css');
  const rm = css.match(/@media \(prefers-reduced-motion: reduce\)\s*{[\s\S]*?}\s*}/g)?.join('\n') ?? '';
  assert.ok(/cla-reason-crossfade\s*{\s*animation:\s*none/.test(rm), 'crossfade off under reduced motion');
  assert.ok(/sony-brief-reveal\s*{\s*animation:\s*none;\s*opacity:\s*1;\s*transform:\s*none/.test(rm),
    'reveal transforms off, content visible under reduced motion');
});

// ---- Contained scroll (never the viewport) --------------------------------
test('scroll following is contained (scrollTop/scrollTo on the element) and smooth for Claude', () => {
  const hook = read('client/src/sony/useFollowScroll.ts');
  // Never CALLS scrollIntoView (which would move the whole viewport). The word
  // may appear in the doc comment explaining why it is avoided.
  assert.equal(/\.scrollIntoView\s*\(/.test(hook), false, 'never calls scrollIntoView');
  assert.ok(/el\.scrollTo\(\{\s*top:\s*el\.scrollHeight,\s*behavior:\s*'smooth'/.test(hook), 'smooth contained follow');
  assert.ok(/reducedMotion/.test(hook), 'reduced motion forces an instant jump');
  const scene = read('client/src/sony/ClaudeScene.tsx');
  assert.ok(/useFollowScroll[\s\S]*{\s*smooth:\s*true,\s*reducedMotion\s*}/.test(scene), 'Claude opts into smooth follow');
});
